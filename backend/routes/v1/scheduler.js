import express from "express";
import { MiddlewareAgencyApiGuardMine } from "../../middleware/middleware.v1.guard.js";
import { ApproveSchedule, CreateSchedule, DeclineSchedule, GetAllSchedule, GetSchedule, GetSchedulesByAdmin, GetSchedulesByAgent, GetSchedulesByStatus, UpdateSchedule } from "../../controllers/controller.v1.scheduler.js";
import { authAgent } from "../../middleware/auth.middleware.js";


let router = express.Router();
// Business creates schedule
router.post("/business", MiddlewareAgencyApiGuardMine, CreateSchedule);

// Agent creates schedule
router.post("/agent", authAgent, CreateSchedule);

router.get("/agent", authAgent, GetSchedulesByAgent);

// GEt a single schedule
router.get("/admin", MiddlewareAgencyApiGuardMine, GetSchedulesByAdmin);

router.get("/:id", MiddlewareAgencyApiGuardMine, GetSchedule);


router.get("/", MiddlewareAgencyApiGuardMine, GetAllSchedule);

router.patch("/:id", MiddlewareAgencyApiGuardMine, UpdateSchedule);
router.get("/status/:status", MiddlewareAgencyApiGuardMine, GetSchedulesByStatus);
router.patch("/approve/:id", MiddlewareAgencyApiGuardMine, ApproveSchedule);
router.patch("/decline/:id", MiddlewareAgencyApiGuardMine, DeclineSchedule);

export default router;