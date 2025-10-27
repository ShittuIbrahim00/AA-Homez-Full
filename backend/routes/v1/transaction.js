import express from "express";
import { getBusinessSalesSummary } from "../../controllers/controller.v1.property.js";
import { MiddlewareAgencyApiGuardMine } from "../../middleware/middleware.v1.guard.js";
let transactionRouter = express.Router();

transactionRouter.get("/", MiddlewareAgencyApiGuardMine, getBusinessSalesSummary);


export default transactionRouter;