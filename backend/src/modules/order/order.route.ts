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
router.patch("/:id/status", authenticate, authorize(Role.ADMIN, Role.STAFF), OrderController.updateOrderStatus);

export const orderRoutes = router;
