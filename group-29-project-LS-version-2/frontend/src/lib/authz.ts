import { ApiError } from "@/lib/api-error";
import { UserRoleSchema, type UserRole } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function requireRoles(roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!UserRoleSchema.safeParse(user.role).success || !roles.includes(user.role)) {
    throw new ApiError(403, "FORBIDDEN", "You do not have permission to perform this action.");
  }
  return user;
}

export async function requirePropertyAccess(propertyId: string) {
  const user = await requireRoles(["ADMIN", "HOST"]);
  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true, ownerId: true, title: true } });
  if (!property || (user.role !== "ADMIN" && property.ownerId !== user.id)) {
    throw new ApiError(404, "PROPERTY_NOT_FOUND", "Property not found.");
  }
  return { user, property };
}
