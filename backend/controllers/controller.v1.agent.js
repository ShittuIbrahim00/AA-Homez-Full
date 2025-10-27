// controllers/controller.v1.agent.js
import Async from "./../core/core.async.js";
import { ModelAgent, ModelNotification } from "../models/index.js";
import { ErrorClass } from "../core/index.js";
import { uploadProfileImage } from "../cloudinary/cloudinary.upload.js";
import {
  createAgentNotification,
  NotificationPriority,
  NotificationType,
} from "../services/notification.js";
import { Op, Sequelize } from "sequelize";

// Registration
export const registerAgent = (req, res, next) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return next(new ErrorClass(err.message || "Image upload failed", 400));
    }
    try {
      const sanitizedData = {};
      for (const [key, value] of Object.entries(req.body)) {
        sanitizedData[key] =
          typeof value === "string"
            ? value.replace(/[<>\"'`;]/g, "").trim()
            : value;
      }

      if (req.file && req.file.location) {
        sanitizedData.imgUrl = req.file.location;
      }

      const agent = await ModelAgent.Register(sanitizedData);

      // Notification for agent
      await createAgentNotification(
        agent.data.aid,
        "Welcome to Our Platform!",
        "Your account has been created successfully. Please verify your email to get started.",
        {
          type: NotificationType.SYSTEM,
          priority: NotificationPriority.HIGH,
        }
      );

      // Notification for business (if business ID is available)
      if (agent.data.businessId) {
        await createBusinessNotification(
          agent.data.businessId,
          "New Agent Registered",
          `Agent ${agent.data.firstName} ${agent.data.lastName} has joined your business`,
          {
            type: NotificationType.AFFILIATE,
            agentId: agent.data.aid,
            priority: NotificationPriority.MEDIUM,
          }
        );
      }

      return res.status(201).json({
        status: true,
        message: agent.message,
        data: agent.data,
      });
    } catch (error) {
      return next(error);
    }
  });
};

export const authenticateAgent = Async(async (req, res) => {
  const sanitizedData = {};
  for (const [key, value] of Object.entries(req.body)) {
    sanitizedData[key] =
      typeof value === "string"
        ? value.replace(/[<>\"'`;]/g, "").trim()
        : value;
  }

  const result = await ModelAgent.Authenticate(sanitizedData);

  // Security notification for successful login
  await createAgentNotification(
    result.user.aid,
    "New Login Detected",
    "Your account was accessed successfully. If this wasn't you, please reset your password immediately.",
    {
      type: NotificationType.SECURITY,
      priority: NotificationPriority.MEDIUM,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    }
  );

  return res.status(200).json({
    status: true,
    message: "Login successful",
    data: result.user,
    token: result.token,
  });
});

export const verifyAgentEmail = Async(async (req, res) => {
  const { aid, token } = req.params;
  if (!token || !aid)
    throw new ErrorClass("Missing verification parameters", 400);

  // FIX: Use environment variable with localhost as fallback
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  const redirectUrl = req.query.redirect || `${frontendBaseUrl}/auth/verify-nin?aid=${aid}`;

  try {
    const result = await ModelAgent.VerifyEmail(token);

    // Email verification notification
    await createAgentNotification(
      result.agentId,
      "Email Verified Successfully",
      "Your email address has been verified. You can now proceed with NIN verification.",
      {
        type: NotificationType.VERIFICATION,
        priority: NotificationPriority.MEDIUM,
      }
    );

    // Referral logic
    try {
      const agent = await ModelAgent.findByPk(result.agentId);
      if (agent && agent.verified && agent.ninVerified && agent.referred_by) {
        if (!agent.referralRewarded) {
          const referrer = await ModelAgent.findByPk(agent.referred_by);
          if (referrer) {
            referrer.referral_count = (referrer.referral_count || 0) + 1;
            await referrer.save();

            // Notification for referrer
            await createAgentNotification(
              referrer.aid,
              "New Referral Completed",
              `Your referral ${agent.firstName} ${agent.lastName} has completed registration and verification.`,
              {
                type: NotificationType.REFERRAL,
                priority: NotificationPriority.LOW,
                referredAgentId: agent.aid,
              }
            );

            agent.referralRewarded = true;
            await agent.save();
          }
        }
      }
    } catch (e) {
      console.error("Referral count update error:", e);
    }

    return res.redirect(`${redirectUrl}&status=success`);
  } catch (err) {
    return res.redirect(
      `${redirectUrl}&status=error&message=${encodeURIComponent(err.message)}`
    );
  }
});

// export const verifyAgentEmail = Async(async (req, res) => {
//   const { aid, token } = req.params;
//   if (!token || !aid)
//     throw new ErrorClass("Missing verification parameters", 400);

//   const redirectUrl =
//     req.query.redirect || `http://localhost:3000/auth/verify-nin?aid=${aid}`;

//   try {
//     const result = await ModelAgent.VerifyEmail(token);

//     // Email verification notification
//     await createAgentNotification(
//       result.agentId,
//       "Email Verified Successfully",
//       "Your email address has been verified. You can now proceed with NIN verification.",
//       {
//         type: NotificationType.VERIFICATION,
//         priority: NotificationPriority.MEDIUM,
//       }
//     );

//     // Referral logic
//     try {
//       const agent = await ModelAgent.findByPk(result.agentId);
//       if (agent && agent.verified && agent.ninVerified && agent.referred_by) {
//         if (!agent.referralRewarded) {
//           const referrer = await ModelAgent.findByPk(agent.referred_by);
//           if (referrer) {
//             referrer.referral_count = (referrer.referral_count || 0) + 1;
//             await referrer.save();

//             // Notification for referrer
//             await createAgentNotification(
//               referrer.aid,
//               "New Referral Completed",
//               `Your referral ${agent.firstName} ${agent.lastName} has completed registration and verification.`,
//               {
//                 type: NotificationType.REFERRAL,
//                 priority: NotificationPriority.LOW,
//                 referredAgentId: agent.aid,
//               }
//             );

//             agent.referralRewarded = true;
//             await agent.save();
//           }
//         }
//       }
//     } catch (e) {
//       console.error("Referral count update error:", e);
//     }

//     return res.redirect(`${redirectUrl}&status=success`);
//   } catch (err) {
//     return res.redirect(
//       `${redirectUrl}&status=error&message=${encodeURIComponent(err.message)}`
//     );
//   }
// });

export const verifyNIN = async (reqBody) => {
  try {
    const result = await ModelAgent.VerifyNIN(reqBody);

    // NIN verification notification
    await createAgentNotification(
      reqBody.aid,
      "NIN Verification Complete",
      "Your National Identification Number has been verified successfully.",
      {
        type: NotificationType.VERIFICATION,
        priority: NotificationPriority.MEDIUM,
      }
    );

    try {
      const agent = await ModelAgent.findByPk(reqBody.aid);
      if (agent && agent.verified && agent.ninVerified && agent.referred_by) {
        if (!agent.referralRewarded) {
          const referrer = await ModelAgent.findByPk(agent.referred_by);
          if (referrer) {
            referrer.referral_count = (referrer.referral_count || 0) + 1;
            await referrer.save();

            // Notification for referrer
            await createAgentNotification(
              referrer.aid,
              "New Referral Completed",
              `Your referral ${agent.firstName} ${agent.lastName} has completed all verifications.`,
              {
                type: NotificationType.REFERRAL,
                priority: NotificationPriority.LOW,
                referredAgentId: agent.aid,
              }
            );

            agent.referralRewarded = true;
            await agent.save();
          }
        }
      }
    } catch (e) {
      console.error("Referral count update error:", e);
    }

    return result;
  } catch (error) {
    if (!(error instanceof ErrorClass)) {
      error = new ErrorClass(
        error.message || "Verification failed",
        error.statusCode || 500,
        "VERIFICATION_ERROR"
      );
    }
    throw error;
  }
};

export const resendVerificationToken = Async(async (req, res) => {
  const { aid } = req.body;
  if (!aid) throw new ErrorClass("Missing agent ID", 400);

  const result = await ModelAgent.resendVerificationToken(aid);

  // Notification for token resend
  await createAgentNotification(
    aid,
    "Verification Email Sent",
    "A new verification email has been sent to your email address.",
    {
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.LOW,
    }
  );

  return res.status(200).json({
    status: true,
    message: result.message,
  });
});

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await ModelAgent.changePassword(
      req.user.aid,
      currentPassword,
      newPassword
    );

    // Security notification for password change
    await createAgentNotification(
      req.user.aid,
      "Password Changed",
      "Your password has been updated successfully. If this wasn't you, please contact support immediately.",
      {
        type: NotificationType.SECURITY,
        priority: NotificationPriority.HIGH,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await ModelAgent.initiatePasswordReset(email);

    // Security notification for password reset request
    const agent = await ModelAgent.findOne({ where: { email } });
    if (agent) {
      await createAgentNotification(
        agent.aid,
        "Password Reset Requested",
        "A password reset link has been sent to your email. If you didn't request this, please secure your account.",
        {
          type: NotificationType.SECURITY,
          priority: NotificationPriority.HIGH,
          timestamp: new Date().toISOString(),
          ip: req.ip,
        }
      );
    }

    res.json({
      message:
        "If an account exists with this email, a reset link will be sent",
    });
  } catch (error) {
    res.json({
      message:
        "If an account exists with this email, a reset link will be sent",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, aid, newPassword } = req.body;
    const result = await ModelAgent.completePasswordReset(
      token,
      aid,
      newPassword
    );

    // Security notification for successful password reset
    await createAgentNotification(
      aid,
      "Password Reset Successful",
      "Your password has been reset successfully. If this wasn't you, please contact support immediately.",
      {
        type: NotificationType.SECURITY,
        priority: NotificationPriority.HIGH,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      }
    );

    res.json(result);
  } catch (error) {
    if (
      error.message.includes("Invalid") ||
      error.message.includes("expired")
    ) {
      error.statusCode = 400;
      error.message = "Invalid or expired token";
    }
    next(error);
  }
};

export const updateProfile = (req, res, next) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return next(new ErrorClass(err.message || "Image upload failed", 400));
    }
    try {
      const sanitizedData = {};
      for (const [key, value] of Object.entries(req.body)) {
        sanitizedData[key] = typeof value === "string" ? value.trim() : value;
      }
      if (req.file?.location) {
        sanitizedData.imgUrl = req.file.location;
      }
      const result = await ModelAgent.updateProfile(
        req.user.aid,
        sanitizedData
      );

      // Profile update notification
      await createAgentNotification(
        req.user.aid,
        "Profile Updated",
        "Your profile information has been updated successfully.",
        {
          type: NotificationType.PROFILE,
          priority: NotificationPriority.LOW,
        }
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  });
};

// Get logged-in agent full profile (referral, earnings, etc)
export const getLoggedInAgentProfile = Async(async (req, res, next) => {
  try {
    const aid = req.user.aid;
    const profile = await ModelAgent.getFullProfile(aid);
    res.json({ status: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export const getAgentDashboard = async (req, res, next) => {
  try {
    const agent = await ModelAgent.findByPk(req.user.aid);
    if (!agent) throw new ErrorClass("Agent not found", 404);
    const dashboard = await agent.getDashboard();

    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

export const searchAffiliates = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) throw new ErrorClass("Search term required", 400);
    const results = await ModelAgent.searchAffiliates(q);
    res.json({ status: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const getAllAffiliates = async (req, res, next) => {
  try {
    const affiliates = await ModelAgent.getAllAffiliates();
    res.json({ status: true, data: affiliates });
  } catch (error) {
    next(error);
  }
};

export const getAllAgentReferral = async (req, res) => {
  try {
    const agentId = req.user.aid;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID not found in authentication token",
        availableFields: Object.keys(req.user),
      });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Find the referee agent
    const refereeAgent = await ModelAgent.findByPk(agentId, {
      attributes: [
        "aid",
        "fullName",
        "email",
        "referral_count",
        "referral_earnings",
        "rank",
        "sales_portfolio",
      ],
    });

    if (!refereeAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found in database",
        requestedAgentId: agentId,
      });
    }

    const { count, rows: referredAgents } = await ModelAgent.findAndCountAll({
      where: {
        referred_by: agentId,
      },
      attributes: [
        "aid",
        "fullName",
        "email",
        "phone",
        "rank",
        "sales_portfolio",
        "total_earnings",
        "sales_earnings",
        "referral_earnings",
        "verified",
        "referralRewarded",
        "createdAt",
      ],
      order: [[sortBy, sortOrder]],
      limit: limitNum,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limitNum);

    res.status(200).json({
      success: true,
      message: "Referred agents fetched successfully",
      data: {
        referee: {
          id: refereeAgent.aid,
          name: refereeAgent.fullName,
          email: refereeAgent.email,
          referral_count: refereeAgent.referral_count,
          referral_earnings: refereeAgent.referral_earnings,
          rank: refereeAgent.rank,
          sales_portfolio: refereeAgent.sales_portfolio,
        },
        referrals: referredAgents,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalReferrals: count,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
          pageSize: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching referred agents:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
