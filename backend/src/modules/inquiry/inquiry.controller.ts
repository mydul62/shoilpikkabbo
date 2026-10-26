import { Request, Response, NextFunction } from "express";
import { InquiryService } from "./inquiry.service";
import { sendResponse } from "../../utils/response";

export class InquiryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiry = await InquiryService.create(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Special E-Sheba service inquiry submitted successfully.",
        data: inquiry,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiries = await InquiryService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Service inquiries retrieved.",
        data: inquiries,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updated = await InquiryService.updateStatus(id, status, adminNotes);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Inquiry status updated.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
}
