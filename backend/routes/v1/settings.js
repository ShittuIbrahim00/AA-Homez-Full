import express from "express";
import { MiddlewareAgencyApiGuardMine, MiddlewareApiGuard } from "../../middleware/middleware.v1.guard.js";
import { CreateSettings, GetAllSettings, GetSettings, GetSettingsById, GetUserSettings, UpdateSettings } from "../../controllers/controller.v1.settings.js";

let router = express.Router();
router.get("/user/:uid", GetUserSettings);

router.get("/", MiddlewareAgencyApiGuardMine, GetSettings);
router.post("/", MiddlewareAgencyApiGuardMine, CreateSettings);
router.patch("/", MiddlewareAgencyApiGuardMine, UpdateSettings);

// Get all settings (Admin-only)
router.get("/admin", MiddlewareAgencyApiGuardMine, GetAllSettings);
// Get settings by ID (accessible to authenticated users)
router.get("/:sid", MiddlewareApiGuard, GetSettingsById);



export default router;