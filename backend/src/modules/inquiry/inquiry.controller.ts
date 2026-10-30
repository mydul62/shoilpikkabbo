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
      const result = await InquiryService.getAll(req.query as any);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Service inquiries retrieved.",
        data: result,
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

  static async batchUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status, adminNotes } = req.body;
      const result = await InquiryService.batchUpdateStatus(ids, status, adminNotes);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Successfully marked ${result.updatedCount} inquiries as ${status}.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await InquiryService.delete(id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const result = await InquiryService.batchDelete(ids);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}
