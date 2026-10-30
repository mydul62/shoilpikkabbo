import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { SSLCommerzService } from "../payment/sslcommerz.service";
import { sendResponse } from "../../utils/response";
import { PaymentMethod } from "@prisma/client";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const order = await OrderService.createOrder({ ...req.body, userId });

      let paymentUrl: string | undefined = undefined;

      // If user selected ONLINE_GATEWAY (SSLCommerz)
      if (order.paymentMethod === PaymentMethod.ONLINE_GATEWAY) {
        const initResult = await SSLCommerzService.initiatePayment(order);
        if (initResult.success && initResult.paymentUrl) {
          paymentUrl = initResult.paymentUrl;
        }
      }

      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully.",
        data: {
          ...order,
          paymentUrl,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async trackOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderNumber } = req.params;
      const phone = req.query.phone as string | undefined;
      const order = await OrderService.trackOrder(orderNumber, phone);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order tracking details retrieved successfully.",
        data: order,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getAllOrders(req.query as any);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully.",
        data: {
          orders: result.orders,
          stats: result.stats,
        },
        meta: result.meta,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order details retrieved successfully.",
        data: order,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, note, location } = req.body;
      const updated = await OrderService.updateOrderStatus(id, status, note, location);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Order status updated to ${status}.`,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { paymentStatus, notes } = req.body;
      const updated = await OrderService.updatePaymentStatus(id, paymentStatus, notes);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Payment status updated to ${paymentStatus}.`,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async addTrackingEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await OrderService.addTrackingEvent(id, req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tracking event recorded successfully.",
        data: event,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status, note } = req.body;
      const result = await OrderService.batchUpdateStatus(ids, status, note);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Successfully updated ${result.updatedCount} orders to ${status}.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchUpdatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, paymentStatus, notes } = req.body;
      const result = await OrderService.batchUpdatePaymentStatus(ids, paymentStatus, notes);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Successfully updated payment status of ${result.updatedCount} orders to ${paymentStatus}.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await OrderService.deleteOrder(id);
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

  static async batchDeleteOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const result = await OrderService.batchDeleteOrders(ids);
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
