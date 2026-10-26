import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/response";

export class PaymentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await PaymentService.getAllPayments(req.query as any);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment records retrieved successfully.",
        data: payments,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { decision, notes } = req.body;
      const verifiedByUserId = req.user?.userId;

      const result = await PaymentService.verifyPayment(
        id,
        decision,
        verifiedByUserId,
        notes
      );

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Payment marked as ${decision}.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}
