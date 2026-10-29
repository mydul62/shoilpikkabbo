import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service";
import { sendResponse } from "../../utils/response";

export class CustomerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await CustomerService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Customers retrieved successfully.",
        data: customers,
      });
    } catch (err) {
      return next(err);
    }
  }
}
