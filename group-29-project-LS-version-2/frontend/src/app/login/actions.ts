"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";

const loginSchema = z.strictObject({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128), returnTo: z.string().optional() });

function safeReturnTo(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect("/login?error=1");
  try {
    await signIn("credentials", { email: parsed.data.email.toLowerCase(), password: parsed.data.password, redirectTo: safeReturnTo(parsed.data.returnTo) });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=1");
    throw error;
  }
}
