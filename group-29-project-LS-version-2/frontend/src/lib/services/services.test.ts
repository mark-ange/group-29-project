import { describe, expect, it, vi } from "vitest";
vi.mock("@/auth", () => ({ auth: vi.fn() }));
import {
  bookingInputSchema,
  calculateBookingPrice,
  hasDateOverlap,
  validateBookingDates,
} from "./bookings";
import { propertyFiltersSchema } from "./properties";

describe("booking price calculation", () => {
  it("calculates the total using the server-side nightly price and nights", () => {
    expect(calculateBookingPrice(25000, 3)).toBe(75000);
  });

  it("rejects invalid prices and night counts", () => {
    expect(() => calculateBookingPrice(-5, 2)).toThrow(RangeError);
    expect(() => calculateBookingPrice(5000, 31)).toThrow(RangeError);
  });
});

describe("booking date rules", () => {
  const now = new Date("2026-10-28T19:00:00.000Z");
  const validInput = {
    propertyId: "property-1",
    checkIn: "2026-10-29",
    checkOut: "2026-11-01",
    guests: 2,
  };

  it("accepts valid calendar dates and returns UTC dates and nights", () => {
    expect(validateBookingDates(validInput, now)).toMatchObject({
      nights: 3,
      checkInDate: new Date("2026-10-29T00:00:00.000Z"),
      checkOutDate: new Date("2026-11-01T00:00:00.000Z"),
    });
  });

  it("rejects past dates, invalid calendar days, and stays outside 1 to 30 nights", () => {
    expect(() => validateBookingDates({ ...validInput, checkIn: "2026-10-27" }, now)).toThrow();
    expect(bookingInputSchema.safeParse({ ...validInput, checkIn: "2026-02-30" }).success).toBe(false);
    expect(bookingInputSchema.safeParse({ ...validInput, checkOut: "2026-10-29" }).success).toBe(false);
    expect(bookingInputSchema.safeParse({ ...validInput, checkOut: "2026-12-01" }).success).toBe(false);
  });
});

describe("booking overlap", () => {
  const existingBookings = [
    {
      checkIn: new Date("2026-11-01T00:00:00.000Z"),
      checkOut: new Date("2026-11-04T00:00:00.000Z"),
      status: "CONFIRMED",
    },
  ];

  it("detects intersecting ranges but permits back-to-back stays", () => {
    expect(
      hasDateOverlap(
        existingBookings,
        new Date("2026-11-03T00:00:00.000Z"),
        new Date("2026-11-05T00:00:00.000Z"),
      ),
    ).toBe(true);
    expect(
      hasDateOverlap(
        existingBookings,
        new Date("2026-11-04T00:00:00.000Z"),
        new Date("2026-11-06T00:00:00.000Z"),
      ),
    ).toBe(false);
  });
});

describe("property filter schema", () => {
  it("parses supported filters and applies pagination defaults", () => {
    expect(
      propertyFiltersSchema.parse({
        city: "Par",
        guests: "4",
        minPrice: "10000",
        maxPrice: "60000",
        sort: "price-asc",
      }),
    ).toMatchObject({
      city: "Par",
      guests: 4,
      minPrice: 10000,
      maxPrice: 60000,
      sort: "price-asc",
      page: 1,
      pageSize: 20,
    });
  });

  it("requires complete date pairs and caps page size at 50", () => {
    expect(propertyFiltersSchema.safeParse({ checkIn: "2026-11-01" }).success).toBe(false);
    expect(propertyFiltersSchema.safeParse({ pageSize: "51" }).success).toBe(false);
    expect(propertyFiltersSchema.safeParse({ minPrice: "50000", maxPrice: "10000" }).success).toBe(false);
  });
});
