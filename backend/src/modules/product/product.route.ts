import { Router } from "express";
import { ProductController } from "./product.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:slug", ProductController.getBySlug);
router.post("/", authenticate, authorize(Role.ADMIN, Role.STAFF), ProductController.create);
router.post("/batch-delete", authenticate, authorize(Role.ADMIN), ProductController.batchDelete);
router.post("/batch-status", authenticate, authorize(Role.ADMIN, Role.STAFF), ProductController.batchStatus);
router.post("/batch-featured", authenticate, authorize(Role.ADMIN, Role.STAFF), ProductController.batchFeatured);
router.patch("/:id", authenticate, authorize(Role.ADMIN, Role.STAFF), ProductController.update);
router.delete("/:id", authenticate, authorize(Role.ADMIN), ProductController.delete);

export const productRoutes = router;
