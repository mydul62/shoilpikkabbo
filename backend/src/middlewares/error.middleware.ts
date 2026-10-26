import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { ENV } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma unique constraint violation handling
  if (err.code === "P2002") {
    statusCode = 409;
    const target = err.meta?.target ? ` (${err.meta.target})` : "";
    message = `Duplicate record found${target}. Please use a unique value.`;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Requested record not found in database.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack: ENV.NODE_ENV === "development" ? err.stack : undefined,
  });
};
