import { Router } from "express";
import { CareerController } from "./career.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public: view jobs and submit application
router.get("/", CareerController.getListings);
router.get("/:id", CareerController.getListingById);
router.post("/:id/apply", CareerController.apply);

// Admin / Staff Protected
router.post("/", authenticate, authorize(Role.ADMIN, Role.STAFF), CareerController.createListing);
router.patch("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), CareerController.updateListing);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), CareerController.deleteListing);
router.get("/admin/applications", authenticate, authorize(Role.ADMIN, Role.STAFF), CareerController.getApplications);

export const careerRoutes = router;
