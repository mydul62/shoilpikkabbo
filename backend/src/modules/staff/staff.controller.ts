import { Request, Response, NextFunction } from "express";
import { StaffService } from "./staff.service";
import { sendResponse } from "../../utils/response";

export class StaffController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const staffList = await StaffService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Staff team members retrieved.",
        data: staffList,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newStaff = await StaffService.create(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Team member created successfully.",
        data: newStaff,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const currentAdminId = req.user!.userId;
      const updated = await StaffService.updateRole(
        req.params.id,
        req.body.role,
        currentAdminId
      );
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Team member role updated.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await StaffService.resetPassword(
        req.params.id,
        req.body.newPassword
      );
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const currentAdminId = req.user!.userId;
      await StaffService.delete(req.params.id, currentAdminId);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Team member removed successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }
}

