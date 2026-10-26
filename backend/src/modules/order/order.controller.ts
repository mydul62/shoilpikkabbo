import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { sendResponse } from "../../utils/response";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const order = await OrderService.createOrder({ ...req.body, userId });
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully.",
        data: order,
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
        data: result.orders,
        meta: result.meta,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const updated = await OrderService.updateOrderStatus(id, status, note);
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
}
