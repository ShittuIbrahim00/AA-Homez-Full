import sequelize from "./../database/index.js";
import { DataTypes, Model } from "sequelize";
import coreUtils from "../core/core.utils.js";
import Joi from "joi";
import { ErrorClass } from "../core/index.js";

const tableName = "settings";

function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

function validateTwoHourInterval(scheduleTime) {
  if (!Array.isArray(scheduleTime) || scheduleTime.length <= 1) {
    return true; // Single time or empty array is valid
  }
  
  const sortedTimes = [...scheduleTime].sort((a, b) => a - b);
  
  for (let i = 1; i < sortedTimes.length; i++) {
    const timeDiff = sortedTimes[i] - sortedTimes[i - 1];
    
    // Allow multiples of 2 hours (users can skip intervals)
    if (timeDiff % 120 !== 0) {
      return false;
    }
  }
  
  return true;
}

class ModelSettings extends Model {}

ModelSettings.init(
  {
    sid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uid: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("images");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("images", arrayValue);
      },
    },
    scheduleDays: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("scheduleDays");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("scheduleDays", arrayValue);
      },
    },
    scheduleTime: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("scheduleTime");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("scheduleTime", arrayValue);
      },
    },
    type: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, tableName, paranoid: true }
);

ModelSettings.Add = async (data) => {
  try {
    const schema = Joi.object({
      uid: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      images: Joi.array().required(),
      scheduleDays: Joi.array().items(Joi.number()).optional(),
      scheduleTime: Joi.array().items(Joi.number()).custom((value, helpers) => {
        // Validate that intervals are multiples of 2 hours
        if (!validateTwoHourInterval(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, '2-hour interval validation').optional(),
    }).messages({
      'any.invalid': 'Schedule times must maintain 2-hour intervals (can skip intervals)'
    });

    const value = await schema.validateAsync(data);
    const [settings, created] = await ModelSettings.findOrCreate({
      where: { name: value.name },
      defaults: value,
    });
    return { settings, created };
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelSettings.Update = async (data, uid) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      location: Joi.string().optional(),
      images: Joi.array().optional(),
      scheduleDays: Joi.array().optional(),
      scheduleTime: Joi.array().items(Joi.number()).custom((value, helpers) => {
        // Validate 2-hour interval for updates as well
        if (value && !validateTwoHourInterval(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, '2-hour interval validation').optional(),
    }).messages({
      'any.invalid': 'Schedule times must maintain 2-hour intervals (can skip intervals)'
    });

    const value = await schema.validateAsync(data);
    const settings = await ModelSettings.findOne({ where: { uid } });
    if (!settings) throw new ErrorClass("Settings not found");
    return await settings.update(value);
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

// Other methods remain the same...
ModelSettings.Get = async (sid) => {
  try {
    const settings = await ModelSettings.findOne({
      where: { sid },
    });
    if (!settings) throw new ErrorClass("Settings not found");
    return settings;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelSettings.GetAgencySettings = async (uid) => {
  try {
    const settings = await ModelSettings.findOne({
      where: { uid },
    });
    if (!settings) throw new ErrorClass("Settings not found");
    return settings;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelSettings.GetAll = async () => {
  try {
    const settings = await ModelSettings.findAll({});
    if (!settings) throw new ErrorClass("Settings not found");
    return settings;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelSettings.GetByUser = async (uid) => {
  try {
    const settings = await ModelSettings.findOne({
      where: { uid },
    });
    if (!settings) throw new ErrorClass("Settings not found");
    return settings;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

sequelize.sync();
export default ModelSettings;