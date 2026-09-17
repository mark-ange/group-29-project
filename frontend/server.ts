import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./src/server/routes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser for API requests
  app.use(express.json());

  // Mount complete REST API at /api
  app.use("/api", apiRouter);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LuxeStay Luxury Vacation Platform running on http://localhost:${PORT}`);
    console.log(`API endpoints accessible at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
