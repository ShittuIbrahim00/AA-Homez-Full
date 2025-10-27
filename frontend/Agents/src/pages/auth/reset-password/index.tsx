// pages/auth/reset-password.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import { Input, Button } from "@/components/Custom";
import Loader from "@/layouts/Loader";
import { resetPasswordHandler } from "@/utils/api";

const ResetPassword = () => {
  const router = useRouter();

  // Destructure query params at the top
const { token, aid } = router.query;
const rawEmail = router.query.email;
const email = typeof rawEmail === "string" ? rawEmail : "";


  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!token || !aid) {
      setError("Invalid or missing token and/or aid.");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPasswordHandler({
        token,
        aid,
        newPassword: password,
      });

      if (response.status) {
        setShowSuccessModal(true);
      } else {
        setError(response.message || "Reset failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-close modal and redirect to login with email query param
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        router.push(`/auth/login?email=${encodeURIComponent(email || "")}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, email, router]);

  // Disable button if token or aid are not ready
  const isReady = token && aid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative text-black">
      <Loader show={loading} />


  <div className="hidden md:block w-1/2 relative">
        <Image
          src={require("../../../../public/images/high_build2.jpeg")}
          alt="Forgot Password Visual"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">

          {/* <div className="w-full max-w-7xl flex items-center mb-6">
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center p-2 rounded-md hover:bg-gray-200 transition"
                  aria-label="Go back"
                >
                  <Image
                    src={require("../../../public/svg/arrow_back_black.svg")}
                    alt="Back"
                    width={32}
                    height={32}
                  />
                </button>
              </div> */}
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter and confirm your new password below.
        </p>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
        />

        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button
          text={loading ? "Resetting..." : "Reset Password"}
          onClick={handleSubmit}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md"
          disabled={!isReady || loading}
        />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">
              ✅ Password Reset Successful
            </h2>
            <p className="text-gray-700">
              You can now log in with your new password.
            </p>
            <Button
              text="Go to Login"
              onClick={() =>
                router.push(`/auth/login?email=${encodeURIComponent(email || "")}`)
              }
              className="bg-orange-600 hover:bg-orange-700 text-white w-full py-2 rounded-md"
            />
            <p className="text-xs text-gray-400">Redirecting in 5 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
