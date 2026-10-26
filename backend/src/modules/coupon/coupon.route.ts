import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.post("/validate", CouponController.validate);
router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), CouponController.getAll);
router.post("/", authenticate, authorize(Role.ADMIN), CouponController.create);
router.delete("/:id", authenticate, authorize(Role.ADMIN), CouponController.delete);

export const couponRoutes = router;
