import { Router } from "express";
import { BannerController } from "./banner.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public: get active banners
router.get("/", BannerController.getAll);

// Admin: full CRUD
router.post("/", authenticate, authorize(Role.ADMIN, Role.STAFF), BannerController.create);
router.patch("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), BannerController.update);
router.delete("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), BannerController.delete);

export const bannerRoutes = router;
