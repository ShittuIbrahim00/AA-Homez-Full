/**
 * Slantapp code and properties {www.slantapp.io}
 */
import Async from "./../core/core.async.js";
import {
  ModelAgent,
  ModelProperty,
  ModelSubProperty,
  ModelTransaction,
} from "../models/index.js";
import { ErrorClass, Utils } from "../core/index.js";
import sequelize from "./../database/index.js";
import { debugLog } from "../models/model.property.js";
import { Op } from "sequelize";
import { propertyImagesUpload } from "../cloudinary/cloudinary.upload.js";
import {
  createAgentNotification,
  createBusinessNotification,
  NotificationPriority,
  NotificationType,
} from "../services/notification.js";
import { calculateReferralReward } from "../core/core.algo.js";

export const Get = Async(async (req, res, next) => {
  try {
    let property;
    if (!!req.params.id) {
      property = await ModelProperty.Get(req.params.id);
    } else {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      property = await ModelProperty.GetAll(page, limit);
    }
    res.json(Utils.PrintRest("API Running - Ok", true, property));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const GetAdmin = Async(async (req, res, next) => {
  try {
    let property;
    console.log("params", req.params.id);
    if (!!req.params.id) {
      property = await ModelProperty.Get(req.params.id);
    } else {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const { uid } = req.user;
      console.log(limit);
      console.log("uid", uid);
      property = await ModelProperty.GetAllAdmin(page, limit, status, uid);
    }
    res.json(Utils.PrintRest("API Running - Ok", true, property));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const GetHot = Async(async (req, res, next) => {
  try {
    let property = await ModelProperty.GetHot();
    res.json(Utils.PrintRest("Hottest Properties", true, property));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const Add = Async(async (req, res, next) => {
  try {
    if (!req.agency || !req.agency.uid) {
      return res
        .status(401)
        .json(Utils.PrintRest("User not authenticated", false, []));
    }

    // First handle image uploads
    await new Promise((resolve, reject) => {
      propertyImagesUpload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Prepare property data with image URLs
    const propertyData = {
      ...req.body,
      images: req.files?.map((file) => file.location) || [], // Array of Cloudinary URLs
    };

    // Create property with images
    const property = await ModelProperty.Add(propertyData, req.agency.uid);

    res.json(Utils.PrintRest("Property created successfully", true, property));
  } catch (e) {
    console.error("Error creating property:", e);
    const status = e.message.includes("file size") ? 413 : 500;
    res.status(status).json(Utils.PrintRest(e.message, false, []));
  }
});

export const makePayment = async (req, res, next) => {
  debugLog("API request received", {
    params: req.params,
    body: req.body,
  });

  try {
    const { pid } = req.params;
    const { sid } = req.params;
    const { aid, amount, soldTo } = req.body;
    const uid = req.agency?.uid;

    if (!uid) {
      debugLog("Missing authentication data", { uid });
      throw new ErrorClass("Authentication data missing", 401);
    }

    // Call the MODEL method to handle the payment transaction
    const result = await ModelProperty.Payment(
      pid,
      aid,
      uid,
      amount,
      sid,
      soldTo
    );
    debugLog("Payment successful", { result });

    // Get additional details for notifications
    const property = await ModelProperty.findByPk(pid, {
      include: [{ model: ModelSubProperty, as: "SubProperties" }],
    });

    const propertyName = property?.title || `Property ${pid}`;
    const subPropertyName = sid ? `Unit ${sid}` : "";

    // NOTIFY AGENT about the successful payment
    if (aid) {
      await createAgentNotification(
        aid,
        "Payment Processed Successfully",
        `Your payment of ₦${amount.toLocaleString()} for ${propertyName}${
          subPropertyName ? ` - ${subPropertyName}` : ""
        } has been processed successfully. Commission will be calculated and paid shortly.`,
        {
          type: NotificationType.COMMISSION,
          priority: NotificationPriority.HIGH,
          propertyId: pid,
          subPropertyId: sid || null,
          propertyName: propertyName,
          amount: amount,
          transactionId: result.transaction?.id || sid,
          soldTo: soldTo,
          timestamp: new Date().toISOString(),
        }
      );
    }

    // NOTIFY BUSINESS about the new payment
    await createBusinessNotification(
      uid,
      "New Property Payment Received",
      `A payment of ₦${amount.toLocaleString()} has been received for ${propertyName}${
        subPropertyName ? ` - ${subPropertyName}` : ""
      }${aid ? ` by agent ${aid}` : ""}.`,
      {
        type: NotificationType.COMMISSION,
        priority: NotificationPriority.HIGH,
        propertyId: pid,
        subPropertyId: sid || null,
        propertyName: propertyName,
        agentId: aid,
        amount: amount,
        transactionId: result.transaction?.tid || sid,
        soldTo: soldTo,
        timestamp: new Date().toISOString(),
      }
    );

    // NOTIFY REFEREES about commission earnings
    if (aid) {
      try {
        const agent = await ModelAgent.findByPk(aid);
        if (agent) {
          // Get the agent who made the sale (could be different from the assigned agent)
          const effectiveAid = aid || property?.aid || null;

          if (effectiveAid) {
            // Calculate referral commissions to notify all upline referrers
            const referralCommissions = await calculateReferralReward(
              effectiveAid,
              amount
            );

            for (const refCommission of referralCommissions) {
              await createAgentNotification(
                refCommission.aid,
                "Referral Commission Earned",
                `You earned ₦${refCommission.amount.toLocaleString()} commission from your referral's property sale (${propertyName}).`,
                {
                  type: NotificationType.COMMISSION,
                  priority: NotificationPriority.MEDIUM,
                  propertyId: pid,
                  subPropertyId: sid || null,
                  propertyName: propertyName,
                  referredAgentId: effectiveAid,
                  referredAgentName: `${agent.firstName} ${agent.lastName}`,
                  commissionAmount: refCommission.amount,
                  saleAmount: amount,
                  level: refCommission.level,
                  timestamp: new Date().toISOString(),
                }
              );
            }

            // First sale celebration notification for direct referrer
            if (agent.referred_by && !agent.referralRewarded) {
              const directReferrer = await ModelAgent.findByPk(
                agent.referred_by
              );
              if (directReferrer) {
                // Check if this is the agent's first successful sale
                const agentCommissions = await ModelTransaction.count({
                  where: {
                    aid: effectiveAid,
                    service: ["sales_commission", "referral_commission"],
                    status: "successful",
                  },
                });

                if (agentCommissions <= 1) {
                  await createAgentNotification(
                    directReferrer.aid,
                    "Referral First Sale Completed!",
                    `Congratulations! Your referral ${agent.firstName} ${
                      agent.lastName
                    } has completed their first property sale worth ₦${amount.toLocaleString()}!`,
                    {
                      type: NotificationType.REFERRAL,
                      priority: NotificationPriority.MEDIUM,
                      referredAgentId: effectiveAid,
                      referredAgentName: `${agent.firstName} ${agent.lastName}`,
                      saleAmount: amount,
                      propertyName: propertyName,
                      timestamp: new Date().toISOString(),
                      isFirstSale: true,
                    }
                  );

                  agent.referralRewarded = true;
                  await agent.save();
                }
              }
            }
          }
        }
      } catch (refError) {
        console.error("Error notifying referees:", refError);
        // Don't fail the main payment process for referee notification errors
      }
    }

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    debugLog("API error", {
      error: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
      body: req.body,
      params: req.params,
    });

    // Notify agent about payment failure (if aid is available)
    if (req.body.aid) {
      await createAgentNotification(
        req.body.aid,
        "Payment Processing Failed",
        `Your payment of ₦${req.body.amount?.toLocaleString()} for property ${
          req.params.pid
        } could not be processed. Error: ${error.message}`,
        {
          type: NotificationType.SYSTEM,
          priority: NotificationPriority.HIGH,
          propertyId: req.params.pid,
          subPropertyId: req.params.sid || null,
          amount: req.body.amount,
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      ).catch((notifyError) => {
        console.error(
          "Failed to send payment failure notification:",
          notifyError
        );
      });
    }

    // Notify business about payment failure
    if (req.agency?.uid) {
      await createBusinessNotification(
        req.agency.uid,
        "Payment Processing Failed",
        `A payment attempt of ₦${req.body.amount?.toLocaleString()} for property ${
          req.params.pid
        } failed. Error: ${error.message}`,
        {
          type: NotificationType.SYSTEM,
          priority: NotificationPriority.HIGH,
          propertyId: req.params.pid,
          subPropertyId: req.params.sid || null,
          agentId: req.body.aid,
          amount: req.body.amount,
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      ).catch((notifyError) => {
        console.error(
          "Failed to send business failure notification:",
          notifyError
        );
      });
    }

    next(error);
  }
};

export const getAgentSoldProperties = async (req, res, next) => {
  try {
    const { aid } = req.params; // Get agent ID from URL params

    // Validate agent ID
    if (!aid || isNaN(aid)) {
      throw new ErrorClass("Valid agent ID is required", 400);
    }

    const properties = await ModelProperty.AgentSoldProperties(aid);

    res.status(200).json({
      status: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      throw new ErrorClass("Property ID is required", 400);
    }

    const result = await ModelProperty.Get(pid);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Property not found or unavailable",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Override filters if needed
    const result = await ModelProperty.GetAll(page, limit);

    // Debug: Log the actual query being executed
    console.log("Query result:", result);

    res.status(200).json({
      success: true,
      data: result.properties || [],
      meta: {
        page,
        limit,
        total: result.total || 0,
        pages: result.pages || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    debugLog("getAllPropertiesAdmin controller entered", {
      query: req.query,
      user: req.agency,
    });

    const { page = 1, limit = 10, status = "all" } = req.query;
    const uid = req.query.uid || req.agency?.uid;

    debugLog("Parameters extracted", { page, limit, status, uid });

    if (!uid) {
      debugLog("Missing uid parameter");
      return res.status(400).json({
        success: false,
        message: "User ID (uid) is required",
      });
    }

    debugLog("Calling ModelProperty.GetAllAdmin");
    const result = await ModelProperty.GetAllAdmin(
      parseInt(page),
      parseInt(limit),
      status,
      parseInt(uid)
    );

    debugLog("GetAllAdmin result", {
      propertiesCount: result.properties?.length,
      total: result.total,
      pages: result.pages,
    });

    if (!result.properties || result.properties.length === 0) {
      debugLog("No properties found");
      return res.status(404).json({
        success: false,
        message: "No properties found for this user",
        uid: uid,
      });
    }

    debugLog("Returning successful response");
    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    debugLog("Controller error", { error: error.message });
    next(error);
  }
};

export const getHotProperties = async (req, res, next) => {
  try {
    // Get hot properties from model
    const { properties, count } = await ModelProperty.GetHot();

    // If no properties found, return 404
    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hot properties found",
        data: [],
      });
    }

    // Return successful response
    res.status(200).json({
      success: true,
      data: properties,
      meta: {
        count,
      },
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

export const getPropertiesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;

    // Input validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status parameter is required",
      });
    }

    const properties = await ModelProperty.GetByStatus(status.toLowerCase());

    return res.status(200).json({
      success: true,
      data: properties,
      meta: {
        count: properties.length,
        status: status.toLowerCase(),
      },
    });
  } catch (error) {
    // Handle specific error cases
    if (error.message.includes("Invalid status")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("No properties found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
    next(error);
  }
};

export const Update = Async(async (req, res, next) => {
  try {
    const uid = req.agency?.uid;
    const propertyId = req.params.id;

    if (!uid) {
      return res
        .status(401)
        .json(Utils.PrintRest("User not authenticated", false, []));
    }

    // First handle image uploads if any files are provided
    await new Promise((resolve, reject) => {
      propertyImagesUpload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Get property details before update for notification
    const oldProperty = await ModelProperty.findByPk(propertyId);
    if (!oldProperty) {
      return res
        .status(404)
        .json(Utils.PrintRest("Property not found", false, []));
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If new images are uploaded, handle them appropriately
    if (req.files && req.files.length > 0) {
      // Option 1: Replace all images with new ones
      updateData.images = req.files.map((file) => file.location);

      // Option 2: Append new images to existing ones (uncomment below if you prefer this)
      // const existingImages = oldProperty.images || [];
      // updateData.images = [...existingImages, ...req.files.map((file) => file.location)];
    }

    // If images field is provided in body but no files uploaded, use the body images
    if (
      req.body.images !== undefined &&
      (!req.files || req.files.length === 0)
    ) {
      // Ensure images is an array
      updateData.images = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    }

    const property = await ModelProperty.Update(updateData, propertyId, uid);

    // Track changes for notification
    const changes = {};
    Object.keys(updateData).forEach((key) => {
      if (JSON.stringify(oldProperty[key]) !== JSON.stringify(property[key])) {
        changes[key] = {
          old: oldProperty[key],
          new: property[key],
        };
      }
    });

    // Notify BUSINESS about property update
    await createBusinessNotification(
      uid,
      "Property Updated",
      `Property ${property.name} (ID: ${propertyId}) has been updated successfully.`,
      {
        type: NotificationType.PROFILE,
        priority: NotificationPriority.MEDIUM,
        propertyId: propertyId,
        propertyName: property.name, // Fixed from property.title to property.name
        action: "update",
        changes: changes,
        timestamp: new Date().toISOString(),
      }
    );

    // If property has an assigned agent, notify them too
    if (property.aid) {
      await createAgentNotification(
        property.aid,
        "Assigned Property Updated",
        `Property ${property.name} that you're assigned to has been updated.`,
        {
          type: NotificationType.PROPERTY,
          priority: NotificationPriority.LOW,
          propertyId: propertyId,
          propertyName: property.name, // Fixed from property.title to property.name
          action: "update",
          businessId: uid,
          timestamp: new Date().toISOString(),
        }
      );
    }

    res.json(Utils.PrintRest("Property updated successfully", true, property));
  } catch (e) {
    console.error("Error updating property:", e);
    const status = e.message.includes("file size")
      ? 413
      : e.message.includes("not found")
      ? 404
      : 500;
    res.status(status).json(Utils.PrintRest(e.message, false, []));
  }
});

export const Delete = Async(async (req, res, next) => {
  try {
    const uid = req.agency?.uid;
    const propertyId = req.params.id;

    // Get property details before deletion for notification
    const property = await ModelProperty.findOne({
      where: { pid: propertyId, uid },
      include: [{ model: ModelAgent, as: "Agent" }],
    });

    if (!property) throw new ErrorClass("Property not found", 404);

    const result = await ModelProperty.destroy({
      where: { pid: propertyId, uid },
    });

    // Notify BUSINESS about property deletion
    await createBusinessNotification(
      uid,
      "Property Deleted",
      `Property ${property.name} (ID: ${propertyId}) has been permanently deleted.`,
      {
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.HIGH,
        propertyId: propertyId,
        propertyName: property.title,
        action: "delete_permanent",
        timestamp: new Date().toISOString(),
      }
    );

    // Notify assigned agent about property deletion
    if (property.aid) {
      await createAgentNotification(
        property.aid,
        "Assigned Property Deleted",
        `Property ${property.name} that you were assigned to has been permanently deleted by the business.`,
        {
          type: NotificationType.PROPERTY,
          priority: NotificationPriority.MEDIUM,
          propertyId: propertyId,
          propertyName: property.title,
          action: "delete_permanent",
          businessId: uid,
          timestamp: new Date().toISOString(),
        }
      );
    }

    res.json(Utils.PrintRest("API Running - Ok", true, result));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

/*
 * SUB-PROPERTY
 * */

export const AddSub = Async(async (req, res, next) => {
  try {
    const uid = req.agency.uid;

    // First handle image uploads
    await new Promise((resolve, reject) => {
      propertyImagesUpload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Prepare property data with image URLs
    const propertyData = {
      ...req.body,
      images: req.files?.map((file) => file.location) || [],
    };

    // Parse array fields from string to array if needed
    const arrayFields = [
      "keyInfo",
      "bathrooms",
      "appliances",
      "interior",
      "otherRooms",
      "landInfo",
      "utilities",
    ];

    arrayFields.forEach((field) => {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          propertyData[field] = propertyData[field]
            .split(",")
            .map((item) => item.trim());
        }
      } else if (propertyData[field] === undefined) {
        // Set default empty array for optional fields that are not provided
        propertyData[field] = [];
      }
    });

    const property = await ModelSubProperty.Add(
      propertyData,
      req.params.pid,
      uid
    );

    res.json(
      Utils.PrintRest("Sub-property added successfully", true, property)
    );
  } catch (e) {
    console.error("Error adding sub-property:", e);
    const status = e.message.includes("file size") ? 413 : 500;
    res.status(status).json(Utils.PrintRest(e.message, false, []));
  }
});

export const GetSub = Async(async (req, res, next) => {
  try {
    if (req.params.id) {
      // Get single sub-property by ID or SID
      const property = await ModelSubProperty.findOne({
        where: {
          [Op.or]: [{ sid: req.params.id }, { id: req.params.id }],
          deletedAt: null,
          status: 1, // Only active records (if status 1 means active)
        },
        include: [{ model: ModelProperty, as: "Property" }],
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: `Sub-property with ID ${req.params.id} not found, deleted, or inactive`,
        });
      }

      res.json(Utils.PrintRest("Sub-property details", true, property));
    } else {
      // Get all active sub-properties
      const properties = await ModelSubProperty.findAll({
        where: {
          deletedAt: null,
          status: 1, // Only active records
          listingStatus: "available", // Only available properties
        },
        include: [{ model: ModelProperty, as: "Property" }],
        order: [["createdAt", "DESC"]], // Newest first
      });

      if (!properties || properties.length === 0) {
        return res.json(
          Utils.PrintRest("No active sub-properties found", true, [])
        );
      }

      res.json(
        Utils.PrintRest("All sub-properties", true, {
          count: properties.length,
          data: properties,
        })
      );
    }
  } catch (e) {
    console.error("Database error:", e);
    res.status(500).json({
      success: false,
      message: "Server error while fetching properties",
      error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
  }
});

export const getSubPropertyById = async (req, res) => {
  const { sid } = req.params;

  try {
    const subProperty = await ModelSubProperty.Get(sid);
    return res.status(200).json({
      status: true,
      message: "Sub-property retrieved successfully",
      data: subProperty,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to fetch sub-property",
      data: null,
    });
  }
};

export const subPropertyController = {
  getAllSubProperties: async (req, res, next) => {
    try {
      const subProperties = await ModelSubProperty.getAllSubProperties(
        req.query
      );
      res.json({
        success: true,
        data: subProperties,
        message: "Sub-properties retrieved successfully",
      });
    } catch (error) {
      next(new ErrorClass(error.message, error.status || 500));
    }
  },
};

export const UpdateSub = Async(async (req, res, next) => {
  try {
    const uid = req.agency.uid;
    const subPropertyId = req.params.sid;

    const property = await ModelSubProperty.findOne({
      where: { sid: subPropertyId, uid, deletedAt: null },
      include: [
        {
          model: ModelProperty,
          as: "Property",
          include: [{ model: ModelAgent, as: "Agent" }],
        },
      ],
    });

    if (!property) throw new ErrorClass("Property not found", 404);

    // First handle image uploads
    await new Promise((resolve, reject) => {
      propertyImagesUpload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Prepare property data with image URLs
    const propertyData = { ...req.body };

    // Handle images appropriately
    if (req.files && req.files.length > 0) {
      // Option 1: Replace all images with new ones
      propertyData.images = req.files.map((file) => file.location);

      // Option 2: Append to existing images (uncomment if preferred)
      // const existingImages = property.images || [];
      // propertyData.images = [...existingImages, ...req.files.map((file) => file.location)];
    } else if (req.body.images !== undefined) {
      // If images array is provided in body but no files uploaded
      if (typeof req.body.images === "string") {
        // Handle single image string
        propertyData.images = [req.body.images];
      } else if (Array.isArray(req.body.images)) {
        propertyData.images = req.body.images;
      }
    }
    // If images field is not provided, it won't be updated

    // Parse array fields from string to array if needed
    const arrayFields = [
      "keyInfo",
      "bathrooms",
      "appliances",
      "interior",
      "otherRooms",
      "landInfo",
      "utilities",
    ];

    arrayFields.forEach((field) => {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          propertyData[field] = propertyData[field]
            .split(",")
            .map((item) => item.trim());
        }
      }
    });

    const updated = await ModelSubProperty.Update(
      propertyData,
      subPropertyId,
      uid
    );

    // Notify BUSINESS about sub-property update
    await createBusinessNotification(
      uid,
      "Sub-Property Updated",
      `Unit ${updated.unitNumber || subPropertyId} of property ${
        property?.Property?.name || property?.name
      } has been updated.`,
      {
        type: NotificationType.PROPERTY,
        priority: NotificationPriority.MEDIUM,
        propertyId: property.pid,
        subPropertyId: subPropertyId,
        propertyName: property?.Property?.name || property?.name,
        unitNumber: updated.unitNumber || subPropertyId,
        action: "update",
        imagesUpdated: req.files?.length > 0,
        timestamp: new Date().toISOString(),
      }
    );

    // Notify assigned agent about sub-property update
    if (property?.Property?.aid) {
      await createAgentNotification(
        property.Property.aid,
        "Assigned Unit Updated",
        `Unit ${updated.unitNumber || subPropertyId} of property ${
          property.Property.name
        } has been updated.`,
        {
          type: NotificationType.PROPERTY,
          priority: NotificationPriority.LOW,
          propertyId: property.pid,
          subPropertyId: subPropertyId,
          propertyName: property.Property.name,
          unitNumber: updated.unitNumber || subPropertyId,
          action: "update",
          businessId: uid,
          timestamp: new Date().toISOString(),
        }
      );
    }

    res.json(
      Utils.PrintRest("Sub-property updated successfully", true, updated)
    );
  } catch (e) {
    console.error("Error updating sub-property:", e);
    const status = e.message.includes("not found") ? 404 : 500;
    res.status(status).json(Utils.PrintRest(e.message, false, []));
  }
});

export const DeleteSub = Async(async (req, res, next) => {
  try {
    const uid = req.agency.uid;
    const subPropertyId = req.params.sid;

    const property = await ModelSubProperty.findOne({
      where: { sid: subPropertyId, uid },
      include: [
        {
          model: ModelProperty,
          as: "Property",
          include: [{ model: ModelAgent, as: "Agent" }],
        },
      ],
    });

    if (!property) throw new ErrorClass("Property not found", 404);

    await property.destroy(); // Soft delete

    // Notify BUSINESS about sub-property soft deletion
    await createBusinessNotification(
      uid,
      "Sub-Property Archived",
      `Unit ${property.unitNumber || subPropertyId} of property ${
        property?.name
      } has been archived.`,
      {
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        propertyId: property.pid,
        subPropertyId: subPropertyId,
        propertyName: property?.name,
        unitNumber: property.unitNumber || subPropertyId,
        action: "delete_soft",
        timestamp: new Date().toISOString(),
      }
    );

    // Notify assigned agent about sub-property deletion
    if (property?.aid) {
      await createAgentNotification(
        property?.aid,
        "Assigned Unit Archived",
        `Unit ${property.unitNumber || subPropertyId} of property ${
          property?.name
        } has been archived.`,
        {
          type: NotificationType.PROPERTY,
          priority: NotificationPriority.MEDIUM,
          propertyId: property.pid,
          subPropertyId: subPropertyId,
          propertyName: property?.name,
          unitNumber: property.unitNumber || subPropertyId,
          action: "delete_soft",
          businessId: uid,
          timestamp: new Date().toISOString(),
        }
      );
    }

    res.json(
      Utils.PrintRest("Sub-property soft-deleted", true, {
        sid: property.sid,
        deletedAt: new Date(),
      })
    );
  } catch (e) {
    throw new ErrorClass(e.message, e.status || 500);
  }
});

export const RestoreSub = Async(async (req, res, next) => {
  try {
    const uid = req.agency.uid;
    const subPropertyId = req.params.sid;

    const property = await ModelSubProperty.findOne({
      where: { sid: subPropertyId, uid },
      paranoid: false,
      include: [
        {
          model: ModelProperty,
          as: "Property",
          include: [{ model: ModelAgent, as: "Agent" }],
        },
      ],
    });

    if (!property) throw new ErrorClass("Property not found", 404);
    if (!property.deletedAt)
      throw new ErrorClass("Property is not deleted", 400);

    await property.restore();

    // Notify BUSINESS about sub-property restoration
    await createBusinessNotification(
      uid,
      "Sub-Property Restored",
      `Unit ${property.unitNumber || subPropertyId} of property ${
        property?.name
      } has been restored from archive.`,
      {
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        propertyId: property.pid,
        subPropertyId: subPropertyId,
        propertyName: property?.name,
        unitNumber: property.unitNumber || subPropertyId,
        action: "restore",
        timestamp: new Date().toISOString(),
      }
    );

    // Notify assigned agent about sub-property restoration
    if (property?.aid) {
      await createAgentNotification(
        property?.aid,
        "Assigned Unit Restored",
        `Unit ${property.unitNumber || subPropertyId} of property ${
          property?.name
        }" has been restored and is now active.`,
        {
          type: NotificationType.PROPERTY,
          priority: NotificationPriority.MEDIUM,
          propertyId: property.pid,
          subPropertyId: subPropertyId,
          propertyName: property?.name,
          unitNumber: property.unitNumber || subPropertyId,
          action: "restore",
          businessId: uid,
          timestamp: new Date().toISOString(),
        }
      );
    }

    res.json(
      Utils.PrintRest("Sub-property restored", true, {
        sid: property.sid,
        restoredAt: new Date(),
      })
    );
  } catch (e) {
    throw new ErrorClass(e.message, e.status || 500);
  }
});

export const getBusinessSalesSummary = async (req, res) => {
  try {
    const { uid } = req.agency;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Business ID (uid) is required.",
      });
    }
    
    const results = await ModelTransaction.findAll({
      attributes: [
        [
          ModelTransaction.sequelize.fn(
            "SUM",
            ModelTransaction.sequelize.col("amount")
          ),
          "totalAmount",
        ],
        "role",
      ],
      where: {
        uid,
        role: { [Op.in]: ["property", "subProperty"] },
        status: "successful",
        type: "credit",
      },
      group: ["role"],
      raw: true,
    });

    const totals = {
      propertySales: 0,
      subPropertySales: 0,
      totalSales: 0,
    };
    
    results.forEach((r) => {
      if (r.role === "property")
        totals.propertySales = parseFloat(r.totalAmount || 0);
      if (r.role === "subProperty")
        totals.subPropertySales = parseFloat(r.totalAmount || 0);
    });

    totals.totalSales = totals.propertySales + totals.subPropertySales;

    return res.status(200).json({
      success: true,
      data: totals,
    });
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

