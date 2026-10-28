import { Router, type Request, type RequestHandler, type Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../lib/api-error";
import { createBooking } from "../lib/services/bookings";
import {
  getPropertyAvailability,
  getPropertyBySlug,
  listProperties,
} from "../lib/services/properties";

export const propertyBookingRouter = Router();

function route(
  handler: (request: Request, response: Response) => Promise<void>,
): RequestHandler {
  return (request, response, next) => {
    void handler(request, response).catch(next);
  };
}

function sendError(error: unknown, response: Response): void {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: { code: "INVALID_INPUT", message: error.issues[0]?.message ?? "Invalid request input." },
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  console.error("API request failed:", error);
  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
  });
}

function withErrorResponse(
  handler: (request: Request, response: Response) => Promise<void>,
): RequestHandler {
  return route(async (request, response) => {
    try {
      await handler(request, response);
    } catch (error) {
      sendError(error, response);
    }
  });
}

propertyBookingRouter.get(
  "/properties",
  withErrorResponse(async (request, response) => {
    response.json(await listProperties(request.query));
  }),
);

propertyBookingRouter.get(
  "/properties/:slug/availability",
  withErrorResponse(async (request, response) => {
    response.json(await getPropertyAvailability(request.params.slug));
  }),
);

propertyBookingRouter.get(
  "/properties/:slug",
  withErrorResponse(async (request, response) => {
    response.json(await getPropertyBySlug(request.params.slug));
  }),
);

propertyBookingRouter.post(
  "/bookings",
  withErrorResponse(async (request, response) => {
    response.status(201).json(await createBooking(request.body));
  }),
);
