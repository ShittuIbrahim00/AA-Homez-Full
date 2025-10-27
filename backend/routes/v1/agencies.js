/**
 * Slantapp code and properties {www.slantapp.io}
 */
import express from "express";
//libraries
import {
  MiddlewareAgencyApiGuardMine
} from "../../middleware/middleware.v1.guard.js";
import {
  Agency,
  ApproveSchedule,
  Reschedule,
  Schedule,
  Schedules,
  SellProperty,
  Update,
  UpdateAgency,
  updateAgentRequest,
} from "../../controllers/controller.v1.agency.js";
import { GetAdmin } from "../../controllers/controller.v1.property.js";
import { getAllAffiliates } from "../../controllers/controller.v1.agent.js";

let router = express.Router();
/* GET agents listing. */
router.get('/affiliates/all', MiddlewareAgencyApiGuardMine,  getAllAffiliates);
router.patch("/", UpdateAgency);
router.patch("/settings", Update);
router.get("/", Agency);
router.get("/schedule/:id", Schedule);
router.get("/properties/:id?", GetAdmin);
router.get("/schedules/:status", Schedules);
router.patch("/schedule/approve/:id", ApproveSchedule);
router.patch("/reschedule/:id", Reschedule);
router.patch("/property/pay", SellProperty);
router.patch("/agents/update-request", updateAgentRequest);
// router.get('/agents/:aid?', Agents)

//export default
export default router;
