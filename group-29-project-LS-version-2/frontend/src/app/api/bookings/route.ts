import { createBooking } from "@/lib/services/bookings";
import { getCurrentUser } from "@/lib/session";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { rateLimiter, requestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    const key = `booking:${user.id}:${requestIp(request.headers)}`;
    const limit = rateLimiter.consume(key, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return Response.json(
        { error: { code: "RATE_LIMITED", message: "Too many booking requests. Please try again later." } },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const booking = await createBooking(await readJsonBody(request, 16 * 1024));
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
