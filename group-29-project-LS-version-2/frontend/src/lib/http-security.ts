import { ApiError } from "./api-error";

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) {
    throw new ApiError(403, "ORIGIN_REQUIRED", "Request origin could not be verified.");
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new ApiError(403, "INVALID_ORIGIN", "Request origin could not be verified.");
  }

  const expectedOrigins = new Set([new URL(request.url).origin]);
  if (process.env.APP_URL) {
    try {
      expectedOrigins.add(new URL(process.env.APP_URL).origin);
    } catch {
      // Ignore malformed configuration; the request URL remains the trusted origin.
    }
  }

  if (!expectedOrigins.has(parsedOrigin.origin)) {
    throw new ApiError(403, "CROSS_ORIGIN_REQUEST", "Request origin could not be verified.");
  }
}

export async function readJsonBody(request: Request, maxBytes = 16 * 1024): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.");
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must contain valid JSON.");
  }
}

export function apiErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  if (error instanceof Error && error.name === "ZodError") {
    return Response.json(
      { error: { code: "INVALID_INPUT", message: "Please check the submitted information." } },
      { status: 400 },
    );
  }

  console.error("API request failed", {
    name: error instanceof Error ? error.name : "UnknownError",
  });
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
    { status: 500 },
  );
}
