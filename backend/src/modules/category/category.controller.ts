import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { sendResponse } from "../../utils/response";

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully.",
        data: categories,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getBySlug(req.params.slug);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category details retrieved successfully.",
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await CategoryService.create(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully.",
        data: created,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CategoryService.update(req.params.id, req.body);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.delete(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }
}
