import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appRouter } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { ENV } from "./config/env";

import path from "path";

export const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        ENV.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
      ];
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.includes("shoilpikkabbo")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all web origins for public storefront API
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files if local storage fallback is used
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// Root Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "SHOILPIKKABBO Production REST API",
    status: "online",
    version: "1.0.0",
    tagline: "Delivery • Quality • Reliability",
    healthCheck: "/api/v1/health",
    apiBase: "/api/v1",
  });
});

// Health Check
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "SHOILPIKKABBO REST API",
    tagline: "Delivery • Quality • Reliability",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/v1", appRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;

// Support Vercel Serverless Functions and CommonJS module loaders
if (typeof module !== "undefined" && module.exports) {
  module.exports = app;
  module.exports.default = app;
  module.exports.app = app;
}
