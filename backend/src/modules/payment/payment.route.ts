import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.getAll);
router.patch("/:id/verify", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.verify);

export const paymentRoutes = router;
