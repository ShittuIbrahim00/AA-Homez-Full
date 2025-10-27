/**
 * Scheduler Controller
 */
import Async from "./../core/core.async.js";
import {
  ModelScheduler,
  ModelProperty,
  ModelSubProperty,
  ModelAgent,
  ModelUser,
  ModelSettings
} from "../models/index.js";
import { ErrorClass, Utils } from "../core/index.js";
import {
  createAgentNotification,
  createBusinessNotification,
  createScheduleApproveNotification,
  createScheduleDeclineNotification,
  createScheduleUpdateNotification,
  NotificationPriority,
  NotificationType,
} from "../services/notification.js";
//

// Helper function to format time based on settings
function formatTimeBasedOnSettings(timeValue, scheduleTimeFormat = '12h') {
  if (timeValue === null || timeValue === undefined || timeValue === '') {
    return 'Time not specified';
  }
  
  // If timeValue is already a string (like "14:30"), return as is
  if (typeof timeValue === 'string') {
    // Check if it's already in a proper time format
    if (timeValue.includes(':')) {
      if (scheduleTimeFormat === '24h') {
        return timeValue; // Return as is for 24h format
      } else {
        // Convert from 24h to 12h format
        const [hours, minutes] = timeValue.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const twelveHour = hours % 12 || 12;
        return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${period}`;
      }
    }
    return timeValue; // Return unknown string formats as is
  }
  
  // Convert time value (in minutes since midnight) to hours and minutes
  const hours = Math.floor(Number(timeValue) / 60);
  const minutes = Number(timeValue) % 60;
  
  if (isNaN(hours) || isNaN(minutes)) {
    return 'Invalid time';
  }
  
  if (scheduleTimeFormat === '24h') {
    // 24-hour format: HH:MM
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    // 12-hour format: HH:MM AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12;
    return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}

// Helper function to get business settings and format time accordingly
async function getFormattedTime(timeValue, businessUid) {
  try {
    // Get business settings to determine time format
    let timeFormat = '12h'; // default
    
    if (businessUid) {
      try {
        const settings = await ModelSettings.GetByUser(businessUid);
        if (settings) {
          // Check if there's a timeFormat setting, otherwise use default
          // You might want to add a timeFormat field to your settings model
          timeFormat = settings.timeFormat || '12h';
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use default format if settings can't be fetched
      }
    }
    
    return formatTimeBasedOnSettings(timeValue, timeFormat);
  } catch (error) {
    console.error('Error in getFormattedTime:', error);
    return formatTimeBasedOnSettings(timeValue, '12h'); // fallback to 12h
  }
}

// Helper function to safely get time value from scheduler
function getTimeValue(scheduler) {
  if (!scheduler) return null;
  
  // Check different possible time fields
  if (scheduler.time !== undefined && scheduler.time !== null) {
    return scheduler.time;
  }
  if (scheduler.scheduleTime !== undefined && scheduler.scheduleTime !== null) {
    return scheduler.scheduleTime;
  }
  if (scheduler.startTime !== undefined && scheduler.startTime !== null) {
    return scheduler.startTime;
  }
  
  return null;
}

export const CreateSchedule = Async(async (req, res, next) => {
  try {
    let data = { ...req.body };
    let isAgent = false;
    
    // Determine if request is from agent or business
    if (req.user && req.user.role === "agent") {
      isAgent = true;
      data.aid = req.user.aid || data.aid; // Ensure agent ID from token is used
    } else if (req.agency) {
      isAgent = false;
      data.uid = req.agency.uid || data.uid; // Ensure business ID from token is used
    }

    // For agent requests, automatically set the agent ID from token
    if (isAgent) {
      if (!data.aid && req.user.aid) {
        data.aid = req.user.aid;
      }
      
      // Agent must provide either pid or sid
      if (!data.pid && !data.sid) {
        throw new ErrorClass(
          "Property ID (pid) or Sub-property ID (sid) is required for agent scheduling",
          400
        );
      }

      // Resolve business ID from property/sub-property
      if (!data.uid) {
        if (data.sid) {
          const subProperty = await ModelSubProperty.findByPk(data.sid);
          if (subProperty) {
            data.uid = subProperty.uid;
          }
        } else if (data.pid) {
          const property = await ModelProperty.findByPk(data.pid);
          if (property) {
            data.uid = property.uid;
          }
        }
        
        if (!data.uid) {
          throw new ErrorClass(
            "Could not determine business ID. Please ensure the property/sub-property exists.",
            400
          );
        }
      }
    }

    const { scheduler, created, info } = await ModelScheduler.Add(data, { isAgent });

    if (created) {
      const scheduleDate = new Date(scheduler.date);
      const formattedDate = scheduleDate.toLocaleDateString();
      
      // Safely get and format time
      const timeValue = getTimeValue(scheduler);
      const formattedTime = await getFormattedTime(timeValue, scheduler.uid);
      
      let propertyName = '';
      if (scheduler.pid) {
        const property = await ModelProperty.findByPk(scheduler.pid);
        if (property) {
          propertyName = property.name;
        }
      }

      // Get agent details
      let agentName = 'An agent';
      let agentEmail = '';
      if (scheduler.aid) {
        const agent = await ModelAgent.findByPk(scheduler.aid);
        if (agent) {
          agentName = agent?.fullName;
          agentEmail = agent.email;
        }
      }

      // Get business details
      let businessName = 'The business';
      if (scheduler.uid) {
        const business = await ModelUser.findByPk(scheduler.uid);
        if (business) {
          businessName = business.businessName || business.companyName || 'The business';
        }
      }

      // NOTIFY AGENT (who the schedule is assigned to)
      if (!isAgent && scheduler.aid) {
        let agentBody = `${businessName} has scheduled ${scheduler.title} for you on ${formattedDate} at ${formattedTime}`;
        if (propertyName) {
          agentBody += ` for ${propertyName}`;
        }
        agentBody += ` with client ${scheduler.clientName}`;

        await createAgentNotification(
          scheduler.aid,
          "New Schedule Assigned",
          agentBody,
          {
            type: NotificationType.EVENT,
            priority: NotificationPriority.MEDIUM,
            scheduleId: scheduler.scid,
            scheduleTitle: scheduler.title,
            businessId: scheduler.uid,
            businessName: businessName,
            clientName: scheduler.clientName,
            date: scheduler.date,
            time: timeValue,
            formattedTime: formattedTime,
            propertyName: propertyName,
            propertyId: scheduler.pid,
            action: 'schedule_assigned',
            role: 'assignee'
          }
        );
      }

      // NOTIFY BUSINESS (who owns the schedule)
      if (scheduler.uid) {
        let businessBody = '';
        
        if (isAgent) {
          businessBody = `Agent ${agentName} (${agentEmail}) has created a new schedule: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
        } else {
          businessBody = `A new schedule has been created: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
        }
        
        if (propertyName) {
          businessBody += ` for ${propertyName}`;
        }
        businessBody += ` with client ${scheduler.clientName}`;

        await createBusinessNotification(
          scheduler.uid,
          isAgent ? "New Schedule by Agent" : "New Schedule Created",
          businessBody,
          {
            type: NotificationType.EVENT,
            priority: NotificationPriority.MEDIUM,
            scheduleId: scheduler.scid,
            scheduleTitle: scheduler.title,
            agentId: scheduler.aid,
            agentName: agentName,
            agentEmail: agentEmail,
            clientName: scheduler.clientName,
            date: scheduler.date,
            time: timeValue,
            formattedTime: formattedTime,
            propertyName: propertyName,
            propertyId: scheduler.pid,
            action: isAgent ? 'schedule_created_by_agent' : 'schedule_created',
            role: 'business'
          }
        );
      }

      if (isAgent && scheduler.aid) {
        let agentConfirmationBody = `You successfully created a schedule for ${formattedDate} at ${formattedTime}`;
        if (propertyName) {
          agentConfirmationBody += ` at ${propertyName}`;
        }
        agentConfirmationBody += ` with client ${scheduler.clientName}`;

        await createAgentNotification(
          scheduler.aid,
          "Schedule Created Successfully",
          agentConfirmationBody,
          {
            type: NotificationType.EVENT,
            priority: NotificationPriority.MEDIUM,
            scheduleId: scheduler.scid,
            scheduleTitle: scheduler.title,
            businessId: scheduler.uid,
            businessName: businessName,
            clientName: scheduler.clientName,
            date: scheduler.date,
            time: timeValue,
            formattedTime: formattedTime,
            propertyName: propertyName,
            propertyId: scheduler.pid,
            action: 'schedule_created_confirmation',
            role: 'creator'
          }
        );
      }
    }

    res.json(
      Utils.PrintRest(
        created ? "Schedule created successfully" : "Schedule already exists",
        true,
        {
          scheduler,
          info: info || null
        }
      )
    );
  } catch (e) {
    if (e instanceof ErrorClass) {
      return res
        .status(e.statusCode)
        .json(Utils.PrintRest(e.message, false, e.data));
    }
    console.error('Error in CreateSchedule:', e.message);
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});


// export const CreateSchedule = Async(async (req, res, next) => {
//   try {
//     let data = { ...req.body };
//     let isAgent = false;
    
//     if (data.aid) {
//       if (req.agent && req.agent.aid === data.aid) {
//         isAgent = true;
//       } else if (!req.agency) {
//         isAgent = true;
//       }
//     }

//     if (isAgent && !data.uid) {
//       if (data.sid) {
//         const subProperty = await ModelSubProperty.findByPk(data.sid);
//         if (subProperty) {
//           data.uid = subProperty.uid;
//         }
//       }
//       else if (data.pid) {
//         const property = await ModelProperty.findByPk(data.pid);
//         if (property) {
//           data.uid = property.uid;
//         }
//       }
      
//       if (!data.uid) {
//         throw new ErrorClass(
//           "Business ID (uid) is required when agent schedules. Either provide uid or ensure property/sub-property exists.",
//           400
//         );
//       }
//     }

//     const { scheduler, created } = await ModelScheduler.Add(data, { isAgent });

//     if (created) {
//       const scheduleDate = new Date(scheduler.date);
//       const formattedDate = scheduleDate.toLocaleDateString();
//       const timeValue = getTimeValue(scheduler);
//       const formattedTime = await getFormattedTime(timeValue, scheduler.uid);
      
//       let propertyName = '';
//       if (scheduler.pid) {
//         const property = await ModelProperty.findByPk(scheduler.pid);
//         if (property) {
//           propertyName = property.name;
//         }
//       }

//       // Get agent details
//       let agentName = 'An agent';
//       let agentEmail = '';
//       if (scheduler.aid) {
//         const agent = await ModelAgent.findByPk(scheduler.aid);
//         if (agent) {
//           agentName = agent?.fullName;
//           agentEmail = agent.email;
//         }
//       }

//       // Get business details
//       let businessName = 'The business';
//       if (scheduler.uid) {
//         const business = await ModelUser.findByPk(scheduler.uid);
//         if (business) {
//           businessName = business.businessName || business.companyName || 'The business';
//         }
//       }

//       // NOTIFY AGENT (who the schedule is assigned to)
//       if (!isAgent && scheduler.aid) {
//         let agentBody = `${businessName} has scheduled ${scheduler.title} for you on ${formattedDate} at ${formattedTime}`;
//         if (propertyName) {
//           agentBody += ` for ${propertyName}`;
//         }
//         agentBody += ` with client ${scheduler.clientName}`;

//         await createAgentNotification(
//           scheduler.aid,
//           "New Schedule Assigned",
//           agentBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             businessId: scheduler.uid,
//             businessName: businessName,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: timeValue,
//             formattedTime: formattedTime,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: 'schedule_assigned',
//             role: 'assignee'
//           }
//         );
//       }

//       // NOTIFY BUSINESS (who owns the schedule)
//       if (scheduler.uid) {
//         let businessBody = '';
        
//         if (isAgent) {
//           businessBody = `Agent ${agentName} (${agentEmail}) has created a new schedule: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
//         } else {
//           businessBody = `A new schedule has been created: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
//         }
        
//         if (propertyName) {
//           businessBody += ` for ${propertyName}`;
//         }
//         businessBody += ` with client ${scheduler.clientName}`;

//         await createBusinessNotification(
//           scheduler.uid,
//           isAgent ? "New Schedule by Agent" : "New Schedule Created",
//           businessBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             agentId: scheduler.aid,
//             agentName: agentName,
//             agentEmail: agentEmail,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: timeValue,
//             formattedTime: formattedTime,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: isAgent ? 'schedule_created_by_agent' : 'schedule_created',
//             role: 'business'
//           }
//         );
//       }

//       if (isAgent && scheduler.aid) {
//         let agentConfirmationBody = `You successfully created a schedule for ${formattedDate} at ${formattedTime}`;
//         if (propertyName) {
//           agentConfirmationBody += ` at ${propertyName}`;
//         }
//         agentConfirmationBody += ` with client ${scheduler.clientName}`;

//         await createAgentNotification(
//           scheduler.aid,
//           "Schedule Created Successfully",
//           agentConfirmationBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             businessId: scheduler.uid,
//             businessName: businessName,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: timeValue,
//             formattedTime: formattedTime,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: 'schedule_created_confirmation',
//             role: 'creator'
//           }
//         );
//       }
//     }

//     res.json(
//       Utils.PrintRest(
//         created ? "Schedule created successfully" : "Schedule already exists",
//         true,
//         scheduler
//       )
//     );
//   } catch (e) {
//     if (e instanceof ErrorClass) {
//       return res
//         .status(e.statusCode)
//         .json(Utils.PrintRest(e.message, false, e.data));
//     }
//     console.error('Error in CreateSchedule:', e.message);
//     throw new ErrorClass(e.message, e.statusCode || 500);
//   }
// });

export const GetAllSchedule = Async(async (req, res, next) => {
  try {
    const schedule = await ModelScheduler.GetAll();
    res.json(Utils.PrintRest("Schedule fetched successfully", true, schedule));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const GetSchedulesByAdmin = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency; // business/agency id from params

    if (!uid) {
      throw new ErrorClass("Business ID (uid) is required", 400);
    }

    const schedules = await ModelScheduler.findAll({
      where: { uid },
      include: [
        {
          model: ModelProperty,
          as: "Property",
          attributes: ["name", "mapLink"],
        },
        {
          model: ModelSubProperty,
          as: "SubProperty",
          attributes: ["name", "mapLink"],
        },
        {
          model: ModelAgent,
          as: "Agent",
          attributes: ["fullName", "phone", "rank"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    if (!schedules.length) {
      return res.json(
        Utils.PrintRest("No schedules found for this admin", true, [])
      );
    }

    res.json(
      Utils.PrintRest("Schedules fetched successfully", true, schedules)
    );
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});

export const GetSchedulesByAgent = Async(async (req, res, next) => {
  try {
    const { aid } = req.user; // comes from JWT via MiddlewareAgentApiGuardMine

    if (!aid) {
      throw new ErrorClass("Agent ID (aid) is required", 400);
    }

    const schedules = await ModelScheduler.findAll({
      where: { aid },
      include: [
        {
          model: ModelProperty,
          as: "Property",
          attributes: ["name", "mapLink"],
        },
        {
          model: ModelSubProperty,
          as: "SubProperty",
          attributes: ["name", "mapLink"],
        },
        // {
        //   model: ModelUser,
        //   as: "User",
        //   attributes: ["businessName", "phone", "email"],
        // },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    if (!schedules.length) {
      return res.json(
        Utils.PrintRest("No schedules found for this agent", true, [])
      );
    }

    res.json(
      Utils.PrintRest("Schedules fetched successfully", true, schedules)
    );
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500);
  }
});

export const GetSchedule = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await ModelScheduler.Get(id);
    res.json(Utils.PrintRest("Schedule fetched successfully", true, schedule));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const UpdateSchedule = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { uid } = req.agency;
    
    const result = await ModelScheduler.Update(req.body, id, uid);
    const { schedule } = result;

    // Safely get and format time
    const timeValue = getTimeValue(schedule);
    const formattedTime = await getFormattedTime(timeValue, schedule.uid);

    // Create notification for both agent and business
    if (schedule && schedule?.aid && schedule?.uid) {
      await createScheduleUpdateNotification(
        schedule?.aid,
        schedule?.uid,
        schedule.title,
        schedule.scid,
        schedule.uid,
        formattedTime
      );
    }

    res.json(Utils.PrintRest("Schedule updated successfully", true, schedule));
  } catch (e) {
    if (e instanceof ErrorClass) {
      return res
        .status(e.statusCode)
        .json(Utils.PrintRest(e.message, false, e.data));
    }
    throw new ErrorClass(e.message, 500);
  }
});

export const GetSchedulesByStatus = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency;
    const { status } = req.params;
    const { isToday } = req.query;

    const schedules = await ModelScheduler.GetByStatus(
      uid,
      status,
      undefined,
      isToday
    );

    res.json(
      Utils.PrintRest("Schedules fetched successfully", true, schedules)
    );
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const ApproveSchedule = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { uid } = req.agency;
    
    const result = await ModelScheduler.Update(
      { status: "approved" },
      id,
      uid
    );

    const schedule = result.schedule || result;

    // Safely get and format time
    const timeValue = getTimeValue(schedule);
    const formattedTime = await getFormattedTime(timeValue, schedule.uid);

    // Notify the agent about approval
    if (schedule && schedule.aid) {
      await createScheduleApproveNotification(
        schedule.aid, // agentId
        schedule?.title, // property title
        schedule.scid, // schedule ID
        schedule.pid, // property ID
        formattedTime
      );
    }

    res.json(Utils.PrintRest("Schedule approved successfully", true, schedule));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const DeclineSchedule = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { uid } = req.agency;
    
    const result = await ModelScheduler.Update(
      { status: "declined" },
      id,
      uid
    );

    const schedule = result.schedule || result;
    
    // Safely get and format time
    const timeValue = getTimeValue(schedule);
    const formattedTime = await getFormattedTime(timeValue, schedule.uid);

    if (schedule && schedule.aid) {
      await createScheduleDeclineNotification(
        schedule.aid, 
        schedule?.title, 
        schedule.scid, 
        schedule.pid,
        formattedTime
      );
    }

    res.json(Utils.PrintRest("Schedule declined successfully", true, schedule));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});


// /**
//  * Scheduler Controller
//  */
// import Async from "./../core/core.async.js";
// import {
//   ModelScheduler,
//   ModelProperty,
//   ModelSubProperty,
//   ModelAgent,
//   ModelUser,
// } from "../models/index.js";
// import { ErrorClass, Utils } from "../core/index.js";
// import {
//   createAgentNotification,
//   createBusinessNotification,
//   createScheduleApproveNotification,
//   createScheduleDeclineNotification,
//   createScheduleUpdateNotification,
//   NotificationPriority,
//   NotificationType,
// } from "../services/notification.js";
// //

// export const CreateSchedule = Async(async (req, res, next) => {
//   try {
//     let data = { ...req.body };
//     let isAgent = false;
    
//     // Determine if request is from agent or business
//     if (req.user && req.user.role === "agent") {
//       isAgent = true;
//       data.aid = req.user.aid || data.aid; // Ensure agent ID from token is used
//     } else if (req.agency) {
//       isAgent = false;
//       data.uid = req.agency.uid || data.uid; // Ensure business ID from token is used
//     }

//     // For agent requests, automatically set the agent ID from token
//     if (isAgent) {
//       if (!data.aid && req.user.aid) {
//         data.aid = req.user.aid;
//       }
      
//       // Agent must provide either pid or sid
//       if (!data.pid && !data.sid) {
//         throw new ErrorClass(
//           "Property ID (pid) or Sub-property ID (sid) is required for agent scheduling",
//           400
//         );
//       }

//       // Resolve business ID from property/sub-property
//       if (!data.uid) {
//         if (data.sid) {
//           const subProperty = await ModelSubProperty.findByPk(data.sid);
//           if (subProperty) {
//             data.uid = subProperty.uid;
//           }
//         } else if (data.pid) {
//           const property = await ModelProperty.findByPk(data.pid);
//           if (property) {
//             data.uid = property.uid;
//           }
//         }
        
//         if (!data.uid) {
//           throw new ErrorClass(
//             "Could not determine business ID. Please ensure the property/sub-property exists.",
//             400
//           );
//         }
//       }
//     }

//     const { scheduler, created, info } = await ModelScheduler.Add(data, { isAgent });

//     if (created) {
//       const scheduleDate = new Date(scheduler.date);
//       const formattedDate = scheduleDate.toLocaleDateString();
//       const formattedTime = scheduler.time;
      
//       let propertyName = '';
//       if (scheduler.pid) {
//         const property = await ModelProperty.findByPk(scheduler.pid);
//         if (property) {
//           propertyName = property.name;
//         }
//       }

//       // Get agent details
//       let agentName = 'An agent';
//       let agentEmail = '';
//       if (scheduler.aid) {
//         const agent = await ModelAgent.findByPk(scheduler.aid);
//         if (agent) {
//           agentName = agent?.fullName;
//           agentEmail = agent.email;
//         }
//       }

//       // Get business details
//       let businessName = 'The business';
//       if (scheduler.uid) {
//         const business = await ModelUser.findByPk(scheduler.uid);
//         if (business) {
//           businessName = business.businessName || business.companyName || 'The business';
//         }
//       }

//       // NOTIFY AGENT (who the schedule is assigned to)
//       if (!isAgent && scheduler.aid) {
//         let agentBody = `${businessName} has scheduled ${scheduler.title} for you on ${formattedDate} at ${formattedTime}`;
//         if (propertyName) {
//           agentBody += ` for ${propertyName}`;
//         }
//         agentBody += ` with client ${scheduler.clientName}`;

//         await createAgentNotification(
//           scheduler.aid,
//           "New Schedule Assigned",
//           agentBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             businessId: scheduler.uid,
//             businessName: businessName,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: scheduler.time,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: 'schedule_assigned',
//             role: 'assignee'
//           }
//         );
//       }

//       // NOTIFY BUSINESS (who owns the schedule)
//       if (scheduler.uid) {
//         let businessBody = '';
        
//         if (isAgent) {
//           businessBody = `Agent ${agentName} (${agentEmail}) has created a new schedule: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
//         } else {
//           businessBody = `A new schedule has been created: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
//         }
        
//         if (propertyName) {
//           businessBody += ` for ${propertyName}`;
//         }
//         businessBody += ` with client ${scheduler.clientName}`;

//         await createBusinessNotification(
//           scheduler.uid,
//           isAgent ? "New Schedule by Agent" : "New Schedule Created",
//           businessBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             agentId: scheduler.aid,
//             agentName: agentName,
//             agentEmail: agentEmail,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: scheduler.time,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: isAgent ? 'schedule_created_by_agent' : 'schedule_created',
//             role: 'business'
//           }
//         );
//       }

//       if (isAgent && scheduler.aid) {
//         let agentConfirmationBody = `You successfully created a schedule for ${formattedDate} at ${formattedTime}`;
//         if (propertyName) {
//           agentConfirmationBody += ` at ${propertyName}`;
//         }
//         agentConfirmationBody += ` with client ${scheduler.clientName}`;

//         await createAgentNotification(
//           scheduler.aid,
//           "Schedule Created Successfully",
//           agentConfirmationBody,
//           {
//             type: NotificationType.EVENT,
//             priority: NotificationPriority.MEDIUM,
//             scheduleId: scheduler.scid,
//             scheduleTitle: scheduler.title,
//             businessId: scheduler.uid,
//             businessName: businessName,
//             clientName: scheduler.clientName,
//             date: scheduler.date,
//             time: scheduler.time,
//             propertyName: propertyName,
//             propertyId: scheduler.pid,
//             action: 'schedule_created_confirmation',
//             role: 'creator'
//           }
//         );
//       }
//     }

//     res.json(
//       Utils.PrintRest(
//         created ? "Schedule created successfully" : "Schedule already exists",
//         true,
//         {
//           scheduler,
//           info: info || null
//         }
//       )
//     );
//   } catch (e) {
//     if (e instanceof ErrorClass) {
//       return res
//         .status(e.statusCode)
//         .json(Utils.PrintRest(e.message, false, e.data));
//     }
//     console.error('Error in CreateSchedule:', e.message);
//     throw new ErrorClass(e.message, e.statusCode || 500);
//   }
// });


// // export const CreateSchedule = Async(async (req, res, next) => {
// //   try {
// //     let data = { ...req.body };
// //     let isAgent = false;
    
// //     if (data.aid) {
// //       if (req.agent && req.agent.aid === data.aid) {
// //         isAgent = true;
// //       } else if (!req.agency) {
// //         isAgent = true;
// //       }
// //     }

// //     if (isAgent && !data.uid) {
// //       if (data.sid) {
// //         const subProperty = await ModelSubProperty.findByPk(data.sid);
// //         if (subProperty) {
// //           data.uid = subProperty.uid;
// //         }
// //       }
// //       else if (data.pid) {
// //         const property = await ModelProperty.findByPk(data.pid);
// //         if (property) {
// //           data.uid = property.uid;
// //         }
// //       }
      
// //       if (!data.uid) {
// //         throw new ErrorClass(
// //           "Business ID (uid) is required when agent schedules. Either provide uid or ensure property/sub-property exists.",
// //           400
// //         );
// //       }
// //     }

// //     const { scheduler, created } = await ModelScheduler.Add(data, { isAgent });

// //     if (created) {
// //       const scheduleDate = new Date(scheduler.date);
// //       const formattedDate = scheduleDate.toLocaleDateString();
// //       const formattedTime = scheduler.time;
      
// //       let propertyName = '';
// //       if (scheduler.pid) {
// //         const property = await ModelProperty.findByPk(scheduler.pid);
// //         if (property) {
// //           propertyName = property.name;
// //         }
// //       }

// //       // Get agent details
// //       let agentName = 'An agent';
// //       let agentEmail = '';
// //       if (scheduler.aid) {
// //         const agent = await ModelAgent.findByPk(scheduler.aid);
// //         if (agent) {
// //           agentName = agent?.fullName;
// //           agentEmail = agent.email;
// //         }
// //       }

// //       // Get business details
// //       let businessName = 'The business';
// //       if (scheduler.uid) {
// //         const business = await ModelUser.findByPk(scheduler.uid);
// //         if (business) {
// //           businessName = business.businessName || business.companyName || 'The business';
// //         }
// //       }

// //       // NOTIFY AGENT (who the schedule is assigned to)
// //       if (!isAgent && scheduler.aid) {
// //         let agentBody = `${businessName} has scheduled ${scheduler.title} for you on ${formattedDate} at ${formattedTime}`;
// //         if (propertyName) {
// //           agentBody += ` for ${propertyName}`;
// //         }
// //         agentBody += ` with client ${scheduler.clientName}`;

// //         await createAgentNotification(
// //           scheduler.aid,
// //           "New Schedule Assigned",
// //           agentBody,
// //           {
// //             type: NotificationType.EVENT,
// //             priority: NotificationPriority.MEDIUM,
// //             scheduleId: scheduler.scid,
// //             scheduleTitle: scheduler.title,
// //             businessId: scheduler.uid,
// //             businessName: businessName,
// //             clientName: scheduler.clientName,
// //             date: scheduler.date,
// //             time: scheduler.time,
// //             propertyName: propertyName,
// //             propertyId: scheduler.pid,
// //             action: 'schedule_assigned',
// //             role: 'assignee'
// //           }
// //         );
// //       }

// //       // NOTIFY BUSINESS (who owns the schedule)
// //       if (scheduler.uid) {
// //         let businessBody = '';
        
// //         if (isAgent) {
// //           businessBody = `Agent ${agentName} (${agentEmail}) has created a new schedule: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
// //         } else {
// //           businessBody = `A new schedule has been created: ${scheduler.title} on ${formattedDate} at ${formattedTime}`;
// //         }
        
// //         if (propertyName) {
// //           businessBody += ` for ${propertyName}`;
// //         }
// //         businessBody += ` with client ${scheduler.clientName}`;

// //         await createBusinessNotification(
// //           scheduler.uid,
// //           isAgent ? "New Schedule by Agent" : "New Schedule Created",
// //           businessBody,
// //           {
// //             type: NotificationType.EVENT,
// //             priority: NotificationPriority.MEDIUM,
// //             scheduleId: scheduler.scid,
// //             scheduleTitle: scheduler.title,
// //             agentId: scheduler.aid,
// //             agentName: agentName,
// //             agentEmail: agentEmail,
// //             clientName: scheduler.clientName,
// //             date: scheduler.date,
// //             time: scheduler.time,
// //             propertyName: propertyName,
// //             propertyId: scheduler.pid,
// //             action: isAgent ? 'schedule_created_by_agent' : 'schedule_created',
// //             role: 'business'
// //           }
// //         );
// //       }

// //       if (isAgent && scheduler.aid) {
// //         let agentConfirmationBody = `You successfully created a schedule for ${formattedDate} at ${formattedTime}`;
// //         if (propertyName) {
// //           agentConfirmationBody += ` at ${propertyName}`;
// //         }
// //         agentConfirmationBody += ` with client ${scheduler.clientName}`;

// //         await createAgentNotification(
// //           scheduler.aid,
// //           "Schedule Created Successfully",
// //           agentConfirmationBody,
// //           {
// //             type: NotificationType.EVENT,
// //             priority: NotificationPriority.MEDIUM,
// //             scheduleId: scheduler.scid,
// //             scheduleTitle: scheduler.title,
// //             businessId: scheduler.uid,
// //             businessName: businessName,
// //             clientName: scheduler.clientName,
// //             date: scheduler.date,
// //             time: scheduler.time,
// //             propertyName: propertyName,
// //             propertyId: scheduler.pid,
// //             action: 'schedule_created_confirmation',
// //             role: 'creator'
// //           }
// //         );
// //       }
// //     }

// //     res.json(
// //       Utils.PrintRest(
// //         created ? "Schedule created successfully" : "Schedule already exists",
// //         true,
// //         scheduler
// //       )
// //     );
// //   } catch (e) {
// //     if (e instanceof ErrorClass) {
// //       return res
// //         .status(e.statusCode)
// //         .json(Utils.PrintRest(e.message, false, e.data));
// //     }
// //     console.error('Error in CreateSchedule:', e.message);
// //     throw new ErrorClass(e.message, e.statusCode || 500);
// //   }
// // });

// export const GetAllSchedule = Async(async (req, res, next) => {
//   try {
//     const schedule = await ModelScheduler.GetAll();
//     res.json(Utils.PrintRest("Schedule fetched successfully", true, schedule));
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const GetSchedulesByAdmin = Async(async (req, res, next) => {
//   try {
//     const { uid } = req.agency; // business/agency id from params

//     if (!uid) {
//       throw new ErrorClass("Business ID (uid) is required", 400);
//     }

//     const schedules = await ModelScheduler.findAll({
//       where: { uid },
//       include: [
//         {
//           model: ModelProperty,
//           as: "Property",
//           attributes: ["name", "mapLink"],
//         },
//         {
//           model: ModelSubProperty,
//           as: "SubProperty",
//           attributes: ["name", "mapLink"],
//         },
//         {
//           model: ModelAgent,
//           as: "Agent",
//           attributes: ["fullName", "phone", "rank"],
//         },
//       ],
//       order: [
//         ["date", "ASC"],
//         ["time", "ASC"],
//       ],
//     });

//     if (!schedules.length) {
//       return res.json(
//         Utils.PrintRest("No schedules found for this admin", true, [])
//       );
//     }

//     res.json(
//       Utils.PrintRest("Schedules fetched successfully", true, schedules)
//     );
//   } catch (e) {
//     throw new ErrorClass(e.message, e.statusCode || 500);
//   }
// });

// export const GetSchedulesByAgent = Async(async (req, res, next) => {
//   try {
//     const { aid } = req.user; // comes from JWT via MiddlewareAgentApiGuardMine

//     if (!aid) {
//       throw new ErrorClass("Agent ID (aid) is required", 400);
//     }

//     const schedules = await ModelScheduler.findAll({
//       where: { aid },
//       include: [
//         {
//           model: ModelProperty,
//           as: "Property",
//           attributes: ["name", "mapLink"],
//         },
//         {
//           model: ModelSubProperty,
//           as: "SubProperty",
//           attributes: ["name", "mapLink"],
//         },
//         // {
//         //   model: ModelUser,
//         //   as: "User",
//         //   attributes: ["businessName", "phone", "email"],
//         // },
//       ],
//       order: [
//         ["date", "ASC"],
//         ["time", "ASC"],
//       ],
//     });

//     if (!schedules.length) {
//       return res.json(
//         Utils.PrintRest("No schedules found for this agent", true, [])
//       );
//     }

//     res.json(
//       Utils.PrintRest("Schedules fetched successfully", true, schedules)
//     );
//   } catch (e) {
//     throw new ErrorClass(e.message, e.statusCode || 500);
//   }
// });

// export const GetSchedule = Async(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const schedule = await ModelScheduler.Get(id);
//     res.json(Utils.PrintRest("Schedule fetched successfully", true, schedule));
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const UpdateSchedule = Async(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { uid } = req.agency;
    
//     const result = await ModelScheduler.Update(req.body, id, uid);
//     const { schedule } = result;

//     // Create notification for both agent and business
//     if (schedule && schedule?.aid && schedule?.uid) {
//       await createScheduleUpdateNotification(
//         schedule?.aid,
//         schedule?.uid,
//         schedule.title,
//         schedule.scid,
//         schedule.uid
//       );
//     }

//     res.json(Utils.PrintRest("Schedule updated successfully", true, schedule));
//   } catch (e) {
//     if (e instanceof ErrorClass) {
//       return res
//         .status(e.statusCode)
//         .json(Utils.PrintRest(e.message, false, e.data));
//     }
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const GetSchedulesByStatus = Async(async (req, res, next) => {
//   try {
//     const { uid } = req.agency;
//     const { status } = req.params;
//     const { isToday } = req.query;

//     const schedules = await ModelScheduler.GetByStatus(
//       uid,
//       status,
//       undefined,
//       isToday
//     );

//     res.json(
//       Utils.PrintRest("Schedules fetched successfully", true, schedules)
//     );
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const ApproveSchedule = Async(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { uid } = req.agency;
    
//     const result = await ModelScheduler.Update(
//       { status: "approved" },
//       id,
//       uid
//     );

//     const schedule = result.schedule || result;

//     // Notify the agent about approval
//     if (schedule && schedule.aid) {
//       await createScheduleApproveNotification(
//         schedule.aid, // agentId
//         schedule?.title, // property title
//         schedule.scid, // schedule ID
//         schedule.pid // property ID
//       );
//     }

//     res.json(Utils.PrintRest("Schedule approved successfully", true, schedule));
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });

// export const DeclineSchedule = Async(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { uid } = req.agency;
    
//     const result = await ModelScheduler.Update(
//       { status: "declined" },
//       id,
//       uid
//     );

//     const schedule = result.schedule || result;
//     if (schedule && schedule.aid) {
//       await createScheduleDeclineNotification(
//         schedule.aid, 
//          schedule?.title, 
//         schedule.scid, 
//         schedule.pid
//       );
//     }

//     res.json(Utils.PrintRest("Schedule declined successfully", true, schedule));
//   } catch (e) {
//     throw new ErrorClass(e.message, 500);
//   }
// });
