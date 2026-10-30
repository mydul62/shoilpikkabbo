import { Router } from "express";
import { PageController } from "./page.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public: List all editable pages
router.get("/", PageController.listPages);

// Public: Get currently published page
router.get("/:slug", PageController.getPublishedPage);

// Admin / Staff Protected: Editor endpoints
router.get("/:slug/draft", authenticate, authorize(Role.ADMIN, Role.STAFF), PageController.getDraftPage);
router.put("/:slug/draft", authenticate, authorize(Role.ADMIN, Role.STAFF), PageController.saveDraft);
router.post("/:slug/publish", authenticate, authorize(Role.ADMIN, Role.STAFF), PageController.publishDraft);
router.get("/:slug/revisions", authenticate, authorize(Role.ADMIN, Role.STAFF), PageController.getRevisions);
router.post("/:slug/revisions/:revisionId/restore", authenticate, authorize(Role.ADMIN, Role.STAFF), PageController.restoreRevision);

export const pageRoutes = router;
