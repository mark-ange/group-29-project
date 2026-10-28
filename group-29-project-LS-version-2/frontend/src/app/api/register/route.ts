import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api-error";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { rateLimiter, requestIp } from "@/lib/rate-limit";

const registrationSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const limit = rateLimiter.consume(`register:${requestIp(request.headers)}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return Response.json(
        { error: { code: "RATE_LIMITED", message: "Too many registration attempts. Please try again later." } },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const input = registrationSchema.parse(await readJsonBody(request, 16 * 1024));
    const email = input.email.toLowerCase();
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: { name: input.name, email, passwordHash, role: "GUEST" },
      select: { id: true, name: true, email: true, role: true },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return Response.json({ error: { code: "REGISTRATION_FAILED", message: "Could not create account." } }, { status: 400 });
    }
    return apiErrorResponse(error instanceof Error && error.name === "ZodError"
      ? error
      : error instanceof ApiError ? error : error);
  }
}
