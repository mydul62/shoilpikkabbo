import { Router } from "express";
import { StaffController } from "./staff.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Only ADMIN can manage staff and other admins
router.use(authenticate, authorize(Role.ADMIN));

router.get("/", StaffController.getAll);
router.post("/", StaffController.create);
router.patch("/:id/role", StaffController.updateRole);
router.post("/:id/reset-password", StaffController.resetPassword);
router.delete("/:id", StaffController.delete);

export const staffRoutes = router;

