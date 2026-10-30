import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.getAll);
router.post("/batch-verify", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.batchVerify);
router.post("/batch-delete", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.batchDelete);

router.patch("/:id/verify", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.verify);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.delete);

export const paymentRoutes = router;
