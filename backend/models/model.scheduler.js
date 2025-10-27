import sequelize from "./../database/index.js";
import { DataTypes, Model, Op } from "sequelize";
import { startOfToday, endOfToday } from "date-fns";
import Joi from "joi";
import { ErrorClass } from "../core/index.js";
import {
  ModelAgent,
  ModelProperty,
  ModelSettings,
  ModelSubProperty,
  ModelUser,
} from "./index.js";
const queryInterface = sequelize.getQueryInterface();

const tableName = "schedules";

function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to validate 2-hour intervals
function validateTwoHourInterval(scheduleTimes) {
  if (!Array.isArray(scheduleTimes) || scheduleTimes.length <= 1) {
    return true;
  }
  
  const sortedTimes = [...scheduleTimes].sort((a, b) => a - b);
  
  for (let i = 1; i < sortedTimes.length; i++) {
    const timeDiff = sortedTimes[i] - sortedTimes[i - 1];
    if (timeDiff !== 120) {
      return false;
    }
  }
  
  return true;
}

// Helper function to convert time string to minutes
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

class ModelScheduler extends Model {}

ModelScheduler.init(
  {
    scid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uid: { type: DataTypes.INTEGER },
    aid: { type: DataTypes.INTEGER },
    pid: { type: DataTypes.INTEGER },
    sid: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING },
    time: { type: DataTypes.STRING },
    start: { type: DataTypes.DATE, defaultValue: new Date() },
    end: { type: DataTypes.DATE, defaultValue: new Date() },
    clientName: { type: DataTypes.STRING },
    clientPhone: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "declined", "approved"),
      defaultValue: "pending",
    },
  },
  { sequelize, tableName, paranoid: true }
);

function getDayName(dayIndex) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex];
}

ModelScheduler.Add = async (data, { isAgent = false } = {}) => {
  try {
    const schema = Joi.object({
      uid: Joi.number().when('$isAgent', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      aid: Joi.number().required(),
      pid: Joi.number().optional(),
      sid: Joi.number().optional(),
      start: Joi.string().required(),
      title: Joi.string().required(),
      end: Joi.string().required(),
      clientName: Joi.string().required(),
      clientPhone: Joi.string().optional().allow(""),
      date: Joi.string()
        .isoDate()
        .required()
        .custom((value, helpers) => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? helpers.error("any.invalid") : value;
        })
        .messages({
          "string.isoDate": "Date must be in YYYY-MM-DD format",
          "any.invalid": "Invalid date value",
          "any.required": "Date is required",
        }),
      time: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.pattern.base": "Time must be in HH:MM format (00:00-23:59)",
          "any.required": "Time is required",
        }),
         start: Joi.string().optional(),
      end: Joi.string().optional(),
    });

    const value = await schema.validateAsync(data, { context: { isAgent } });
    let agencyUid = value.uid;

    // Validate date is not in the past
    const visitDate = new Date(value.date);
    if (visitDate < new Date().setHours(0, 0, 0, 0)) {
      throw new ErrorClass("Cannot schedule in the past", 400);
    }

        // ✅ AUTO-CALCULATE start and end datetime
    const [hours, minutes] = value.time.split(':').map(Number);
    
    // Create start datetime (combine date + time)
    const startDateTime = new Date(value.date);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    // Create end datetime (default to 1 hour duration, or use provided end time)
    const endDateTime = new Date(startDateTime);
    if (value.end) {
      // If end time is provided, use it
      const [endHours, endMinutes] = value.end.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
    } else {
      // Default to 1 hour duration
      endDateTime.setHours(hours + 1, minutes, 0, 0);
    }

    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      throw new ErrorClass("End time must be after start time", 400);
    }

    // Set the calculated datetime values
    value.start = startDateTime;
    value.end = endDateTime;

    // ✅ DUPLICATE PREVENTION: Check if same agent already has a schedule for same property/sub-property and time
    const duplicateCheckWhere = {
      aid: value.aid,
      date: value.date,
      time: value.time,
      status: { [Op.ne]: "declined" } // Include pending and approved schedules
    };

    // Add property/sub-property conditions if provided
    if (value.pid) {
      duplicateCheckWhere.pid = value.pid;
    }
    if (value.sid) {
      duplicateCheckWhere.sid = value.sid;
    }

    const existingAgentSchedule = await ModelScheduler.findOne({
      where: duplicateCheckWhere
    });

    if (existingAgentSchedule) {
      throw new ErrorClass(
        `You already have a ${existingAgentSchedule.status} schedule for this property at the selected time.`,
        400,
        {
          validationError: "DUPLICATE_SCHEDULE",
          existingSchedule: {
            scid: existingAgentSchedule.scid,
            status: existingAgentSchedule.status,
            date: existingAgentSchedule.date,
            time: existingAgentSchedule.time,
            title: existingAgentSchedule.title
          }
        }
      );
    }

    // Check for existing APPROVED schedule (any agent) - only approved schedules block time slots
    const existingApprovedSchedule = await ModelScheduler.findOne({
      where: {
        uid: agencyUid,
        date: value.date,
        time: value.time,
        status: "approved"
      }
    });

    if (existingApprovedSchedule) {
      throw new ErrorClass(
        `This time slot is already booked by an approved schedule. Please choose a different time.`,
        400,
        {
          conflict: {
            existingTime: value.time,
            existingDate: value.date,
            existingAgent: existingApprovedSchedule.aid,
            status: "approved"
          }
        }
      );
    }

    // Handle Property/Sub-property references to get agencyUid
    if (value.pid) {
      const property = await ModelProperty.findByPk(value.pid);
      if (!property)
        throw new ErrorClass(`Property with ID ${value.pid} not found`, 404);
      agencyUid = property.uid;
      value.uid = agencyUid;
    }

    if (value.sid) {
      const subProperty = await ModelSubProperty.findByPk(value.sid);
      if (!subProperty)
        throw new ErrorClass(`Sub-property with ID ${value.sid} not found`, 404);
      agencyUid = subProperty.uid;
      value.uid = agencyUid;
      if (!value.pid) value.pid = subProperty.pid;
    }

    if (!agencyUid) {
      throw new ErrorClass("Business ID (uid) is required", 400);
    }

    // Check schedule limit per day per business - Only count APPROVED schedules
    const approvedSchedulesToday = await ModelScheduler.count({
      where: {
        uid: agencyUid,
        date: value.date,
        status: "approved" // Only approved schedules count toward the limit
      },
    });

    if (approvedSchedulesToday >= 3) {
      throw new ErrorClass(
        "Business has reached the maximum of 3 approved schedules for this day",
        400
      );
    }

    // Validate against agency availability settings
    const agencySettings = await ModelSettings.GetAgencySettings(agencyUid);
    if (!agencySettings) {
      throw new ErrorClass("Agency settings not found", 404);
    }

    const { scheduleDays, scheduleTime } = agencySettings;
    const visitDayIndex = visitDate.getDay();
    const visitTimeMinutes = timeToMinutes(value.time);
    const visitHour = parseInt(value.time.split(":")[0]);

    // Check if agency follows 2-hour interval rule
    const usesTwoHourIntervals = validateTwoHourInterval(scheduleTime);
    
    if (usesTwoHourIntervals) {
      // Validate that the selected time aligns with 2-hour intervals
      const isValidTime = scheduleTime.some(agencyTime => {
        return Math.abs(agencyTime - visitTimeMinutes) < 30;
      });

      if (!isValidTime) {
        throw new ErrorClass(
          "Selected time must align with agency's 2-hour schedule intervals",
          400,
          {
            validationError: "INVALID_TIME_INTERVAL",
            selectedTime: value.time,
            availableIntervals: scheduleTime.map(minutes => {
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
            })
          }
        );
      }
    }

    // Enhanced 2-hour interval check between existing APPROVED schedules only
    const existingApprovedSchedules = await ModelScheduler.findAll({
      where: {
        uid: agencyUid,
        date: value.date,
        status: "approved" // Only check approved schedules for interval conflicts
      },
      attributes: ["time", "scid", "aid"],
    });

    if (existingApprovedSchedules.length > 0) {
      const newScheduleMinutes = visitTimeMinutes;
      
      for (const existing of existingApprovedSchedules) {
        const existingMinutes = timeToMinutes(existing.time);
        const timeDiff = Math.abs(newScheduleMinutes - existingMinutes);
        
        if (timeDiff < 120) {
          throw new ErrorClass(
            `A minimum 2-hour interval is required between approved schedules. Conflict with existing approved schedule at ${existing.time}`,
            400,
            {
              conflict: {
                existingTime: existing.time,
                newTime: value.time,
                differenceMinutes: timeDiff,
                requiredInterval: 120,
                existingAgentId: existing.aid,
                status: "approved"
              }
            }
          );
        }
      }
    }

    // Day validation
    if (!scheduleDays.includes(visitDayIndex)) {
      const availabilityData = {
        agencyId: agencyUid,
        scheduleDays: scheduleDays.map((dayIndex) => ({
          index: dayIndex,
          name: getDayName(dayIndex),
          shortName: getDayName(dayIndex).substring(0, 3),
        })),
        scheduleTime: scheduleTime.map((minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return {
            time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
            label: `${hours}:${mins.toString().padStart(2, '0')}`
          };
        }),
      };

      throw new ErrorClass("Agency not available on selected day", 400, {
        validationError: "INVALID_DAY",
        selectedDay: {
          index: visitDayIndex,
          name: getDayName(visitDayIndex),
          date: value.date,
        },
        ...availabilityData,
      });
    }

    // Time validation (basic hour check)
    if (!scheduleTime.includes(visitTimeMinutes) && 
        !scheduleTime.some(time => Math.abs(time - visitTimeMinutes) < 30)) {
      const availabilityData = {
        agencyId: agencyUid,
        scheduleDays: scheduleDays.map((dayIndex) => ({
          index: dayIndex,
          name: getDayName(dayIndex),
          shortName: getDayName(dayIndex).substring(0, 3),
        })),
        scheduleTime: scheduleTime.map((minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return {
            time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
            label: `${hours}:${mins.toString().padStart(2, '0')}`
          };
        }),
      };

      throw new ErrorClass("Agency not available at selected time", 400, {
        validationError: "INVALID_TIME",
        selectedTime: {
          hour: visitHour,
          time: value.time,
          minutes: visitTimeMinutes
        },
        ...availabilityData,
      });
    }

    // Verify Agent exists
    const agent = await ModelAgent.findByPk(value.aid);
    if (!agent) {
      throw new ErrorClass(`Agent with ID ${value.aid} not found`, 404, {
        availableAgents: await ModelAgent.findAll({
          attributes: ["aid", "fullName"],
          limit: 10,
        }),
      });
    }

    // Check if there are pending schedules for the same time (informational only)
    const pendingSchedulesSameTime = await ModelScheduler.count({
      where: {
        uid: agencyUid,
        date: value.date,
        time: value.time,
        status: "pending"
      }
    });

    // Create new schedule
    const scheduler = await ModelScheduler.create(value);
    
    return { 
      scheduler, 
      created: true,
      info: pendingSchedulesSameTime > 0 ? 
        `Note: There are ${pendingSchedulesSameTime} pending schedule(s) for this time slot. The first approved schedule will secure the time slot.` 
        : null
    };

  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500, e.data || null);
  }
};

ModelScheduler.Update = async (data, scid, uid) => {
  try {
    const schema = Joi.object({
      title: Joi.string().optional(),
      clientName: Joi.string().optional(),
      clientPhone: Joi.string().optional().allow(""),
      date: Joi.string()
        .isoDate()
        .optional()
        .custom((value, helpers) => {
          if (!value) return value;
          const date = new Date(value);
          return isNaN(date.getTime()) ? helpers.error("any.invalid") : value;
        })
        .messages({
          "string.isoDate": "Date must be in YYYY-MM-DD format",
          "any.invalid": "Invalid date value",
        }),
      time: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          "string.pattern.base": "Time must be in HH:MM format (00:00-23:59)",
        }),
      // Optional end time for custom duration
      end: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          "string.pattern.base": "End time must be in HH:MM format (00:00-23:59)",
        }),
      status: Joi.string().optional(),
      // Remove start from allowed updates since we calculate it
      start: Joi.forbidden() // Don't allow manual start time updates
    });

    const value = await schema.validateAsync(data);
    const scheduler = await ModelScheduler.findOne({
      where: { scid, uid },
      include: [
        {
          model: ModelProperty,
          as: "Property",
          attributes: ["uid"],
          include: [
            {
              model: ModelUser,
              as: "User",
              attributes: ["uid", "firstName", "lastName"]
            }
          ]
        },
      ],
    });

    if (!scheduler) throw new ErrorClass("Schedule not found", 404);

    // ✅ AUTO-RECALCULATE start and end if date or time changes
    if (value.date || value.time) {
      const newDate = value.date || scheduler.date;
      const newTime = value.time || scheduler.time;
      
      const [hours, minutes] = newTime.split(':').map(Number);
      
      // Calculate new start datetime
      const newStartDateTime = new Date(newDate);
      newStartDateTime.setHours(hours, minutes, 0, 0);
      value.start = newStartDateTime;

      // Calculate new end datetime
      const newEndDateTime = new Date(newStartDateTime);
      if (value.end) {
        // Use provided end time
        const [endHours, endMinutes] = value.end.split(':').map(Number);
        newEndDateTime.setHours(endHours, endMinutes, 0, 0);
      } else {
        // Keep original duration (calculate from original start/end)
        const originalStart = new Date(scheduler.start);
        const originalEnd = new Date(scheduler.end);
        const durationMs = originalEnd - originalStart;
        
        newEndDateTime.setTime(newStartDateTime.getTime() + durationMs);
      }

      // Validate end time is after start time
      if (newEndDateTime <= newStartDateTime) {
        throw new ErrorClass("End time must be after start time", 400);
      }

      value.end = newEndDateTime;
    }

    // Special handling for status changes to "approved"
    if (value.status === "approved") {
      const agencyUid = scheduler.Property?.uid || uid;
      
      // Check if there's already an APPROVED schedule for this time slot
      const existingApprovedSchedule = await ModelScheduler.findOne({
        where: {
          uid: agencyUid,
          date: scheduler.date,
          time: scheduler.time,
          status: "approved",
          scid: { [Op.ne]: scid } // Exclude current schedule
        }
      });

      if (existingApprovedSchedule) {
        throw new ErrorClass(
          `Cannot approve this schedule. Time slot is already taken by an approved schedule.`,
          400,
          {
            conflict: {
              existingScheduleId: existingApprovedSchedule.scid,
              existingAgent: existingApprovedSchedule.aid,
              time: scheduler.time,
              date: scheduler.date
            }
          }
        );
      }

      // Check schedule limit per day for APPROVED schedules
      const approvedSchedulesToday = await ModelScheduler.count({
        where: {
          uid: agencyUid,
          date: scheduler.date,
          status: "approved",
          scid: { [Op.ne]: scid }
        },
      });

      if (approvedSchedulesToday >= 3) {
        throw new ErrorClass(
          "Business has reached the maximum of 3 approved schedules for this day",
          400
        );
      }

      // Check 2-hour interval with other APPROVED schedules
      const existingApprovedSchedules = await ModelScheduler.findAll({
        where: {
          uid: agencyUid,
          date: scheduler.date,
          status: "approved",
          scid: { [Op.ne]: scid }
        },
        attributes: ["time", "scid"],
      });

      const scheduleMinutes = timeToMinutes(scheduler.time);
      
      for (const existing of existingApprovedSchedules) {
        const existingMinutes = timeToMinutes(existing.time);
        const timeDiff = Math.abs(scheduleMinutes - existingMinutes);
        
        if (timeDiff < 120) {
          throw new ErrorClass(
            `A minimum 2-hour interval is required between approved schedules. Conflict with existing approved schedule at ${existing.time}`,
            400,
            {
              conflict: {
                existingTime: existing.time,
                currentTime: scheduler.time,
                differenceMinutes: timeDiff
              }
            }
          );
        }
      }
    }

    // Validate date is not in the past if being updated
    if (value.date) {
      const newDate = new Date(value.date);
      if (newDate < new Date().setHours(0, 0, 0, 0)) {
        throw new ErrorClass("Cannot reschedule to past date", 400);
      }
    }

    // If updating date/time, validate against agency schedule
    if (value.date || value.time) {
      const agencyUid = scheduler.Property?.uid || uid;
      const newDate = value.date || scheduler.date;
      const newTime = value.time || scheduler.time;
      const newTimeMinutes = timeToMinutes(newTime);

      // For date/time changes, check against APPROVED schedules only
      const existingApprovedSchedule = await ModelScheduler.findOne({
        where: {
          uid: agencyUid,
          date: newDate,
          time: newTime,
          status: "approved",
          scid: { [Op.ne]: scid }
        }
      });

      if (existingApprovedSchedule) {
        throw new ErrorClass(
          `Time slot is already taken by an approved schedule.`,
          400,
          {
            conflict: {
              existingTime: newTime,
              existingDate: newDate,
              existingAgent: existingApprovedSchedule.aid
            }
          }
        );
      }

      // Check schedule limit for APPROVED schedules only
      const approvedSchedulesToday = await ModelScheduler.count({
        where: {
          uid: agencyUid,
          date: newDate,
          status: "approved",
          scid: { [Op.ne]: scid }
        },
      });

      if (approvedSchedulesToday >= 3) {
        throw new ErrorClass(
          "Business has reached the maximum of 3 approved schedules for this day",
          400
        );
      }

      // Enhanced 2-hour interval check with APPROVED schedules only
      const existingApprovedSchedules = await ModelScheduler.findAll({
        where: {
          uid: agencyUid,
          date: newDate,
          status: "approved",
          scid: { [Op.ne]: scid }
        },
        attributes: ["time", "scid"],
      });

      for (const existing of existingApprovedSchedules) {
        const existingMinutes = timeToMinutes(existing.time);
        const timeDiff = Math.abs(newTimeMinutes - existingMinutes);
        
        if (timeDiff < 120) {
          throw new ErrorClass(
            `A minimum 2-hour interval is required between approved schedules. Conflict with existing approved schedule at ${existing.time}`,
            400,
            {
              conflict: {
                existingTime: existing.time,
                newTime: newTime,
                differenceMinutes: timeDiff
              }
            }
          );
        }
      }

      // Validate against agency settings
      const agencySettings = await ModelSettings.GetAgencySettings(agencyUid);
      if (!agencySettings) {
        throw new ErrorClass("Agency settings not found", 404);
      }

      const { scheduleDays, scheduleTime } = agencySettings;
      const visitDate = new Date(newDate);
      const visitDayIndex = visitDate.getDay();

      // Check 2-hour interval alignment
      const usesTwoHourIntervals = validateTwoHourInterval(scheduleTime);
      if (usesTwoHourIntervals) {
        const isValidTime = scheduleTime.some(agencyTime => {
          return Math.abs(agencyTime - newTimeMinutes) < 30;
        });

        if (!isValidTime) {
          throw new ErrorClass(
            "Selected time must align with agency's 2-hour schedule intervals",
            400,
            {
              validationError: "INVALID_TIME_INTERVAL",
              selectedTime: newTime,
              availableIntervals: scheduleTime.map(minutes => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
              })
            }
          );
        }
      }

      // Day validation
      if (!scheduleDays.includes(visitDayIndex)) {
        throw new ErrorClass("Agency not available on selected day", 400, {
          validationError: "INVALID_DAY",
          selectedDay: {
            index: visitDayIndex,
            name: getDayName(visitDayIndex),
            date: newDate,
          },
        });
      }

      // Time validation
      if (!scheduleTime.includes(newTimeMinutes) && 
          !scheduleTime.some(time => Math.abs(time - newTimeMinutes) < 30)) {
        throw new ErrorClass("Agency not available at selected time", 400, {
          validationError: "INVALID_TIME",
          selectedTime: {
            time: newTime,
            minutes: newTimeMinutes
          },
        });
      }
    }

    const updatedSchedule = await scheduler.update(value);
    return { schedule: updatedSchedule };
  } catch (e) {
    throw new ErrorClass(e.message, e.statusCode || 500, e.data || null);
  }
};

// Get pending schedules for a specific time slot (useful for admin)
ModelScheduler.GetPendingSchedulesForTimeSlot = async (uid, date, time) => {
  try {
    const pendingSchedules = await ModelScheduler.findAll({
      where: {
        uid,
        date,
        time,
        status: "pending"
      },
      include: [
        {
          model: ModelAgent,
          as: "Agent",
          attributes: ["fullName", "phone", "email", "rank"]
        }
      ],
      order: [['createdAt', 'ASC']] // Oldest first
    });
    
    return pendingSchedules;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

// Get available time slots considering only approved schedules
ModelScheduler.GetAvailableTimeSlots = async (uid, date) => {
  try {
    const agencySettings = await ModelSettings.GetAgencySettings(uid);
    if (!agencySettings) {
      throw new ErrorClass("Agency settings not found", 404);
    }

    const { scheduleTime, scheduleDays } = agencySettings;
    const visitDate = new Date(date);
    const visitDayIndex = visitDate.getDay();

    // Check if day is available
    if (!scheduleDays.includes(visitDayIndex)) {
      return []; // No available slots if day is not available
    }

    // Get approved schedules for the day
    const approvedSchedules = await ModelScheduler.findAll({
      where: {
        uid,
        date,
        status: "approved"
      },
      attributes: ["time"]
    });

    const bookedTimes = approvedSchedules.map(schedule => timeToMinutes(schedule.time));
    
    // Filter available times based on 2-hour intervals and booked times
    const availableSlots = scheduleTime.filter(agencyTime => {
      // Check if this time slot is booked
      const isBooked = bookedTimes.some(bookedTime => 
        Math.abs(bookedTime - agencyTime) < 120 // 2-hour buffer
      );
      
      return !isBooked;
    }).map(minutes => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return {
        time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
        minutes: minutes,
        available: true
      };
    });

    return availableSlots;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

// ... rest of the methods remain the same
ModelScheduler.Get = async (scid) => {
  try {
    const scheduler = await ModelScheduler.findOne({
      where: { scid },
      include: [
        { model: ModelProperty, as: "Property" },
        { model: ModelSubProperty, as: "SubProperty" },
        {
          model: ModelAgent,
          as: "Agent",
          attributes: ["fullName", "phone", "rank"],
        },
      ],
    });
    if (!scheduler) throw new ErrorClass("Schedule not found");
    return scheduler;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelScheduler.GetAll = async () => {
  try {
    const scheduler = await ModelScheduler.findAll({
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
    });
    if (!scheduler) throw new ErrorClass("Schedule not found");
    return scheduler;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelScheduler.GetByStatus = async (
  uid = undefined,
  status,
  aid = undefined,
  isToday = undefined
) => {
  try {
    const whereclause = { status };
    if (uid) whereclause.uid = uid;
    if (aid) whereclause.aid = aid;
    if (isToday) {
      whereclause.start = {
        [Op.between]: [startOfToday(), endOfToday()],
      };
    }

    const schedules = await ModelScheduler.findAll({
      where: whereclause,
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
    });
    if (!schedules) throw new ErrorClass("Schedule not found");
    return schedules;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelScheduler.GetByUserAndStatus = async (uid, status, isToday = false) => {
  try {
    const whereClause = { uid, status };
    if (isToday) {
      whereClause.start = {
        [Op.between]: [startOfToday(), endOfToday()],
      };
    }

    const schedules = await ModelScheduler.findAll({
      where: whereClause,
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
    });

    if (!schedules) throw new ErrorClass("Schedules not found");
    return schedules;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

sequelize.sync();
export default ModelScheduler;