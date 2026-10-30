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
    origin: [ENV.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files if local storage fallback is used
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));


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
