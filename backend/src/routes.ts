import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { productRoutes } from "./modules/product/product.route";
import { orderRoutes } from "./modules/order/order.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { couponRoutes } from "./modules/coupon/coupon.route";
import { inquiryRoutes } from "./modules/inquiry/inquiry.route";
import { analyticsRoutes } from "./modules/analytics/analytics.route";
import { settingsRoutes } from "./modules/settings/settings.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/coupons", couponRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/settings", settingsRoutes);

export const appRouter = router;
