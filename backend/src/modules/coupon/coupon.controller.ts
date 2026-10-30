import { Request, Response, NextFunction } from "express";
import { CouponService } from "./coupon.service";
import { sendResponse } from "../../utils/response";

export class CouponController {
  static async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, subtotal } = req.body;
      const result = await CouponService.validateCoupon(code, Number(subtotal));
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Coupon validated.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await CouponService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Coupons retrieved.",
        data: coupons,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await CouponService.getPublic();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Active coupons retrieved.",
        data: coupons,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await CouponService.create({
        ...req.body,
        endDate: new Date(req.body.endDate),
      });
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Coupon created.",
        data: coupon,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CouponService.delete(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Coupon deleted.",
      });
    } catch (err) {
      return next(err);
    }
  }
}
