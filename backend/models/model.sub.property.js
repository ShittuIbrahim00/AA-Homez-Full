import sequelize from "./../database/index.js";
import { DataTypes, Model, Sequelize } from "sequelize";
import coreUtils from "../core/core.utils.js";
import Joi from "joi";
import { ErrorClass } from "../core/index.js";
import { ModelProperty } from "./index.js";
import Decimal from "decimal.js";
import { updatePropertyPrices } from "./model.property.js";
import { transformMapLink } from "../services/map.service.js";

const tableName = "subProperty";
function safeDecimal(value) {
  if (value instanceof Decimal) return value.toNumber();
  if (typeof value === "string") return parseFloat(value);
  return value;
}

// const queryInterface = sequelize.getQueryInterface();
function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

class ModelSubProperty extends Model {}

ModelSubProperty.init(
  {
    sid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    aid: { type: DataTypes.INTEGER },
    pid: { type: DataTypes.INTEGER },
    uid: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const val = this.getDataValue("price");
        return coreUtils.formatLargeNumber(val);
      },
      set(value) {
        this.setDataValue("price", safeDecimal(value));
      },
    },
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
    keyInfo: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("keyInfo");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("keyInfo", arrayValue);
      },
    },
    bedrooms: { type: DataTypes.INTEGER },
    bathrooms: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("bathrooms");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("bathrooms", arrayValue);
      },
    },
    interior: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("interior");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("interior", arrayValue);
      },
    },
    appliances: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("appliances");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("appliances", arrayValue);
      },
    },
    otherRooms: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("otherRooms");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("otherRooms", arrayValue);
      },
    },
    landInfo: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("landInfo");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("landInfo", arrayValue);
      },
    },
    utilities: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("utilities");
        const parsedArray = isJson(rawValue) ? JSON.parse(rawValue) : rawValue;
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        } else {
          return [];
        }
      },
      set(value) {
        const arrayValue = Array.isArray(value) ? value : [];
        this.setDataValue("utilities", arrayValue);
      },
    },
    mapLink: { type: DataTypes.STRING },
    finalMapLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    landMark: { type: DataTypes.STRING },
    yearBuilt: { type: DataTypes.STRING },
    foundation: { type: DataTypes.STRING },
    soldTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: { type: DataTypes.STRING },
    listingStatus: {
      type: DataTypes.ENUM("sold", "available", "unavailable"),
      defaultValue: "unavailable",
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const val = this.getDataValue("paidAmount");
        return coreUtils.formatLargeNumber(val);
      },
      set(value) {
        this.setDataValue("paidAmount", safeDecimal(value));
      },
      validate: {
        isLessThanPrice(value) {
          const price = this.getDataValue("price");
          if (new Decimal(value).greaterThan(price)) {
            throw new Error("Payment cannot exceed property price");
          }
        },
      },
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "installment", "paid"),
      defaultValue: "pending",
    },
    deficitAmount: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("price") - this.getDataValue("paidAmount");
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName, paranoid: true, timestamps: true }
);

ModelSubProperty.Add = async (data, pid, uid) => {
  const transaction = await sequelize.transaction();
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      price: Joi.number().required(),
      images: Joi.array().optional().default([]),
      keyInfo: Joi.array().optional().default([]),
      bathrooms: Joi.array().optional().default([]),
      appliances: Joi.array().optional().default([]),
      interior: Joi.array().optional().default([]),
      otherRooms: Joi.array().optional().default([]),
      landInfo: Joi.array().optional().default([]),
      utilities: Joi.array().optional().default([]),
      bedrooms: Joi.number().optional().default(0),
      mapLink: Joi.string().optional().default(""),
      landMark: Joi.string().optional().default(""),
      yearBuilt: Joi.string().optional().default(""),
      foundation: Joi.string().optional().default(""),
      type: Joi.string().required(),
      listingStatus: Joi.string()
        .valid("sold", "available", "unavailable")
        .default("available"),
      unitNumber: Joi.string().optional(),
      size: Joi.string().optional(),
      status: Joi.string().optional(),
    });

    const validated = await schema.validateAsync(data);

    const property = await ModelProperty.findOne({
      where: { pid, uid },
      transaction,
    });
    if (!property) throw new ErrorClass("Property not found", 404);

    // --- Map Normalization (Reusable Utility) ---
    let mapLink = validated.mapLink;
    let finalMapLink = "";

    if (validated.mapLink) {
      const transformed = await transformMapLink(
        validated.mapLink,
        validated.location
      );
      mapLink = transformed.mapLink;
      finalMapLink = transformed.finalMapLink;
    }

    // Add sub-property
    const subProperty = await ModelSubProperty.create(
      {
        ...validated,
        mapLink,
        finalMapLink,
        pid,
        uid,
      },
      { transaction }
    );

    // Update parent property prices to include the new subproperty
    await updatePropertyPrices(pid, transaction);

    await transaction.commit();
    return subProperty;
  } catch (error) {
    await transaction.rollback();
    throw new ErrorClass(error.message, 400);
  }
};

ModelSubProperty.Update = async (data, sid, uid) => {
  const transaction = await sequelize.transaction();
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      location: Joi.string().optional(),
      price: Joi.number().optional(),
      images: Joi.array().optional(),
      keyInfo: Joi.array().optional(),
      bathrooms: Joi.array().optional(),
      appliances: Joi.array().optional(),
      interior: Joi.array().optional(),
      otherRooms: Joi.array().optional(),
      landInfo: Joi.array().optional(),
      utilities: Joi.array().optional(),
      bedrooms: Joi.number().optional(),
      mapLink: Joi.string().optional(),
      landMark: Joi.string().optional(),
      yearBuilt: Joi.string().optional(),
      foundation: Joi.string().optional(),
      type: Joi.string().optional(),
      unitNumber: Joi.string().optional(),
      size: Joi.string().optional(),
      status: Joi.string().optional(),
    });

    const value = await schema.validateAsync(data);

    const subProperty = await ModelSubProperty.findOne({
      where: { sid, uid, deletedAt: null },
      transaction,
    });

    if (!subProperty) {
      await transaction.rollback();
      throw new ErrorClass("Property not found", 404);
    }

    // --- Map Normalization (Reusable Utility) ---
    let updateData = { ...value };

    if (value.mapLink !== undefined) {
      const { mapLink, finalMapLink } = await transformMapLink(
        value.mapLink,
        value.location || subProperty.location // Use new location if provided, otherwise existing location
      );
      updateData.mapLink = mapLink;
      updateData.finalMapLink = finalMapLink;
    }

    const updated = await subProperty.update(updateData, { transaction });

    // Update parent property prices if price was changed
    if (value.price !== undefined) {
      await updatePropertyPrices(updated.pid, transaction);
    }

    await transaction.commit();
    return updated;
  } catch (e) {
    await transaction.rollback();
    throw new ErrorClass(e.message, e.status || 500);
  }
};

ModelSubProperty.Get = async (sid) => {
  const property = await ModelSubProperty.findOne({
    where: { sid, deletedAt: null }, // Exclude deleted
    include: [{ model: ModelProperty, as: "Property" }],
  });
  if (!property) throw new ErrorClass("Property not found", 404);
  return property;
};

ModelSubProperty.getAllSubProperties = async (query = {}) => {
  try {
    const { pid, uid, limit, offset } = query;

    const where = { deletedAt: null };
    if (pid) where.pid = pid;
    if (uid) where.uid = uid;

    const options = {
      where,
      include: [{ model: ModelProperty, as: "Property" }],
      order: [["createdAt", "DESC"]],
    };

    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);

    const subProperties = await ModelSubProperty.findAll(options);
    return subProperties;
  } catch (error) {
    throw new ErrorClass(error.message, 500);
  }
};

sequelize.sync();
export default ModelSubProperty;
