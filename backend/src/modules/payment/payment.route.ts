import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// =========================================================================
// Public SSLCommerz Payment Gateway Endpoints
// =========================================================================
router.post("/sslcommerz/initiate/:orderId", PaymentController.sslcommerzInitiate);
router.post("/sslcommerz/success", PaymentController.sslcommerzSuccess);
router.post("/sslcommerz/fail", PaymentController.sslcommerzFail);
router.post("/sslcommerz/cancel", PaymentController.sslcommerzCancel);
router.post("/sslcommerz/ipn", PaymentController.sslcommerzIPN);

// =========================================================================
// Protected Admin / Staff Payment Audit Endpoints
// =========================================================================
router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.getAll);
router.post("/batch-verify", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.batchVerify);
router.post("/batch-delete", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.batchDelete);

router.patch("/:id/verify", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.verify);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), PaymentController.delete);

export const paymentRoutes = router;

