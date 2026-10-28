import express from "express";
import type { NextFunction, Request, Response } from "express";
import next from "next";
import { apiRouter } from "./src/server/routes";

async function startServer() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev: isDevelopment, dir: process.cwd() });
  await nextApp.prepare();

  const app = express();
  const port = Number(process.env.PORT ?? 3000);
  const nextHandler = nextApp.getRequestHandler();

  // Auth.js and Prisma route handlers run through Next before the legacy Express API.
  for (const prefix of ["/api/auth", "/api/register", "/api/bookings", "/api/admin", "/api/properties"]) {
    app.use(prefix, (request, response) => nextHandler(request, response));
  }

  app.use(express.json());
  app.use("/api", apiRouter);
  app.use("/api", (_request, response) => {
    response.status(404).json({
      error: { code: "NOT_FOUND", message: "API endpoint not found." },
    });
  });
  app.use(
    "/api",
    (error: unknown, _request: Request, response: Response, next: NextFunction) => {
      if (response.headersSent) {
        next(error);
        return;
      }

      const requestError = error as { status?: unknown; type?: unknown };
      if (requestError.type === "entity.parse.failed") {
        response.status(400).json({
          error: { code: "INVALID_JSON", message: "Request body must contain valid JSON." },
        });
        return;
      }

      console.error("API middleware failed:", error);
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      });
    },
  );

  app.use((request, response) => nextHandler(request, response));

  app.listen(port, "0.0.0.0", () => {
    console.log(`StayNest running on http://localhost:${port}`);
    console.log(`API endpoints available at http://localhost:${port}/api`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
