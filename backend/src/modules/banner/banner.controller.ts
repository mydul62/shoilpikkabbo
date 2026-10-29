import { Request, Response, NextFunction } from "express";
import { BannerService } from "./banner.service";
import { sendResponse } from "../../utils/response";

export class BannerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.active === "true";
      const banners = await BannerService.getAll(onlyActive);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banners retrieved successfully.",
        data: banners,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await BannerService.create(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Banner created successfully.",
        data: created,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await BannerService.update(req.params.id, req.body);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banner updated successfully.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BannerService.delete(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banner deleted successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }
}
