import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public / Guest & Customer endpoints
router.post("/", OrderController.createOrder);
router.get("/track/:orderNumber", OrderController.trackOrder);

// Admin / Staff endpoints
router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.getAllOrders);
router.post("/batch-status", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.batchUpdateStatus);
router.post("/batch-payment-status", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.batchUpdatePaymentStatus);
router.post("/batch-delete", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.batchDeleteOrders);

router.get("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.getOrderById);
router.patch("/:id/status", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.updateOrderStatus);
router.patch("/:id/payment", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.updatePaymentStatus);
router.post("/:id/tracking", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.addTrackingEvent);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.deleteOrder);

export const orderRoutes = router;
