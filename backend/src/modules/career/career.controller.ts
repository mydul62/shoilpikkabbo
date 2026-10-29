import { Request, Response, NextFunction } from "express";
import { CareerService } from "./career.service";
import { sendResponse } from "../../utils/response";

export class CareerController {
  static async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.active !== "false";
      const listings = await CareerService.getListings(onlyActive);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Career listings retrieved successfully.",
        data: listings,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getListingById(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await CareerService.getListingById(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Career listing retrieved successfully.",
        data: listing,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async createListing(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await CareerService.createListing(req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Career listing created successfully.",
        data: created,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateListing(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CareerService.updateListing(req.params.id, req.body);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Career listing updated successfully.",
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteListing(req: Request, res: Response, next: NextFunction) {
    try {
      await CareerService.deleteListing(req.params.id);
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Career listing deleted successfully.",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await CareerService.apply(req.params.id, req.body);
      return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Your application has been received. Our talent team will contact you.",
        data: application,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await CareerService.getApplications();
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Applications retrieved successfully.",
        data: apps,
      });
    } catch (err) {
      return next(err);
    }
  }
}
