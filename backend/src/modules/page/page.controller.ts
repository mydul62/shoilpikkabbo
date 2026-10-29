import { Request, Response, NextFunction } from "express";
import { PageService } from "./page.service";
import { sendResponse } from "../../utils/response";

export class PageController {
  static async getPublishedPage(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const page = await PageService.getPublishedPage(slug);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Published page retrieved successfully.",
        data: page,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getDraftPage(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const draft = await PageService.getDraftPage(slug);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Draft page retrieved successfully.",
        data: draft,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async saveDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const draft = await PageService.saveDraft(slug, req.body, req.user?.userId);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Draft saved successfully.",
        data: draft,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async publishDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const published = await PageService.publishDraft(slug, req.user?.userId);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Home page published successfully.",
        data: published,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getRevisions(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const revisions = await PageService.getRevisions(slug);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Page revisions retrieved successfully.",
        data: revisions,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async restoreRevision(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug || "home";
      const revisionId = req.params.revisionId;
      const restored = await PageService.restoreRevision(slug, revisionId, req.user?.userId);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Revision restored as new draft successfully.",
        data: restored,
      });
    } catch (err) {
      return next(err);
    }
  }
}
