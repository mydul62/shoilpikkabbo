import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:slug", CategoryController.getBySlug);
router.post("/", authenticate, authorize(Role.ADMIN, Role.STAFF), CategoryController.create);
router.patch("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), CategoryController.update);
router.delete("/:id", authenticate, authorize(Role.ADMIN), CategoryController.delete);

export const categoryRoutes = router;
