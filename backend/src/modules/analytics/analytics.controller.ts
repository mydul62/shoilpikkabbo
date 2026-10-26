import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "./analytics.service";
import { sendResponse } from "../../utils/response";

export class AnalyticsController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getOverview();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Analytics operational overview retrieved.",
        data,
      });
    } catch (err) {
      return next(err);
    }
  }
}
