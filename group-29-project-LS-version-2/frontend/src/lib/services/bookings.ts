import { Prisma, type Booking } from "@prisma/client";
import { z } from "zod";
import { ApiError } from "../api-error";
import { getCurrentUser } from "../session";
import { prisma } from "../prisma";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must use YYYY-MM-DD format.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Date is not a valid calendar day.");

export const bookingInputSchema = z
  .strictObject({
    propertyId: z.string().trim().min(1),
    checkIn: dateStringSchema,
    checkOut: dateStringSchema,
    guests: z.coerce.number().int().min(1),
  })
  .superRefine(({ checkIn, checkOut }, context) => {
    const start = new Date(`${checkIn}T00:00:00.000Z`).getTime();
    const end = new Date(`${checkOut}T00:00:00.000Z`).getTime();
    const nights = (end - start) / DAY_IN_MILLISECONDS;

    if (nights < 1 || nights > 30) {
      context.addIssue({
        code: "custom",
        message: "A stay must be between 1 and 30 nights.",
        path: ["checkOut"],
      });
    }
  });

export type BookingInput = z.infer<typeof bookingInputSchema>;

export function validateBookingDates(
  input: unknown,
  now: Date = new Date(),
): BookingInput & { checkInDate: Date; checkOutDate: Date; nights: number } {
  const validated = bookingInputSchema.parse(input);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const checkInDate = new Date(`${validated.checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${validated.checkOut}T00:00:00.000Z`);

  if (checkInDate.getTime() < today) {
    throw new z.ZodError([
      {
        code: "custom",
        message: "Check-in cannot be in the past.",
        path: ["checkIn"],
      },
    ]);
  }

  return {
    ...validated,
    checkInDate,
    checkOutDate,
    nights: (checkOutDate.getTime() - checkInDate.getTime()) / DAY_IN_MILLISECONDS,
  };
}

type BookingDateRange = Pick<Booking, "checkIn" | "checkOut" | "status">;

export function hasDateOverlap(
  ranges: BookingDateRange[],
  checkIn: Date,
  checkOut: Date,
): boolean {
  return ranges.some(
    (range) =>
      (range.status === "PENDING" || range.status === "CONFIRMED") &&
      range.checkIn < checkOut &&
      range.checkOut > checkIn,
  );
}

export function calculateBookingPrice(pricePerNight: number, nights: number): number {
  if (!Number.isSafeInteger(pricePerNight) || pricePerNight < 0) {
    throw new RangeError("Price per night must be a non-negative safe integer.");
  }

  if (!Number.isSafeInteger(nights) || nights < 1 || nights > 30) {
    throw new RangeError("Nights must be an integer between 1 and 30.");
  }

  const total = pricePerNight * nights;
  if (!Number.isSafeInteger(total)) {
    throw new RangeError("Booking total exceeds the supported amount.");
  }
  return total;
}

export async function createBooking(input: unknown) {
  const { checkInDate, checkOutDate, nights, ...validated } = validateBookingDates(input);
  const guest = await getCurrentUser();

  return prisma.$transaction(
    async (transaction) => {
      const property = await transaction.property.findFirst({
        where: { id: validated.propertyId, published: true },
        select: { id: true, pricePerNight: true, maxGuests: true },
      });

      if (!property) {
        throw new ApiError(404, "PROPERTY_NOT_FOUND", "Published property not found.");
      }

      if (validated.guests > property.maxGuests) {
        throw new ApiError(400, "GUEST_LIMIT_EXCEEDED", "Guest count exceeds this property's capacity.");
      }

      const overlappingBooking = await transaction.booking.findFirst({
        where: {
          propertyId: property.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
        },
        select: { id: true },
      });

      if (overlappingBooking) {
        throw new ApiError(409, "DATES_UNAVAILABLE", "The property is already booked for those dates.");
      }

      return transaction.booking.create({
        data: {
          propertyId: property.id,
          userId: guest.id,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: validated.guests,
          nights,
          totalPrice: calculateBookingPrice(property.pricePerNight, nights),
          status: "PENDING",
        },
        select: {
          id: true,
          propertyId: true,
          checkIn: true,
          checkOut: true,
          guests: true,
          nights: true,
          totalPrice: true,
          status: true,
          createdAt: true,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
