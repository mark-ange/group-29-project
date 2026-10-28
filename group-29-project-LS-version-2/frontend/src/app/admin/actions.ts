"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requirePropertyAccess, requireRoles } from "@/lib/authz";
import { UserRoleSchema } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const propertySchema = z.strictObject({
  id: z.string().optional(),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(20).max(5000),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  pricePerNight: z.coerce.number().int().min(0).max(1000000),
  maxGuests: z.coerce.number().int().min(1).max(50),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  amenities: z.string().trim().max(2000),
});

export async function savePropertyAction(formData: FormData) {
  const input = propertySchema.parse(Object.fromEntries(formData.entries()));
  const user = await requireRoles(["ADMIN", "HOST"]);
  const { id, ...data } = input;
  if (id) {
    await requirePropertyAccess(id);
    await prisma.property.update({ where: { id }, data });
  } else {
    const created = await prisma.property.create({ data: { ...data, ownerId: user.id, published: false } });
    revalidatePath("/admin");
    redirect(`/admin/properties/${created.id}/edit`);
  }
  revalidatePath("/admin");
  revalidatePath(`/stays/${data.slug}`);
  redirect("/admin");
}

export async function cancelBookingAction(formData: FormData) {
  const bookingId = z.string().min(1).parse(formData.get("bookingId"));
  const user = await requireRoles(["ADMIN", "HOST"]);
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { id: true, property: { select: { ownerId: true } } } });
  if (!booking || (user.role !== "ADMIN" && booking.property.ownerId !== user.id)) return;
  await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });
  revalidatePath("/admin/bookings");
}

export async function togglePropertyAction(formData: FormData) {
  const propertyId = z.string().min(1).parse(formData.get("propertyId"));
  const { property } = await requirePropertyAccess(propertyId);
  const current = await prisma.property.findUnique({ where: { id: property.id }, select: { published: true, slug: true } });
  if (!current) return;
  await prisma.property.update({ where: { id: property.id }, data: { published: !current.published } });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/stays/${current.slug}`);
}

export async function updateUserRoleAction(formData: FormData) {
  await requireRoles(["ADMIN"]);
  const input = z.strictObject({ userId: z.string().min(1), role: UserRoleSchema }).parse(Object.fromEntries(formData.entries()));
  await prisma.user.update({ where: { id: input.userId }, data: { role: input.role } });
  revalidatePath("/admin/users");
}
