import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { SSLCommerzService } from "./sslcommerz.service";
import { prisma } from "../../config/prisma";
import { sendResponse } from "../../utils/response";

export class PaymentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.getAllPayments(req.query as any);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment records retrieved successfully.",
        data: result,
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

  static async batchVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, decision, notes } = req.body;
      const verifiedByUserId = req.user?.userId;

      const result = await PaymentService.batchVerify(
        ids,
        decision,
        verifiedByUserId,
        notes
      );

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Successfully marked ${result.updatedCount} payments as ${decision}.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PaymentService.deletePayment(id);
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
      const result = await PaymentService.batchDelete(ids);
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

  // =========================================================================
  // SSLCommerz Endpoints
  // =========================================================================

  static async sslcommerzInitiate(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }
      const result = await SSLCommerzService.initiatePayment(order);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async sslcommerzSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SSLCommerzService.handleSuccess(req.body);
      return res.redirect(303, result.redirectUrl);
    } catch (err) {
      return next(err);
    }
  }

  static async sslcommerzFail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SSLCommerzService.handleFail(req.body);
      return res.redirect(303, result.redirectUrl);
    } catch (err) {
      return next(err);
    }
  }

  static async sslcommerzCancel(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SSLCommerzService.handleCancel(req.body);
      return res.redirect(303, result.redirectUrl);
    } catch (err) {
      return next(err);
    }
  }

  static async sslcommerzIPN(req: Request, res: Response, next: NextFunction) {
    try {
      await SSLCommerzService.handleIPN(req.body);
      return res.status(200).send("IPN_OK");
    } catch (err) {
      return next(err);
    }
  }
}
