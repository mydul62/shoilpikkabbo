import { Router } from "express";
import { InquiryController } from "./inquiry.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", InquiryController.create);
router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), InquiryController.getAll);
router.post("/batch-status", authenticate, authorize(Role.ADMIN, Role.STAFF), InquiryController.batchUpdateStatus);
router.post("/batch-delete", authenticate, authorize(Role.ADMIN, Role.STAFF), InquiryController.batchDelete);

router.patch("/:id/status", authenticate, authorize(Role.ADMIN, Role.STAFF), InquiryController.updateStatus);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), InquiryController.delete);

export const inquiryRoutes = router;
