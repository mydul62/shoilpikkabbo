import { Request, Response, NextFunction } from "express";
import { SettingsService } from "./settings.service";
import { sendResponse } from "../../utils/response";
import { EmailService } from "../email/email.service";

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

  static async testEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetEmail } = req.body;
      if (!targetEmail) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Recipient target email address is required.",
        });
      }

      const info = await EmailService.sendTestEmail(targetEmail);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Test email sent successfully to ${targetEmail}!`,
        data: { messageId: info.messageId },
      });
    } catch (err: any) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: err.message || "Failed to send test email. Please check your SMTP credentials.",
      });
    }
  }
}
