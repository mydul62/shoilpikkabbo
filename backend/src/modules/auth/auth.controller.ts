import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { ENV } from "../../config/env";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.cookie("token", result.token, COOKIE_OPTIONS);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Customer account registered successfully.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.cookie("token", result.token, COOKIE_OPTIONS);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged out successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile retrieved successfully.",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  }
}
