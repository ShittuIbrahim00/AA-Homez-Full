/**
 * Slantapp code and properties {www.slantapp.io}
 */
import express from "express";
import {
  MiddlewareAgencyApiGuardMine,
} from "../../middleware/middleware.v1.guard.js";
import {
  Add,
  Update,
  Delete,
  AddSub,
  UpdateSub,
  DeleteSub,
  Get,
  GetHot,
  makePayment,
  getAgentSoldProperties,
  getPropertiesByStatus,
  getHotProperties,
  getAllPropertiesAdmin,
  getAllProperties,
  getProperty,
  RestoreSub,
  getSubPropertyById,
  subPropertyController,
  GetSub,
} from "../../controllers/controller.v1.property.js";
import { authAgent } from "../../middleware/auth.middleware.js";

let router = express.Router();
/* GET agents listing. */

router.get("/get/:id?", Get); // ALL PROPERTY
router.get("/hot", GetHot); // ALL HOT PROPERTY
router.post("/add", MiddlewareAgencyApiGuardMine, Add); // ADD PROPERTY

router.post('/:pid/pay', MiddlewareAgencyApiGuardMine, makePayment);

router.post('/:pid/sub-properties/:sid/pay', MiddlewareAgencyApiGuardMine, makePayment);

router.get(
  "/agent/:aid/sold",
  authAgent, 
  getAgentSoldProperties
); 

router.get("/:pid", getProperty);

router.get("/", getAllProperties);

router.get("/admin/all", MiddlewareAgencyApiGuardMine, getAllPropertiesAdmin);

router.get("/hot/list", getHotProperties);

router.get("/status/:status", getPropertiesByStatus);

router.post("/sub/add/:pid", MiddlewareAgencyApiGuardMine, AddSub);


router.patch("/update/:id", MiddlewareAgencyApiGuardMine, Update);
router.delete("/delete/:id", MiddlewareAgencyApiGuardMine, Delete);

router.get("/sub/:sid", getSubPropertyById);

router.get("/all/sub/property", subPropertyController.getAllSubProperties);
// router.get("/all/sub/property", GetSub);


router.patch("/sub/update/:sid", MiddlewareAgencyApiGuardMine, UpdateSub);
router.delete("/sub/delete/:sid", MiddlewareAgencyApiGuardMine, DeleteSub);
router.post("/sub/restore/:sid", MiddlewareAgencyApiGuardMine, RestoreSub); // New endpoint

export default router;
