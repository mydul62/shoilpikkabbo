import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/response";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
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
