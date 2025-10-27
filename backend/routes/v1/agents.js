/* Router Configuration */
import express from "express";
import {
  authenticateAgent,
  changePassword,
  forgotPassword,
  getAgentDashboard,
  getAllAffiliates,
  registerAgent,
  resendVerificationToken,
  resetPassword,
  searchAffiliates,
  updateProfile,
  verifyAgentEmail,
  verifyNIN,
  getLoggedInAgentProfile,
  getAllAgentReferral,
} from "../../controllers/controller.v1.agent.js";
// Get logged-in agent full profile
import {
  ninVerificationSchema,
  validate,
} from "../../middleware/validation.js";
import rateLimit from "express-rate-limit";
import { authAgent } from "../../middleware/auth.middleware.js";

const router = express.Router();

const ninRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // align comment + code
  handler: (req, res) => {
    res.status(429).json({
      status: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many verification attempts",
      },
    });
  },
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per window
  message: 'Too many password reset requests, please try again later',
  skipSuccessfulRequests: true
});

router.get("/me", authAgent, getLoggedInAgentProfile);
// Authentication Routes
router.post("/register", registerAgent);
router.post("/login", authenticateAgent);

router.post("/resend-verification", resendVerificationToken);


router.get("/verify-email/:aid/:token", verifyAgentEmail);

router.post(
  "/verify-nin",
  ninRateLimiter,
  validate(ninVerificationSchema),
  async (req, res) => {
    try {
      const result = await verifyNIN(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message,
        code: error.code || "VERIFICATION_FAILED",
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      });
    }
  }
);

// @route   POST /api/v1/agent/change-password
// @desc    Change password for authenticated agent
// @access  Private (Agent)
router.post("/change-password", authAgent, changePassword);

// @route   POST /api/v1/agent/forgot-password
// @desc    Initiate password reset process
// @access  Public
router.post("/forgot-password", resetLimiter, forgotPassword);

// @route   POST /api/v1/agent/reset-password
// @desc    Complete password reset process
// @access  Public
router.post("/reset-password", resetPassword);

router.patch('/profile', authAgent, updateProfile);

router.get("/all/referrals", authAgent, getAllAgentReferral)

router.get('/dashboard', authAgent, getAgentDashboard);
router.get('/affiliates/search', authAgent, searchAffiliates);
router.get('/affiliates/all', authAgent, getAllAffiliates);



// // Network Routes
// router.get('/downline/:agentId', MiddlewareApiGuard, getAgentDownline);

// // Commission Routes
// router.get('/rewards/:agentId', MiddlewareApiGuard, calculateAgentRewards);
// router.post('/:agentId/sales', MiddlewareAgentApiGuard, recordPropertySale);
// router.get('/commissions', MiddlewareAgentApiGuard, getAgentCommissions);

// // Event Routes
// router.get('/events', MiddlewareApiGuard, listAllEvents);
// router.get('/events/:eventId', MiddlewareApiGuard, getEventDetails);
// router.post('/events', MiddlewareApiGuard, createNewEvent);


export default router;
