import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "HOST", "GUEST"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const BookingStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const CURRENCY = "USD";
