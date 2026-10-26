import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiError } from "../utils/apiError";
import { Role } from "@prisma/client";

export interface AuthUser {
  userId: string;
  role: Role;
  phone: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication token missing or invalid"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;
    req.user = decoded;
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden: insufficient permissions for this action")
      );
    }
    return next();
  };
};
