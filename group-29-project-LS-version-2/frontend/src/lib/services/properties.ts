import { z } from "zod";
import { ApiError } from "../api-error";
import { prisma } from "../prisma";
import { dateStringSchema } from "./bookings";

export const propertyFiltersSchema = z
  .strictObject({
    destination: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    guests: z.coerce.number().int().min(1).optional(),
    minPrice: z.coerce.number().finite().min(0).optional(),
    maxPrice: z.coerce.number().finite().min(0).optional(),
    checkIn: dateStringSchema.optional(),
    checkOut: dateStringSchema.optional(),
    sort: z.enum(["price-asc", "price-desc", "newest"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  .superRefine((filters, context) => {
    if (Boolean(filters.checkIn) !== Boolean(filters.checkOut)) {
      context.addIssue({
        code: "custom",
        message: "checkIn and checkOut must be provided together.",
        path: [filters.checkIn ? "checkOut" : "checkIn"],
      });
    }

    if (
      filters.checkIn &&
      filters.checkOut &&
      filters.checkOut <= filters.checkIn
    ) {
      context.addIssue({
        code: "custom",
        message: "checkOut must be after checkIn.",
        path: ["checkOut"],
      });
    }

    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      context.addIssue({
        code: "custom",
        message: "minPrice cannot exceed maxPrice.",
        path: ["minPrice"],
      });
    }
  });

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

function getDateFilter(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) {
    return {};
  }

  return {
    bookings: {
      none: {
        status: { in: ["PENDING", "CONFIRMED"] },
        checkIn: { lt: new Date(`${checkOut}T00:00:00.000Z`) },
        checkOut: { gt: new Date(`${checkIn}T00:00:00.000Z`) },
      },
    },
  };
}

export async function listProperties(input: unknown) {
  const filters = propertyFiltersSchema.parse(input);
  const where = {
    published: true,
    ...(filters.city || filters.destination ? { city: { contains: filters.city ?? filters.destination } } : {}),
    ...(filters.guests ? { maxGuests: { gte: filters.guests } } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          pricePerNight: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...getDateFilter(filters.checkIn, filters.checkOut),
  };
  const orderBy =
    filters.sort === "price-asc"
      ? { pricePerNight: "asc" as const }
      : filters.sort === "price-desc"
        ? { pricePerNight: "desc" as const }
        : { createdAt: "desc" as const };

  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        city: true,
        country: true,
        pricePerNight: true,
        maxGuests: true,
        bedrooms: true,
        bathrooms: true,
        images: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, alt: true, sortOrder: true },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  const propertyIds = items.map(({ id }) => id);
  const reviewSummaries = propertyIds.length
    ? await prisma.review.groupBy({
        by: ["propertyId"],
        where: { propertyId: { in: propertyIds } },
        _avg: { rating: true },
        _count: { _all: true },
      })
    : [];
  const summariesByPropertyId = new Map(
    reviewSummaries.map((summary) => [summary.propertyId, summary]),
  );

  return {
    items: items.map((property) => {
      const summary = summariesByPropertyId.get(property.id);
      return {
        ...property,
        averageRating: summary?._avg.rating ?? null,
        reviewCount: summary?._count._all ?? 0,
      };
    }),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export async function getPropertyBySlug(slug: string) {
  const property = await prisma.property.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      city: true,
      country: true,
      pricePerNight: true,
      maxGuests: true,
      bedrooms: true,
      bathrooms: true,
      amenities: true,
      model3dUrl: true,
      createdAt: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, alt: true, sortOrder: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!property) {
    throw new ApiError(404, "PROPERTY_NOT_FOUND", "Published property not found.");
  }

  const rating = await prisma.review.aggregate({
    where: { propertyId: property.id },
    _avg: { rating: true },
  });

  return {
    ...property,
    reviews: property.reviews.map(({ user, ...review }) => ({
      ...review,
      authorDisplayName: user.name,
    })),
    averageRating: rating._avg.rating,
  };
}

export async function getPropertyAvailability(slug: string, now = new Date()) {
  const start = new Date(now);
  const end = new Date(now);
  end.setUTCFullYear(end.getUTCFullYear() + 1);

  const property = await prisma.property.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      bookings: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
          checkOut: { gt: start },
          checkIn: { lt: end },
        },
        orderBy: { checkIn: "asc" },
        select: { checkIn: true, checkOut: true },
      },
    },
  });

  if (!property) {
    throw new ApiError(404, "PROPERTY_NOT_FOUND", "Published property not found.");
  }

  return {
    bookedRanges: property.bookings.map(({ checkIn, checkOut }) => ({
      checkIn: checkIn.toISOString().slice(0, 10),
      checkOut: checkOut.toISOString().slice(0, 10),
    })),
  };
}
