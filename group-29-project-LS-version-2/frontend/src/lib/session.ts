import { ApiError } from "./api-error";
import { auth } from "@/auth";
import { UserRoleSchema } from "./constants";

export async function getCurrentUser() {
  const session = await auth();
  const user = session?.user;
  const role = UserRoleSchema.safeParse(user?.role);
  if (!user?.id || !user.email || !role.success) {
    throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");
  }

  return { id: user.id, name: user.name ?? "Guest", email: user.email, role: role.data };
}
