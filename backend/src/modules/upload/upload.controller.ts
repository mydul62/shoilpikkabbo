import { Request, Response, NextFunction } from "express";
import { UploadService } from "./upload.service";
import { sendResponse } from "../../utils/response";
import { ApiError } from "../../utils/apiError";

export class UploadController {
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded. Please select an image file.");
      }

      const folder = (req.body.folder as string) || "general";
      const result = await UploadService.uploadFile(req.file, folder);

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Image uploaded successfully.",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new ApiError(400, "No files uploaded. Please select one or more images.");
      }

      const folder = (req.body.folder as string) || "general";
      const results = await UploadService.uploadMultipleFiles(files, folder);

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${results.length} images uploaded successfully.`,
        data: results,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const publicId = req.params.publicId || req.body.publicId;
      if (!publicId) {
        throw new ApiError(400, "publicId is required to delete an image.");
      }

      const success = await UploadService.deleteFile(publicId);
      return sendResponse(res, {
        statusCode: 200,
        success,
        message: success ? "File deleted successfully." : "File not found or failed to delete.",
      });
    } catch (err) {
      return next(err);
    }
  }
}
