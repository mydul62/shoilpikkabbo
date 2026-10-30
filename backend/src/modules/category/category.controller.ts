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
      const { id } = req.params;
      const force = req.query.force === "true" || req.body?.force === true;
      const reassignTo = (req.query.reassignTo as string) || req.body?.reassignTo;

      const result = await CategoryService.delete(id, { force, reassignTo });
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result && "reallocated" in result
          ? `Category deleted. ${result.reallocated} product(s) safely moved to "${result.targetName}".`
          : "Category deleted successfully.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, force, reassignTo } = req.body;
      const result = await CategoryService.batchDelete(ids, { force, reassignTo });
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${result.deletedCount} categories deleted successfully.${
          result.reallocatedCount > 0 ? ` ${result.reallocatedCount} products preserved.` : ""
        }`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}
