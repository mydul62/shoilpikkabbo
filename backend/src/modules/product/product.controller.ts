import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { sendResponse } from "../../utils/response";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAll(req.query as any);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieved successfully.",
        data: result.products,
        meta: result.meta,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getBySlug(req.params.slug);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product retrieved successfully.",
        data: product,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.create(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Product created successfully.",
        data: product,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ProductService.update(req.params.id, req.body);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product updated successfully.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.delete(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const result = await ProductService.batchDelete(ids);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Batch products deleted successfully.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, isActive } = req.body;
      const result = await ProductService.batchStatus(ids, isActive);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Batch products marked as ${isActive ? "active" : "draft"} successfully.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async batchFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, isFeatured } = req.body;
      const result = await ProductService.batchFeatured(ids, isFeatured);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Batch products marked as ${isFeatured ? "featured" : "standard"} successfully.`,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

