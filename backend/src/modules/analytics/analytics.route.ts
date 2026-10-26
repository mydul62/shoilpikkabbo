import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/overview", authenticate, authorize(Role.ADMIN, Role.STAFF), AnalyticsController.getOverview);

export const analyticsRoutes = router;
