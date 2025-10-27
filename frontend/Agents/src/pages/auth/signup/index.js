import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loader from "@/layouts/Loader";
import { Input, Button } from "../../../components/Custom";
import { Footer } from "../../../components/auth";
import { SignupHandler } from "../../../utils/api";
import { resendVerificationHandler } from "../../../utils/api";
import { useCooldown } from "@/hooks/useCooldown";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";

import Joi from "joi";

// ✅ Validation Schema (Removed bank fields)
const signupSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.empty": "Full name is required",
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 32 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, and a number",
    }),
  phone: Joi.string()
    .pattern(/^0[789][01]\d{8}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Enter a valid Nigerian phone number",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
  dob: Joi.date().iso().required().messages({
    "date.base": "Date of birth must be valid",
    "any.required": "Date of birth is required",
  }),
  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Please select a gender",
    "string.empty": "Gender is required",
  }),
  idType: Joi.string().valid("NIN", "DRIVER_LICENSE", "PASSPORT").required(),
  idNumber: Joi.string().required().messages({
    "string.empty": "ID Number is required",
  }),
  termStatus: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the Terms and Conditions",
  }),
  referralCode: Joi.string().allow("").optional(),
});

// ✅ Removed bank fields
const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  dob: "",
  gender: "",
  idType: "NIN",
  idNumber: "",
  termStatus: false,
  referralCode: "",
};

const Signup = () => {
  const { toastSuccess, toastError } = useResponsiveToast();
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referralFromUrl, setReferralFromUrl] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [agentId, setAgentId] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [resending, setResending] = useState(false);

  const { cooldown: resendCooldown, start: startCooldown } = useCooldown(
    "resend_cooldown_until",
    30
  );
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { code } = router.query;
      if (typeof code === "string" && code.trim() !== "") {
        setFormData((prev) => ({ ...prev, referralCode: code.trim() }));
        setReferralFromUrl(true);
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const _registerAgent = async () => {
    try {
      const { error, value } = signupSchema.validate(formData, {
        abortEarly: false,
      });

      if (error) {
        const errorMap = {};
        error.details.forEach((err) => {
          const key = err.path[0];
          errorMap[key] = err.message;
        });
        setFormErrors(errorMap);
        return;
      }

      setLoading(true);
      const payload = { ...value };
      if (!payload.referralCode?.trim()) delete payload.referralCode;

      const res = await SignupHandler(payload);
      localStorage.setItem("registration", JSON.stringify(res));

      if (!res || res.status === false) {
        setFormErrors({ general: res?.message || "Registration failed" });
        return;
      }

      if (res && res.status) {
        setSubmittedEmail(value.email);
        setAgentId(res.data.id); // Store the agent ID
        setShowSuccessModal(true);
        return;
      }

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(value.email)}&aid=${
          res.data.id
        }`
      );
    } catch (err) {
      setFormErrors({
        general: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };




  const handleResend = async () => {
    setResendStatus("Resending...");
    try {
      const response = await resendVerificationHandler({
        email: submittedEmail,
        aid: agentId,
      });

      console.log("Resend response:", response);

      // Check for the exact structure your backend returns
      if (response.status === true) {
        toastSuccess("Verification email resent!");
        startCooldown();
        setResendStatus("Verification email resent successfully!");
      } else {
        setResendStatus(response.message || "Failed to resend email.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setResendStatus("Error resending email. Please try again.");
    }
  };


  useEffect(() => {
  if (resendStatus) {
    const timeout = setTimeout(() => {
      setResendStatus("");
    }, 5000); // clear after 5 seconds
    return () => clearTimeout(timeout);
  }
}, [resendStatus]);

  return (
    <>
      <Loader show={loading} />
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">
              ✅ Account Created Successfully
            </h2>
            <p className="text-gray-700">
              Please check your email{" "}
              <span className="font-semibold text-orange-600">
                {submittedEmail}
              </span>{" "}
              to verify your account before logging in.
            </p>

            {/* ✅ Display only one message */}
            {resendStatus && (
              <p className="text-sm text-green-600 mt-2">{resendStatus}</p>
            )}

            <div className="flex flex-col space-y-3">
              {/* ✅ Resend Button with spinner and disable state */}
              <button
                disabled={resendCooldown > 0 || resending}
                onClick={handleResend}
                className={`px-6 py-2 rounded-md transition flex items-center justify-center gap-2 ${
                  resendCooldown > 0 || resending
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {resending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s...`
                ) : (
                  "Resend Verification Email"
                )}
              </button>

              {/* ✅ Login Button */}
              <button
                onClick={() => router.push("/auth/login")}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
        {/* Banner */}
        <div className="hidden md:block fixed left-0 top-0 h-screen w-[42%]">
          <Image
            src={require("../../../../public/images/picture.png")}
            alt="signup"
            className="h-full w-full object-center"
            priority
            fill
          />
        </div>

        {/* Form */}
        <div className="w-full md:ml-[42%] flex justify-center px-1 py-12 md:px-12">
          <div className="w-full max-w-[700px] bg-white p-6 md:p-10 rounded-3xl shadow-lg space-y-8">
            <div className="flex justify-start mb-8">
              <Image
                src={require("../../../../public/icons/logo.png")}
                alt="logo"
                width={120}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <h2 className="text-2xl md:text-3xl text-center font-extrabold text-orange-600">
              Create an Affiliate Account
            </h2>

            {/* General error */}
            {formErrors.general && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md">
                {formErrors.general}
              </div>
            )}

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
                {formErrors.fullName && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {formErrors.email && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {formErrors.password && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
                {formErrors.dob && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.dob}</p>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Address
                </label>
                <Input
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                {formErrors.address && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col text-black">
              <label className="mb-2 font-medium text-gray-700">Gender</label>
              <select
                className="w-full border border-gray-300 rounded-md p-3"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && (
                <p className="text-red-600 text-xs mt-1">{formErrors.gender}</p>
              )}
            </div>

            {/* ID Number */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">NIN</label>
              <Input
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
              />
              {formErrors.idNumber && (
                <p className="text-red-600 text-xs mt-1">
                  {formErrors.idNumber}
                </p>
              )}
            </div>

            {/* Referral */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Referral Code (optional)
              </label>
              <Input
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={(e) => {
                  if (!referralFromUrl) {
                    handleChange("referralCode", e.target.value);
                  }
                }}
                disabled={referralFromUrl}
                className={referralFromUrl ? "bg-gray-100" : ""}
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termStatus}
                onChange={(e) => handleChange("termStatus", e.target.checked)}
                className="accent-orange-500 w-5 h-5 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I agree to the{" "}
                <a href="/terms" className="text-orange-500 underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {formErrors.termStatus && (
              <p className="text-red-600 text-xs">{formErrors.termStatus}</p>
            )}

            <Button
              text="Register"
              onClick={_registerAgent}
              loading={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
            />
            <Footer type="signup" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
