import sequelize from "./../database/index.js";
import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import Joi from "joi";
import { ErrorClass } from "../core/index.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import { Op } from "sequelize";
import ModelProperty from "./model.property.js";
import ModelTransaction from "./model.transaction.js";
import emailService from "../services/emailService.js";
import { encrypt, decrypt } from "../core/encryption.js";
import ModelSubProperty from "./model.sub.property.js";

const saltRounds = 12;
const tableName = "agents";

class ModelAgent extends Model {}

ModelAgent.init(
  {
    referralRewarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "referralRewarded",
    },
    referral_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "referral_count",
    },
    aid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    fullName: DataTypes.STRING(100),
    dob: DataTypes.DATEONLY, 
    gender: DataTypes.STRING(20),
    address: DataTypes.TEXT,
    phone: DataTypes.STRING(20),
    imgUrl: DataTypes.STRING(255),
    password: DataTypes.STRING(255),
    sales_earnings: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0.0,
      field: "sales_earnings",
    },
    referral_earnings: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0.0,
      field: "referral_earnings",
    },
    total_earnings: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0.0,
      field: "total_earnings",
    },
    sales_portfolio: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0.0,
      field: "sales_portfolio",
    },
    rank: {
      type: DataTypes.ENUM("BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"),
      defaultValue: "BRONZE",
      field: "rank",
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      field: "accountNumber",
    },
    encrypted_nin: {
      type: DataTypes.BLOB,
      field: "encrypted_nin",
    },
    encrypted_bank_account: {
      type: DataTypes.BLOB,
      field: "encrypted_bank_account",
    },
    accountName: DataTypes.STRING(100),
    bankName: DataTypes.STRING(100),
    // bankCode: DataTypes.STRING(50),
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "verified",
    },
    status: DataTypes.INTEGER,
    idType: {
      type: DataTypes.ENUM("NIN", "DRIVER_LICENSE", "PASSPORT"),
      field: "idType",
    },
    idNumber: DataTypes.STRING(50),
    referralCode: DataTypes.STRING(50),
    referred_by: DataTypes.INTEGER,
    verification_token_revoked_at: {
      type: DataTypes.DATE,
      field: "verification_token_revoked_at",
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "failed_login_attempts",
    },
    last_failed_login: {
      type: DataTypes.DATE,
      field: "last_failed_login",
    },
    // otp: DataTypes.STRING(255),
    // token: DataTypes.STRING(255),
    nin: DataTypes.STRING(255),
    ninVerified: {
      type: DataTypes.BOOLEAN,
      field: "ninVerified",
    },
    termStatus: {
      type: DataTypes.BOOLEAN,
      field: "termStatus",
    },
    verification_date: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING(255),
    passwordResetExpires: DataTypes.DATE,
    passwordChangedAt: DataTypes.DATE,
    verified_first_name: DataTypes.STRING(100),
    verified_last_name: DataTypes.STRING(100),
    verified_photo: DataTypes.TEXT,
    verified_dob: DataTypes.DATEONLY,
    verified_gender: {
      type: DataTypes.ENUM("M", "F", "OTHER"),
      field: "verified_gender",
    },
  },
  {
    sequelize,
    tableName,
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeSave: (agent) => {
        const portfolio = parseFloat(agent.sales_portfolio);
        if (portfolio >= 10000000000) agent.rank = "DIAMOND";
        else if (portfolio >= 5000000000) agent.rank = "PLATINUM";
        else if (portfolio >= 2000000000) agent.rank = "GOLD";
        else if (portfolio >= 1000000000) agent.rank = "SILVER";
        else if (portfolio >= 250000000) agent.rank = "BRONZE";

        if (!agent.referralCode) {
          agent.referralCode =
            "REF" + Math.random().toString(36).substr(2, 8).toUpperCase();
        }
      },
    },
  }
);

function maskNIN(nin) {
  return nin ? nin.replace(/.(?=.{4})/g, "*") : null;
}

function maskAccount(acc) {
  return acc ? acc.replace(/.(?=.{4})/g, "*") : null;
}

ModelAgent.Register = async (data) => {
  const phoneRegex = /^0[789][01]\d{8}$/;
  // const nubanRegex = /^\d{10}$/;
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required().trim(),
    password: Joi.string()
      .min(8)
      .max(32)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required(),
    phone: Joi.string().pattern(phoneRegex).required(),
    address: Joi.string().required(),
    dob: Joi.date().iso().less("now").required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    idType: Joi.string().valid("NIN", "DRIVER_LICENSE", "PASSPORT").required(),
    idNumber: Joi.string().required().trim(),
    // bankName: Joi.string().optional(),
    // accountNumber: Joi.string().pattern(nubanRegex).optional(),
    // accountName: Joi.string().optional(),
    termStatus: Joi.boolean().valid(true).required(),
    referralCode: Joi.string().optional().uppercase().trim(),
  });
  const { error } = schema.validate(data);
  if (error) throw new ErrorClass("Invalid registration data", 400);

  for (const key in data) {
    if (typeof data[key] === "string") {
      data[key] = data[key].replace(/[<>"'`;]/g, "");
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  try {
    let referredBy = null;
    if (data.referralCode) {
      const referringAgent = await ModelAgent.findOne({
        where: { referralCode: data.referralCode },
        attributes: ["aid"],
        paranoid: false,
      });
      if (!referringAgent) {
        throw new ErrorClass("Invalid referral code provided", 400);
      }
      referredBy = referringAgent.aid;
    }

    // Encrypt NIN and bank account
    let encryptedNIN = null;
    let encryptedBankAccount = null;
    if (data.idType === "NIN" && data.idNumber) {
      encryptedNIN = encrypt(data.idNumber);
    }
    if (data.accountNumber) {
      encryptedBankAccount = encrypt(data.accountNumber);
    }

    const agentData = {
      ...data,
      password: hashedPassword,
      referred_by: referredBy,
      encrypted_nin: encryptedNIN,
      encrypted_bank_account: encryptedBankAccount,
    };
    delete agentData.referralCode;
    delete agentData.idNumber;

    const agent = await ModelAgent.create(agentData);

    const jti = crypto.randomBytes(16).toString("hex");
    const token = jwt.sign(
      { aid: agent.aid, aud: "email_verification", iss: "aa-homez", jti },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // No PII in link
    const verificationLink = `https://aa-homez.onrender.com/api/v1/agent/verify-email/${agent.aid}/${token}`;

    try {
      await emailService.sendVerificationEmail(
        agent.email,
        agent.fullName,
        verificationLink
      );
    } catch (error) {
      // Log but do not fail registration
      console.error("Email sending failed", error);
    }

    return {
      status: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: {
        id: agent.aid,
        fullName: agent.fullName,
        referralCode: agent.referralCode,
        // Do not expose verificationLink or referral relationships
      },
    };
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const duplicateField = err.errors[0]?.path || "unknown";
      throw new ErrorClass(`${duplicateField} already exists`, 400);
    }
    throw err;
  }
};


ModelAgent.Authenticate = async (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
  });
  const { error } = schema.validate(data);
  if (error) throw new ErrorClass("Invalid credentials", 401);

  const agent = await ModelAgent.findOne({ where: { email: data.email } });
  if (!agent) throw new ErrorClass("Invalid credentials", 401);

  // Account lockout logic
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MINUTES = 30;
  if (
    agent.failed_login_attempts >= MAX_ATTEMPTS &&
    agent.last_failed_login &&
    Date.now() - new Date(agent.last_failed_login).getTime() <
      LOCKOUT_MINUTES * 60 * 1000
  ) {
    throw new ErrorClass(
      "Account temporarily locked due to failed attempts. Try again later.",
      403
    );
  }

  const isMatch = await bcrypt.compare(data.password, agent.password);
  if (!isMatch) {
    // Increment failed attempts
    await agent.update({
      failed_login_attempts: (agent.failed_login_attempts || 0) + 1,
      last_failed_login: new Date(),
    });
    throw new ErrorClass("Invalid credentials", 401);
  }

  // Reset failed attempts on success
  if (agent.failed_login_attempts > 0) {
    await agent.update({ failed_login_attempts: 0, last_failed_login: null });
  }

  // Allow login if email is verified (NIN can be verified later)
  if (!agent.verified) {
    throw new ErrorClass("Account not verified. Please check your email.", 403);
  }

  // JWT for session (no PII in payload except aid)
  const token = jwt.sign(
    {
      aid: agent.aid,
      role: "agent",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Mask sensitive data in response
  const user = agent.get({ plain: true });
  delete user.password;
  if (user.encrypted_nin)
    user.nin = maskNIN(decrypt(user.encrypted_nin.toString()));
  if (user.encrypted_bank_account)
    user.accountNumber = maskAccount(
      decrypt(user.encrypted_bank_account.toString())
    );
  delete user.encrypted_nin;
  delete user.encrypted_bank_account;

  return {
    user: {
      aid: user.aid,
      fullName: user.fullName,
      referralCode: user.referralCode,
      verified: user.verified,
      ninVerified: user.ninVerified
    },
    token,
  };
};

ModelAgent.VerifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { aid, jti } = decoded;
    const agent = await ModelAgent.findOne({ where: { aid } });
    if (!agent) throw new ErrorClass("Invalid verification link", 400);
    if (agent.verified) throw new ErrorClass("Email already verified", 400);

    if (agent.verification_token_revoked_at) {
      throw new ErrorClass("Verification link already used or revoked", 400);
    }
    
    agent.verified = true;
    agent.verification_token_revoked_at = new Date();
    await agent.save();
    // Log event (audit)
    console.log(
      `Agent ${aid} email verified at ${agent.verification_token_revoked_at}`
    );

    if (
      agent.verified &&
      agent.ninVerified &&
      agent.referred_by &&
      !agent.referralRewarded
    ) {
      const referrer = await ModelAgent.findByPk(agent.referred_by);
      if (referrer) {
        referrer.referral_count = (referrer.referral_count || 0) + 1;
        await referrer.save();
        agent.referralRewarded = true;
        await agent.save();
      }
    }
    return {
      message: "Email verified successfully",
      agentId: agent.aid,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ErrorClass("Verification link expired", 400);
    }
    throw new ErrorClass("Invalid or expired verification token", 400);
  }
};

const dojahApi = axios.create({
  baseURL: "https://api.dojah.io/api/v1",
  headers: {
    AppId: process.env.DOJAH_APP_ID,
    Authorization: process.env.DOJAH_APP_SECRET,
  },
  timeout: 30000, // hard cutoff
});

ModelAgent.VerifyNIN = async ({ aid, nin }) => {
  if (!aid || !nin) throw new ErrorClass("Agent ID and NIN are required", 400);
  if (!/^\d{11}$/.test(nin)) throw new ErrorClass("NIN must be 11 digits", 400);

  const agent = await ModelAgent.findByPk(aid);
  if (!agent) throw new ErrorClass("Agent not found", 404);
  if (agent.ninVerified) throw new ErrorClass("NIN already verified", 409);

  if (agent.encrypted_nin) {
    const registeredNIN = decrypt(agent.encrypted_nin.toString());
    if (registeredNIN !== nin) {
      throw new ErrorClass(
        "Provided NIN does not match the one used during registration",
        400
      );
    }
  }

  try {
    if (agent.ninVerifiedCache && agent.ninVerifiedCache === nin) {
      return {
        status: true,
        data: {
          message: "NIN already verified (cached)",
          agentId: agent.aid,
          verificationStatus: "verified",
          profile: {
            first_name: agent.verified_first_name,
            last_name: agent.verified_last_name,
            date_of_birth: agent.verified_dob,
            gender: agent.verified_gender,
          },
        },
      };
    }

    const response = await dojahApi.get("/kyc/nin", {
      params: { nin },
    });

    const requestId = response.headers["x-request-id"]; 
    if (!response.data?.entity) {
      throw new ErrorClass("Invalid verification response", 400);
    }

    const profile = response.data.entity;

    const agentNames = agent.fullName.toLowerCase().split(/\s+/);
    const ninFirst = profile.first_name?.toLowerCase();
    const ninLast = profile.last_name?.toLowerCase();
    if (!ninFirst || !ninLast) {
      throw new ErrorClass("Incomplete name data from NIN", 400);
    }
    if (!agentNames.includes(ninFirst) || !agentNames.includes(ninLast)) {
      throw new ErrorClass("NIN details don't match agent information", 400);
    }

    let gender = null;
    if (profile.gender) {
      const g = profile.gender.toLowerCase();
      gender = g.startsWith("m") ? "M" : g.startsWith("f") ? "F" : "OTHER";
    }

    const encryptedNIN = encrypt(nin);
    const updateData = {
      encrypted_nin: encryptedNIN,
      ninVerified: true,
      verification_date: new Date(),
      verified_first_name: profile.first_name,
      verified_last_name: profile.last_name,
      verified_dob: profile.date_of_birth,
      verified_gender: gender,
    };

    if (profile.phone_number && profile.phone_number !== agent.phone) {
      updateData.verified_phone = profile.phone_number;
    }

    await agent.update(updateData);

    if (agent.verified && !agent.referralRewarded && agent.referred_by) {
      const referrer = await ModelAgent.findByPk(agent.referred_by);
      if (referrer) {
        referrer.referral_count = (referrer.referral_count || 0) + 1;
        await referrer.save();
        agent.referralRewarded = true;
        await agent.save();
      }
    }

    return {
      status: true,
      data: {
        message: "NIN verified successfully",
        agentId: agent.aid,
        verificationStatus: "verified",
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth,
          gender,
        },
      },
    };
  } catch (error) {
    if (error.response) {
      throw new ErrorClass(
        error.response.data?.message || "NIN verification service error",
        error.response.status || 500
      );
    }
    if (error.code === "ECONNABORTED") {
      console.warn(
        `Dojah request for NIN ${nin} timed out, may still be billed`
      );
    }
    throw new ErrorClass(
      error.message || "NIN verification failed",
      error.statusCode || 500
    );
  }
};

ModelAgent.resendVerificationToken = async (aid) => {
  const agent = await ModelAgent.findByPk(aid);
  if (!agent) throw new ErrorClass("Agent not found", 404);
  if (agent.verified) throw new ErrorClass("Account already verified", 400);

  agent.verification_token_revoked_at = new Date();
  await agent.save();
  const jti = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign(
    { aid: agent.aid, aud: "email_verification", iss: "aa-homez", jti },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const verificationLink = `https://aa-homez.onrender.com/api/v1/agent/verify-email/${agent.aid}/${token}`;
  try {
    await emailService.sendVerificationEmail(
      agent.email,
      agent.fullName,
      verificationLink
    );
  } catch (error) {
    console.error("Resend verification email failed", error);
  }
  return { status: true, message: "Verification email resent" };
};

ModelAgent.changePassword = async (aid, currentPassword, newPassword) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase, lowercase, number, and special character",
      }),
  });

  const { error } = schema.validate({ currentPassword, newPassword });
  if (error) throw new ErrorClass(error.details[0].message, 400);

  const agent = await ModelAgent.findByPk(aid);
  if (!agent) throw new ErrorClass("Agent not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, agent.password);
  if (!isMatch) throw new ErrorClass("Current password is incorrect", 401);

  const isSameAsCurrent = await bcrypt.compare(newPassword, agent.password);
  if (isSameAsCurrent) {
    throw new ErrorClass(
      "New password must be different from current password",
      400
    );
  }

  // Check against last 3 passwords (if you implement password history)
  // const isRecentPassword = await checkPasswordHistory(aid, newPassword);
  // if (isRecentPassword) throw new ErrorClass("Cannot reuse recent passwords", 400);

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await agent.update({
    password: hashedPassword,
    passwordChangedAt: new Date(),
  });

  return { message: "Password changed successfully" };
};

ModelAgent.initiatePasswordReset = async (email) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate({ email });
  if (error) throw new ErrorClass(error.details[0].message, 400);

  const agent = await ModelAgent.findOne({ where: { email } });
  if (!agent) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, saltRounds);

  await agent.update({
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000), 
  });

  const resetLink = `https://aa-homez.onrender.com/api/v1/agent/reset-password?token=${resetToken}&aid=${agent.aid}`;

  console.log(`Password reset link for ${email}: ${resetLink}`);

  return { success: true };
};

ModelAgent.completePasswordReset = async (token, aid, newPassword) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    aid: Joi.number().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required(),
  });

  const { error } = schema.validate({ token, aid, newPassword });
  if (error) throw new ErrorClass(error.details[0].message, 400);

  const agent = await ModelAgent.findOne({
    where: {
      aid,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });

  if (!agent || !agent.passwordResetToken) {
    throw new ErrorClass("Invalid or expired token", 400);
  }

  const isValidToken = await bcrypt.compare(token, agent.passwordResetToken);
  if (!isValidToken) {
    throw new ErrorClass("Invalid or expired token", 400);
  }

  const isSameAsCurrent = await bcrypt.compare(newPassword, agent.password);
  if (isSameAsCurrent) {
    throw new ErrorClass(
      "New password must be different from current password",
      400
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await agent.update({
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: new Date(),
  });

  return { message: "Password reset successfully" };
};

ModelAgent.updateProfile = async (aid, updateData) => {
  const phoneRegex = /^0[789][01]\d{8}$/;
  const nubanRegex = /^\d{10}$/;
  const schema = Joi.object({
    phone: Joi.string().pattern(phoneRegex).optional(),
    address: Joi.string().optional(),
    bankName: Joi.string().optional(),
    accountNumber: Joi.string().pattern(nubanRegex).optional(),
    accountName: Joi.string().optional(),
    imgUrl: Joi.string().uri().optional(),
  }).min(1); // Require at least one field to update

  const { error } = schema.validate(updateData);
  if (error) throw new ErrorClass(error.details[0].message, 400);

  const agent = await ModelAgent.findByPk(aid);
  if (!agent) throw new ErrorClass("Agent not found", 404);

  const allowedFields = [
    "phone",
    "address",
    "bankName",
    "accountNumber",
    "accountName",
    "imgUrl",
  ];

  const updates = {};
  for (const field in updateData) {
    if (allowedFields.includes(field)) {
      updates[field] = updateData[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ErrorClass("No valid fields provided for update", 400);
  }

  await agent.update(updates);

  return {
    status: true,
    message: "Profile updated successfully",
    user: {
      aid: agent.aid,
      fullName: agent.fullName,
      phone: agent.phone,
      address: agent.address,
      bankName: agent.bankName,
      accountNumber: agent.accountNumber,
      accountName: agent.accountName,
      imgUrl: agent.imgUrl,
    },
  };
};

ModelAgent.prototype.getDashboard = async function () {
  const agent = this;

  const agentData = agent.get({ plain: true });
  delete agentData.password;
  delete agentData.encrypted_nin;
  delete agentData.encrypted_bank_account;
  delete agentData.idNumber;
  delete agentData.failed_login_attempts;
  delete agentData.last_failed_login;
  delete agentData.otp;
  delete agentData.token;
  delete agentData.nin;

  // Get properties sold with proper association
  const propertiesSold = await ModelProperty.findAll({
    where: {
      aid: agent.aid,
      listingStatus: "sold",
    },
    attributes: ["pid", "name", "location", "price", "images", "createdAt"],
    include: [
      {
        model: ModelTransaction,
        as: "Transactions",
        where: {
          status: "successful",
          type: "credit",
        },
        attributes: ["amount", "createdAt"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  const subPropertiesSold = await ModelSubProperty.findAll({
    where: {
      aid: agent.aid,
      listingStatus: "sold",
    },
    attributes: ["sid", "name", "location", "price", "images", "createdAt"],
    // include: [
    //   {
    //     model: ModelTransaction,
    //     as: "Transactions",
    //     where: {
    //       status: "successful",
    //       type: "credit",
    //     },
    //     attributes: ["amount", "createdAt"],
    //     required: false,
    //   },
    // ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  const commissions = await ModelTransaction.findAll({
    where: {
      aid: agent.aid,
      status: "successful",
      [Op.or]: [{ service: "sale" }, { service: "referral" }],
    },
    attributes: ["tid", "amount", "service", "createdAt", "ref"],
    order: [["createdAt", "DESC"]],
    limit: 10,
  });

  const salesEarnings =
    (await ModelTransaction.sum("amount", {
      where: {
        aid: agent.aid,
        service: "sale",
        status: "successful",
        type: "credit",
      },
    })) || 0;

  const referralEarnings =
    (await ModelTransaction.sum("amount", {
      where: {
        aid: agent.aid,
        service: "referral",
        status: "successful",
        type: "credit",
      },
    })) || 0;

  // Get referral network using correct association
  const referralNetwork = await ModelAgent.findAll({
    where: {
      referredBy: agent.aid,
    },
    attributes: ["aid", "fullName", "email", "imgUrl", "createdAt"],
  });

  return {
    status: true,
    data: {
      agent: agentData,
      propertiesSold: propertiesSold.map((prop) => ({
        pid: prop.pid,
        name: prop.name,
        location: prop.location,
        price: prop.price,
        images: prop.images,
        saleDate: prop.createdAt,
        transactions: prop.Transactions,
      })),
      subPropertiesSold: subPropertiesSold.map((prop) => ({
        pid: prop.pid,
        name: prop.name,
        location: prop.location,
        price: prop.price,
        images: prop.images,
        saleDate: prop.createdAt,
        // transactions: prop.Transactions,
      })),
      commissions: {
        history: commissions,
        totals: {
          sales: salesEarnings,
          referral: referralEarnings,
          overall: salesEarnings + referralEarnings,
        },
      },
      referralNetwork,
    },
  };
};

ModelAgent.searchAffiliates = async function (searchTerm) {
  return this.findAll({
    where: {
      [Op.or]: [
        { fullName: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
        { phone: { [Op.like]: `%${searchTerm}%` } },
        { referralCode: { [Op.like]: `%${searchTerm}%` } },
      ],
      verified: true,
    },
    attributes: [
      "aid",
      "fullName",
      "email",
      "phone",
      "imgUrl",
      "referralCode",
      "createdAt",
    ],
    include: [
      {
        model: ModelProperty,
        as: "Property",
        where: { listingStatus: "sold" },
        attributes: ["pid", "location", "price", "images", "createdAt"],
        required: false,
        limit: 30,
        include: [
          {
            model: ModelTransaction,
            as: "Transactions",
            attributes: ["amount"],
            where: {
              status: "successful",
              type: "credit",
            },
            required: false,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

ModelAgent.getAllAffiliates = async function () {
  try {
    return await this.findAll({
      where: { verified: true },
      attributes: [
        "aid", "email", "phone", "fullName", "imgUrl", "referralCode", 
        "referral_count", "sales_earnings", "referral_earnings", 
        "total_earnings", "sales_portfolio", "rank", "accountNumber", 
        "accountName", "bankName", "ninVerified", "createdAt"
      ],
      include: [
        // Properties sold by this affiliate (excluding those that have subproperties with their own aid)
        {
          model: ModelProperty,
          as: "Property",
          where: { listingStatus: "sold" },
          attributes: ["pid", "name", "location", "price", "images", "createdAt", "soldTo"],
          required: false,
          // include: [
          //   {
          //     model: ModelSubProperty,
          //     as: "SubProperties",
          //     where: { 
          //       listingStatus: "sold",
          //       // Exclude subproperties that have their own aid to avoid duplication
          //       aid: null 
          //     },
          //     attributes: ["sid", "location", "price", "images", "createdAt", "soldTo"],
          //     required: false,
          //   }
          // ]
        },
        // Independent subproperties sold by this affiliate (those with direct aid)
        {
          model: ModelSubProperty,
          as: "SubProperties",
          where: { 
            listingStatus: "sold",
            // Only include subproperties that have direct aid association
            aid: { [Sequelize.Op.ne]: null }
          },
          attributes: ["sid", "name", "location", "price", "images", "createdAt", "soldTo"],
          required: false,
        }
      ],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error('Error in getAllAffiliates:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};

// ModelAgent.getAllAffiliates = async function () {
//   return this.findAll({
//     where: { verified: true },
//     attributes: ["aid", "email", "phone", "fullName", "imgUrl", "referralCode", "referral_count", "sales_earnings", "referral_earnings", "total_earnings", "sales_portfolio", "rank", "accountNumber", "accountName", "bankName", "ninVerified",  "createdAt"],
//     include: [
//       {
//         model: ModelProperty,
//         as: "Property",
//         where: { listingStatus: "sold" },
//         attributes: ["pid", "location", "price", "images", "createdAt", "soldTo"],
//         required: false,
//       },
//       {
//         model: ModelSubProperty,
//         as: "SubProperties",
//         where: { listingStatus: "sold" },
//         attributes: ["pid", "location", "price", "images", "createdAt", "soldTo"],
//         required: false,
//       },
//     ],
//     order: [["createdAt", "DESC"]],
    
//   });
  
// };

ModelAgent.getFullProfile = async function (aid) {
  const agent = await ModelAgent.findByPk(aid, {
    attributes: { exclude: ["password", "encrypted_nin"] },
  });
  if (!agent) throw new ErrorClass("Agent not found", 404);

  // Referral info
  let referrer = null;
  if (agent.referred_by) {
    referrer = await ModelAgent.findByPk(agent.referred_by, {
      attributes: ["aid", "fullName", "email"],
    });
  }

  // Referral count and earnings from DB
  const referralCount = agent.referral_count || 0;
  const referralEarnings = parseFloat(agent.referral_earnings) || 0;

  // Portfolio and sales earnings from DB
  const salesPortfolio = parseFloat(agent.sales_portfolio) || 0;
  const salesEarnings = parseFloat(agent.sales_earnings) || 0;
  const totalEarnings =
    parseFloat(agent.total_earnings) || salesEarnings + referralEarnings;

  return {
    agent: agent.get({ plain: true }),
    referral: {
      referrer,
      referralCount,
      referralEarnings,
    },
    earnings: {
      salesPortfolio,
      salesEarnings,
      total: totalEarnings,
    },
  };
};

ModelAgent.GetAgentsByBusiness = async (businessUid) => {
  try {
    const agents = await ModelAgent.findAll({
      include: [
        {
          model: ModelProperty,
          as: "Property", // Assuming you have this association
          where: { uid: businessUid },
          attributes: [], // We don't need property data, just for filtering
        },
      ],
      attributes: ["aid", "email", "fullName", "phone"],
    });
    return agents;
  } catch (error) {
    console.error("Error fetching agents by business:", error);
    return [];
  }
};

export default ModelAgent;
