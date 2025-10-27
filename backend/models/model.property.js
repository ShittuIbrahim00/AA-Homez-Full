import sequelize from "./../database/index.js";
import { DataTypes, Model, Op, Sequelize } from "sequelize";
import coreUtils from "../core/core.utils.js";
import Joi from "joi";
import { ErrorClass } from "../core/index.js";
import {
  ModelAgent,
  ModelSubProperty,
  ModelTransaction,
  ModelUser,
} from "./index.js";
import ModelSettings from "./model.settings.js";
import {
  calculateClubReward,
  calculateReferralReward,
} from "../core/core.algo.js";
import Decimal from "decimal.js";
import { transformMapLink } from "../services/map.service.js";

Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -20,
  toExpPos: 20,
});

const queryInterface = sequelize.getQueryInterface();

const tableName = "property";

// const queryInterface = sequelize.getQueryInterface();
function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

class ModelProperty extends Model {}

ModelProperty.init(
  {
    pid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uid: { type: DataTypes.INTEGER },
    aid: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    priceRange: {
      type: DataTypes.VIRTUAL,
      get() {
        const start = coreUtils.formatLargeNumber(
          this.getDataValue("priceStart")
        );
        const end = coreUtils.formatLargeNumber(this.getDataValue("priceEnd"));
        return `${start} - ${end}`;
      },
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const rawVal = this.getDataValue("paidAmount");
        return coreUtils.formatLargeNumber(rawVal);
      },
      validate: {
        isLessThanPrice(value) {
          if (new Decimal(value).greaterThan(this.getDataValue("price"))) {
            throw new Error("Paid amount cannot exceed price");
          }
        },
      },
    },

    deficitAmount: {
      type: DataTypes.VIRTUAL,
      get() {
        const price = new Decimal(this.getDataValue("price") || 0);
        const paid = new Decimal(this.getDataValue("paidAmount") || 0);
        const deficit = price.minus(paid);
        return deficit.isNegative() ? 0 : deficit.toNumber();
      },
    },

    priceStart: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const val = this.getDataValue("priceStart");
        return coreUtils.formatLargeNumber(val);
      },
    },
    priceEnd: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const val = this.getDataValue("priceEnd");
        return coreUtils.formatLargeNumber(val);
      },
    },
    location: { type: DataTypes.STRING },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      get() {
        const rawVal = this.getDataValue("price");
        return coreUtils.formatLargeNumber(rawVal);
      },
    },
    basePrice: {
      // ADD THIS FIELD to store the original property price
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
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
    mapLink: { type: DataTypes.STRING },
    finalMapLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    landMark: { type: DataTypes.STRING },
    yearBuilt: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    hottestCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    listingStatus: {
      type: DataTypes.ENUM("sold", "available", "unavailable"),
      defaultValue: "unavailable",
    },
    paymentStatus: {
      type: DataTypes.ENUM("paid", "pending", "installment", "cancelled"),
      defaultValue: "pending",
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    soldTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, tableName, paranoid: true }
);


export const debugLog = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] DEBUG: ${message}`, JSON.stringify(data));
};

ModelProperty.Add = async (data, uid) => {
  const transaction = await sequelize.transaction();
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      priceStart: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      priceEnd: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      price: Joi.number().required(),
      images: Joi.array().items(Joi.string().uri()).required(),
      mapLink: Joi.string().uri().required(),
      landMark: Joi.string().required(),
      yearBuilt: Joi.string().required(),
      type: Joi.string()
        .valid("Residential", "Commercial", "Industrial", "Land")
        .required(),
      listingStatus: Joi.string()
        .valid("sold", "available", "unavailable")
        .default("available"),
    });

    const validated = await schema.validateAsync(data);

    // --- Price Normalization ---
    const priceValue = Number(validated.price);
    const priceStart = validated.priceStart
      ? typeof validated.priceStart === "string"
        ? parseFloat(validated.priceStart.replace(/[^\d.]/g, ""))
        : Number(validated.priceStart)
      : priceValue;
    const priceEnd = validated.priceEnd
      ? typeof validated.priceEnd === "string"
        ? parseFloat(validated.priceEnd.replace(/[^\d.]/g, ""))
        : Number(validated.priceEnd)
      : priceValue * 1.2;

    // --- Map Normalization (Reusable Utility) ---
    const { mapLink, finalMapLink } = await transformMapLink(
      validated.mapLink,
      validated.location
    );

    // --- Persist Property ---
    const [property, created] = await ModelProperty.findOrCreate({
      where: { name: validated.name, uid },
      defaults: {
        ...validated,
        mapLink,
        finalMapLink,
        price: priceValue,
        basePrice: priceValue,
        priceStart,
        priceEnd,
        uid,
      },
      transaction,
    });

    await transaction.commit();
    return { property, created };
  } catch (error) {
    await transaction.rollback();
    throw new ErrorClass(error.message, 400);
  }
};

ModelProperty.Payment = async (
  pid,
  aid,
  uid,
  amount,
  subPropertyId = null,
  soldTo = null
) => {
  debugLog("Payment process started", {
    pid,
    aid,
    uid,
    amount,
    subPropertyId,
    soldTo,
  });

  const transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    timeout: 30000,
  });

  try {
    const schema = Joi.object({
      pid: Joi.any().required(),
      aid: Joi.any().optional(),
      uid: Joi.any().required(),
      amount: Joi.number().positive().required(),
      subPropertyId: Joi.any().optional(),
      soldTo: Joi.string().optional(),
    });

    const validated = await schema.validateAsync({
      pid,
      aid,
      uid,
      amount,
      subPropertyId,
      soldTo,
    });
    debugLog("Input validation passed", validated);

    const include = [
      { model: ModelTransaction, as: "Transactions" },
      { model: ModelUser, as: "User", where: { uid }, required: true },
    ];

    if (subPropertyId) {
      include.push({
        model: ModelSubProperty,
        as: "SubProperties",
        where: { sid: subPropertyId },
        required: true,
      });
    }

    const property = await ModelProperty.findOne({
      where: { pid },
      include,
      lock: true,
      transaction,
    });

    if (!property) {
      throw new ErrorClass("Property not found", 404);
    }

    if (aid) {
      const agent = await ModelAgent.findOne({
        where: { aid },
        transaction,
      });
      if (!agent) {
        throw new ErrorClass("Agent not found", 404);
      }
    }

    const runAgentComp = async ({
      effectiveAid,
      baseAmount,
      pid,
      uid,
      sid = null,
    }) => {
      if (!effectiveAid) return;

      const salesCommission = await calculateClubReward(
        effectiveAid,
        baseAmount
      );
      const referralCommissions = await calculateReferralReward(
        effectiveAid,
        baseAmount
      );

      await ModelAgent.increment(
        {
          sales_earnings: salesCommission.amount,
          total_earnings: salesCommission.amount,
          sales_portfolio: baseAmount,
        },
        { where: { aid: effectiveAid }, transaction }
      );

      await ModelTransaction.create(
        {
          aid: effectiveAid,
          pid,
          sid: sid || null,
          uid,
          type: "credit",
          service: "sales_commission",
          amount: salesCommission.amount,
          status: "successful",
          role: "agent",
        },
        { transaction }
      );

      if (referralCommissions.length > 0) {
        await Promise.all(
          referralCommissions.map(async (ref) => {
            await ModelAgent.increment(
              {
                referral_earnings: ref.amount,
                total_earnings: ref.amount,
              },
              { where: { aid: ref.aid }, transaction }
            );

            await ModelTransaction.create(
              {
                aid: ref.aid,
                pid,
                sid: sid || null,
                uid,
                type: "credit",
                service: "referral_commission",
                amount: ref.amount,
                status: "successful",
                role: "agent",
              },
              { transaction }
            );
          })
        );
      }
    };

    if (subPropertyId) {
      const subProperty = property.SubProperties[0];
      if (!subProperty) throw new ErrorClass("Sub-property not found", 404);

      if (subProperty.paymentStatus === "paid") {
        throw new ErrorClass("Sub-property payment already completed", 400);
      }

      const rawPrice = new Decimal(subProperty.getDataValue("price"));
      const preciseAmount = new Decimal(amount).toDecimalPlaces(2);

      if (!preciseAmount.equals(rawPrice)) {
        throw new ErrorClass(
          `Full payment required. Expected ${rawPrice.toFixed(2)}`,
          400
        );
      }

      const subPaidAmount = rawPrice.toNumber();

      // UPDATE: Set the aid on the subproperty when paid
      const effectiveAid = aid || property.aid || null;

      subProperty.setDataValue("paidAmount", subPaidAmount);
      subProperty.paymentStatus = "paid";
      subProperty.listingStatus = "sold";
      subProperty.status = false;
      subProperty.soldTo = soldTo;
      subProperty.aid = effectiveAid;

      await subProperty.save({ transaction });

      const ref = coreUtils.generateReference(8);
      const transactionRecord = await ModelTransaction.create(
        {
          aid: effectiveAid,
          pid,
          sid: subPropertyId,
          uid,
          type: "credit",
          service: "sale",
          amount: subPaidAmount,
          ref,
          status: "successful",
          role: "subProperty",
          prevBalance: subPaidAmount,
          newBalance: 0,
        },
        { transaction }
      );

      await ModelUser.increment("balance", {
        by: subPaidAmount,
        where: { uid, role: "business" },
        transaction,
      });

      // When subproperty is sold, update the main property price by subtracting the sold subproperty price
      const currentPropertyPrice = new Decimal(property.getDataValue("price"));
      const newPropertyPrice = currentPropertyPrice.minus(subPaidAmount);

      // Update the main property price to reflect the sold subproperty
      await property.update(
        {
          price: newPropertyPrice.toNumber(),
        },
        { transaction }
      );

      const allSubProperties = await ModelSubProperty.findAll({
        where: { pid },
        transaction,
      });
      const allPaid = allSubProperties.every((sub) =>
        new Decimal(sub.getDataValue("paidAmount") || 0).greaterThanOrEqualTo(
          new Decimal(sub.getDataValue("price") || 0)
        )
      );

      if (allPaid) {
        await property.update(
          {
            paymentStatus: "paid",
            listingStatus: "sold",
            status: false,
            soldTo,
          },
          { transaction }
        );
      }

      await runAgentComp({
        effectiveAid,
        baseAmount: subPaidAmount,
        pid,
        uid,
        sid: subPropertyId,
      });

      await transaction.commit();

      return {
        property: await ModelProperty.findByPk(pid, {
          include: [
            {
              model: ModelSubProperty,
              as: "SubProperties",
              where: { sid: subPropertyId },
            },
          ],
        }),
        subProperty: await ModelSubProperty.findByPk(subPropertyId),
        transaction: transactionRecord,
      };
    }

    if (property.paymentStatus === "paid") {
      throw new ErrorClass("Property payment already completed", 400);
    }

    const propertyPrice = new Decimal(property.getDataValue("price"));
    const preciseAmount = new Decimal(amount).toDecimalPlaces(2);

    if (!preciseAmount.equals(propertyPrice)) {
      throw new ErrorClass(
        `Full payment required. Expected ${propertyPrice.toFixed(2)}`,
        400
      );
    }

    if (!property.aid && aid) {
      await property.update({ aid }, { transaction });
    }

    property.setDataValue("paidAmount", propertyPrice.toNumber());
    property.paymentStatus = "paid";
    await property.save({ transaction });

    const subUnits = await ModelSubProperty.findAll({
      where: { pid },
      transaction,
    });

    // UPDATE: Set aid on all subproperties when property is paid
    const effectiveAid = aid || property.aid || null;

    for (const sub of subUnits) {
      const subPrice = new Decimal(sub.getDataValue("price")).toNumber();
      await sub.update(
        {
          paidAmount: subPrice,
          paymentStatus: "paid",
          listingStatus: "sold",
          status: false,
          soldTo,
          aid: effectiveAid, // ADD THIS LINE to set aid on all subproperties
        },
        { transaction }
      );
    }

    const ref = coreUtils.generateReference(8);
    const transactionRecord = await ModelTransaction.create(
      {
        aid: effectiveAid,
        pid,
        uid,
        type: "credit",
        service: "sale",
        amount: propertyPrice.toNumber(),
        ref,
        status: "successful",
        role: "property",
        prevBalance: propertyPrice.toNumber(),
        newBalance: 0,
      },
      { transaction }
    );

    await property.update(
      {
        listingStatus: "sold",
        status: false,
        soldTo,
      },
      { transaction }
    );

    await ModelUser.increment("balance", {
      by: propertyPrice.toNumber(),
      where: { uid, role: "business" },
      transaction,
    });

    await runAgentComp({
      effectiveAid,
      baseAmount: propertyPrice.toNumber(),
      pid,
      uid,
      sid: null,
    });

    await transaction.commit();
    return {
      property: await ModelProperty.findByPk(pid, {
        include: [{ model: ModelSubProperty, as: "SubProperties" }],
      }),
      transaction: transactionRecord,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const updatePropertyPrices = async (pid, transaction) => {
  const subProperties = await ModelSubProperty.findAll({
    where: { pid },
    attributes: ["price", "paidAmount"],
    raw: true,
    transaction,
  });

  if (subProperties.length > 0) {
    const prices = subProperties.map((sub) => Number(sub.price));
    const priceStart = Math.min(...prices);
    const priceEnd = Math.max(...prices);

    // Calculate total price from subproperties
    const totalSubPropertiesPrice = prices.reduce(
      (sum, price) => sum + price,
      0
    );

    // Get the base property price
    const property = await ModelProperty.findOne({
      where: { pid },
      attributes: ["basePrice"],
      raw: true,
      transaction,
    });

    const basePrice = property?.basePrice || 0;

    // Total price = base property price + all subproperties prices
    const totalPrice = new Decimal(basePrice)
      .plus(totalSubPropertiesPrice)
      .toNumber();

    await ModelProperty.update(
      {
        priceStart,
        priceEnd,
        price: totalPrice,
      },
      {
        where: { pid },
        transaction,
      }
    );
  } else {
    // If no subproperties, use base price only
    const property = await ModelProperty.findOne({
      where: { pid },
      attributes: ["basePrice"],
      raw: true,
      transaction,
    });

    if (property) {
      await ModelProperty.update(
        {
          priceStart: property.basePrice,
          priceEnd: property.basePrice,
          price: property.basePrice,
        },
        {
          where: { pid },
          transaction,
        }
      );
    }
  }
};

ModelProperty.Update = async (data, pid, uid) => {
  const transaction = await sequelize.transaction();
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      location: Joi.string().optional(),
      priceStart: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      priceEnd: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      price: Joi.number().optional(),
      images: Joi.array().items(Joi.string().uri()).optional(),
      mapLink: Joi.string().uri().optional(),
      landMark: Joi.string().optional(),
      yearBuilt: Joi.string().optional(),
      type: Joi.string()
        .valid("Residential", "Commercial", "Industrial", "Land")
        .optional(),
      listingStatus: Joi.string()
        .valid("sold", "available", "unavailable")
        .optional(),
    });

    const validated = await schema.validateAsync(data);

    // First, find the property
    const property = await ModelProperty.findOne({
      where: { pid, uid },
      transaction,
    });

    if (!property) {
      await transaction.rollback();
      throw new ErrorClass("Property not found", 404);
    }

    // Handle price conversions similar to Add method
    let updateData = { ...validated };

    if (validated.price !== undefined) {
      updateData.price = Number(validated.price);
    }

    if (validated.priceStart !== undefined) {
      updateData.priceStart =
        typeof validated.priceStart === "string"
          ? parseFloat(validated.priceStart.replace(/[^\d.]/g, ""))
          : Number(validated.priceStart);
    }

    if (validated.priceEnd !== undefined) {
      updateData.priceEnd =
        typeof validated.priceEnd === "string"
          ? parseFloat(validated.priceEnd.replace(/[^\d.]/g, ""))
          : Number(validated.priceEnd);
    }

    // If price is updated but priceStart/priceEnd aren't provided, recalculate them
    if (validated.price !== undefined && validated.priceStart === undefined) {
      updateData.priceStart = updateData.price;
    }

    if (validated.price !== undefined && validated.priceEnd === undefined) {
      updateData.priceEnd = updateData.price * 1.2;
    }

    // --- Map Normalization (Reusable Utility) ---
    if (validated.mapLink !== undefined) {
      const { mapLink, finalMapLink } = await transformMapLink(
        validated.mapLink,
        validated.location || property.location // Use new location if provided, otherwise existing location
      );
      updateData.mapLink = mapLink;
      updateData.finalMapLink = finalMapLink;
    }

    const updated = await property.update(updateData, { transaction });
    await transaction.commit();

    return updated;
  } catch (error) {
    await transaction.rollback();
    throw new ErrorClass(error.message, 400);
  }
};

ModelProperty.AgentSoldProperties = async (aid) => {
  try {
    const property = await ModelProperty.findAll({
      where: { aid },
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
        },
      ],
    });

    return property;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelProperty.Get = async (pid) => {
  try {
    const property = await ModelProperty.findOne({
      where: { pid },
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
          where: { deletedAt: null },
          required: false,
        },
        {
          model: ModelUser,
          as: "User",
          attributes: ["uid", "firstName", "lastName"],
          include: [
            {
              model: ModelSettings,
              as: "Settings",
              // Optional settings check (uncomment when ready)
              // where: { status: true },
              required: false,
            },
          ],
        },
      ],
      paranoid: false, // Include soft-deleted if needed
    });

    if (!property) {
      return null;
    }

    // Optional settings check (uncomment when ready)
    /*
    if (property.User?.Settings?.status === false) {
      return null;
    }
    */

    await property.increment("hottestCount");

    return {
      ...property.get({ plain: true }),
      // Add any additional transformations here
    };
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelProperty.GetAll = async (page, limit = 10) => {
  try {
    const options = {
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
        },
        {
          model: ModelUser,
          as: "User",
          include: [
            {
              model: ModelSettings,
              as: "Settings",
              where: { status: { [Op.ne]: false } },
              required: false,
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      distinct: true, // Important for correct pagination counts
    };

    const result = await coreUtils.Paginated(
      ModelProperty,
      page,
      limit,
      options
    );
    return {
      properties: result.data,
      total: result.total,
      pages: result.pages,
    };
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelProperty.GetAllAdmin = async (page, limit = 10, status = "all", uid) => {
  try {
    debugLog("GetAllAdmin model method called", { page, limit, status, uid });

    if (!uid) {
      debugLog("Missing uid in model method");
      throw new ErrorClass("User ID (uid) is required");
    }

    const options = {
      where: { uid },
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
          required: false,
        },
        {
          model: ModelUser,
          as: "User",
          required: false,
          include: [
            {
              model: ModelSettings,
              as: "Settings",
              required: false,
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      distinct: true,
      logging: (sql) => debugLog("SQL Query", { sql }), // Enhanced SQL logging
    };

    if (status !== "all") {
      options.where.listingStatus = status;
      debugLog("Status filter applied", { status });
    }

    debugLog("Calling coreUtils.Paginated with options", options);
    const result = await coreUtils.Paginated(
      ModelProperty,
      page,
      limit,
      options
    );

    debugLog("Paginated result", {
      dataCount: result.data?.length,
      total: result.total,
      pages: result.pages,
    });

    if (!result.data || result.data.length === 0) {
      debugLog("No properties found in database query");
      throw new ErrorClass(`No properties found for uid: ${uid}`);
    }

    return {
      properties: result.data,
      total: result.total,
      pages: result.pages,
    };
  } catch (e) {
    debugLog("Model method error", { error: e.message });
    throw new ErrorClass(e.message);
  }
};

ModelProperty.GetByStatus = async (status) => {
  try {
    const properties = await ModelProperty.findAll({
      where: { listingStatus: status },
      include: [{ model: ModelSubProperty, as: "SubProperties" }],
    });

    /* UNCOMMENT FOR SETTINGS FILTER
      return properties.filter(p => 
        p.User?.Settings?.status !== false
      );
      */

    return properties;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelProperty.GetHot = async () => {
  try {
    const properties = await ModelProperty.findAll({
      where: {
        status: 1, // Changed from true to 1 to match your DB
        listingStatus: "available",
        hottestCount: { [Op.gte]: 1 },
      },
      order: [["hottestCount", "DESC"]],
      limit: 20,
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
          required: false, // Make optional
        },
        {
          model: ModelUser,
          as: "User",
          required: false, // Make optional for debugging
          include: [
            {
              model: ModelSettings,
              as: "Settings",
              where: { status: { [Op.ne]: false } },
              required: false, // Make optional for debugging
            },
          ],
        },
      ],
      logging: console.log, // Add SQL logging
    });

    if (!properties.length) {
      console.log("Debug - No properties matched filters:", {
        status: 1,
        listingStatus: "available",
        hottestCount: { [Op.gte]: 5 },
      });
      throw new ErrorClass("No hot properties found");
    }

    return {
      properties,
      count: properties.length,
    };
  } catch (e) {
    console.error("GetHot Error:", e);
    throw new ErrorClass(e.message);
  }
};

ModelProperty.GetByStatus = async (status) => {
  try {
    // Validate input status
    const validStatuses = ["available", "sold", "unavailable"];
    if (!validStatuses.includes(status)) {
      throw new ErrorClass(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Single optimized query with all includes
    const properties = await ModelProperty.findAll({
      where: { listingStatus: status },
      order: [["hottestCount", "DESC"]],
      include: [
        {
          model: ModelSubProperty,
          as: "SubProperties",
          required: false,
        },
        {
          model: ModelUser,
          as: "User",
          required: false,
          include: [
            {
              model: ModelSettings,
              as: "Settings",
              where: { status: { [Op.ne]: false } },
              required: false,
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
    });

    if (!properties.length) {
      throw new ErrorClass(`No properties found with status: ${status}`);
    }

    return properties;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};


sequelize.sync();
export default ModelProperty;
