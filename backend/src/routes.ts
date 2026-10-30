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
import { pageRoutes } from "./modules/page/page.route";
import { bannerRoutes } from "./modules/banner/banner.route";
import { careerRoutes } from "./modules/career/career.route";
import { customerRoutes } from "./modules/customer/customer.route";
import { uploadRoutes } from "./modules/upload/upload.route";

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
router.use("/pages", pageRoutes);
router.use("/banners", bannerRoutes);
router.use("/careers", careerRoutes);
router.use("/customers", customerRoutes);
router.use("/upload", uploadRoutes);

export const appRouter = router;

