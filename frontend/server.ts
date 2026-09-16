import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";

async function startServer() {
  const app = express();
  const PORT = 8080;

  // JSON body parser for API requests
  app.use(express.json());

  // Keep the frontend connected to the real Laravel API in development and production.
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.API_SERVER_URL || "http://127.0.0.1:8181",
      changeOrigin: true,
    })
  );

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
