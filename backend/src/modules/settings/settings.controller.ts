import { Request, Response, NextFunction } from "express";
import { SettingsService } from "./settings.service";
import { sendResponse } from "../../utils/response";

export class SettingsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Settings retrieved successfully.",
        data: settings,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await SettingsService.updateSettings(req.body);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Settings updated successfully.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
}
