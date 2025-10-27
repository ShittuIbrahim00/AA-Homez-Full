/**
 * Settings Controller
 */
import Async from "./../core/core.async.js";
import { ModelAgent, ModelSettings, ModelUser } from "../models/index.js";
import { ErrorClass, Utils } from "../core/index.js";
import { createScheduleAvailabilityNotification } from "../services/notification.js";

export const GetSettings = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency;
    const settings = await ModelSettings.GetAgencySettings(uid);
    res.json(Utils.PrintRest("Settings fetched successfully", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const UpdateSettings = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency;
    const settings = await ModelSettings.Update(req.body, uid);
    
    // Check if scheduleDays or scheduleTime were updated
    const scheduleUpdated = req.body.scheduleDays || req.body.scheduleTime;
    
    if (scheduleUpdated) {
      // Get business info for notification
      const business = await ModelUser.findOne({
        where: { uid },
        attributes: ['firstName', 'lastName', 'businessName']
      });
      
      const businessName = business.businessName || `${business.firstName} ${business.lastName}`;
      
      // Get all agents registered to this business using the ModelAgent method
      const agents = await ModelAgent.GetAgentsByBusiness(uid);
      
      if (agents.length > 0) {
        const agentIds = agents.map(agent => agent.aid);
        
        // Notify all agents about the schedule update
        await createScheduleAvailabilityNotification(
          agentIds,
          businessName,
          req.body.scheduleDays || settings.scheduleDays,
          req.body.scheduleTime || settings.scheduleTime,
          uid
        );
        
        console.log(`Notified ${agents.length} agents about schedule changes`);
      } else {
        console.log('No agents found for this business');
      }
    }
    
    res.json(Utils.PrintRest("Settings updated successfully", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const CreateSettings = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency;
    const user = await ModelUser.GetAgency(uid);
    
    if (user.role !== "business") {
      throw new ErrorClass("Only businesses can create settings", 403);
    }
    
    const data = { ...req.body, uid };
    const { settings, created } = await ModelSettings.Add(data);
    
    if (!created) {
      throw new ErrorClass("Settings already exist for this business", 400);
    }
    
    // Notify agents when initial schedule is created
    if (data.scheduleDays && data.scheduleTime) {
      const businessName = user.businessName || `${user.firstName} ${user.lastName}`;
      
      // Get all agents registered to this business
      const agents = await ModelAgent.GetAgentsByBusiness(uid);
      
      if (agents.length > 0) {
        const agentIds = agents.map(agent => agent.aid);
        
        await createScheduleAvailabilityNotification(
          agentIds,
          businessName,
          data.scheduleDays,
          data.scheduleTime,
           uid
        );
        
        // console.log(`Notified ${agents.length} agents about new schedule availability`);
      } else {
        console.log('No agents found for this business during settings creation');
      }
    }
    
    res.json(Utils.PrintRest("Settings created successfully", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});

// export const UpdateSettings = Async(async (req, res, next) => {
//   try {
//     const { uid } = req.agency;
//     const settings = await ModelSettings.Update(req.body, uid);
//     res.json(Utils.PrintRest("Settings updated successfully", true, settings));
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const CreateSettings = Async(async (req, res, next) => {
//   try {
//     const { uid } = req.agency;
//     const user = await ModelUser.GetAgency(uid);
//     if (user.role !== "business") {
//       throw new ErrorClass("Only businesses can create settings", 403);
//     }
    
//     const data = { ...req.body, uid };
//     const { settings, created } = await ModelSettings.Add(data);
    
//     if (!created) {
//       throw new ErrorClass("Settings already exist for this business", 400);
//     }
    
//     res.json(Utils.PrintRest("Settings created successfully", true, settings));
//   } catch (e) {
//     throw new ErrorClass(e.message, e.statusCode || 500);
//   }
// });
/**
 * Get settings by ID (sid)
 */
export const GetSettingsById = Async(async (req, res, next) => {
  try {
    const { sid } = req.params;
    const settings = await ModelSettings.Get(sid);
    res.json(Utils.PrintRest("Settings fetched successfully", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});

/**
 * Get all settings (Admin-only)
 */
export const GetAllSettings = Async(async (req, res, next) => {
  try {
    const settings = await ModelSettings.GetAll();
    res.json(Utils.PrintRest("All settings fetched", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});

/**
 * Get settings for the current user (uid from token)
 */
export const GetUserSettings = Async(async (req, res, next) => {
  try {
    const { uid } = req.params; // Now comes from the route param
    const settings = await ModelSettings.GetByUser(uid);

    res.json(Utils.PrintRest("Business settings fetched", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});
