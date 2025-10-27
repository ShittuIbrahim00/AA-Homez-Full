// Import notification controllers
import express from "express";
import {
  getAgentNotifications,
  GetBusinessNotifications,
  markAllNotificationsAsReadAgent,
  markAllNotificationsAsReadBusiness,
  deleteNotificationAgent,
  deleteNotificationBusiness,
  getNotificationStatsAgent,
  getNotificationStatsBusiness,
  markNotificationAsReadAgent,
  markNotificationAsReadBusiness,
} from "../../controllers/controller.v1.notification.js";
import { authAgent } from "../../middleware/auth.middleware.js";
import { MiddlewareAgencyApiGuardMine } from "../../middleware/middleware.v1.guard.js";

const notificationRouter = express.Router();

// Notification Routes
notificationRouter.get("/", authAgent, getAgentNotifications);
notificationRouter.get("/business", MiddlewareAgencyApiGuardMine, GetBusinessNotifications);

notificationRouter.get("/stats", authAgent, getNotificationStatsAgent);
notificationRouter.get("/business/stats", MiddlewareAgencyApiGuardMine, getNotificationStatsBusiness);

notificationRouter.patch("/:notificationId/read", authAgent, markNotificationAsReadAgent);
notificationRouter.patch("/business/:notificationId/read", MiddlewareAgencyApiGuardMine, markNotificationAsReadBusiness);

notificationRouter.patch("/read-all", authAgent, markAllNotificationsAsReadAgent);
notificationRouter.patch("/business/read-all", MiddlewareAgencyApiGuardMine, markAllNotificationsAsReadBusiness);

notificationRouter.delete("/:notificationId", authAgent, deleteNotificationAgent);
notificationRouter.delete("/business/:notificationId", MiddlewareAgencyApiGuardMine, deleteNotificationBusiness);

export default notificationRouter