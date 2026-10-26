import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", SettingsController.getAll);
router.patch("/", authenticate, authorize(Role.ADMIN), SettingsController.update);

export const settingsRoutes = router;
