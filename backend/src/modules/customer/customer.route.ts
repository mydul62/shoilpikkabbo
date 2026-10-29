import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN, Role.STAFF), CustomerController.getAll);

export const customerRoutes = router;
