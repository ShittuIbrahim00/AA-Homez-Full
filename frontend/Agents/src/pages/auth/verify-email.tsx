import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/layouts/Loader";
import { resendVerificationHandler } from "@/utils/api";
import { Button } from "../../components/Custom";

const VerifyEmail = () => {
  const router = useRouter();
  const { aid, email } = router.query;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle resend email
  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await resendVerificationHandler({ email, aid });
      if (res.status) {
        setStatus("Verification email resent successfully!");
        setResendCooldown(120);
      } else {
        setStatus(res.message || "Failed to resend verification email.");
      }
    } catch {
      setStatus("Something went wrong while resending.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Loader show={loading} />
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-orange-600">Verify Your Email</h2>

        {email && (
          <p className="text-gray-700">
            A verification link has been sent to <strong>{email}</strong>. Please check your email and click the verification link to continue.
          </p>
        )}

        {status && (
          <div
            className={`p-3 rounded ${
              status.includes("successfully")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status}
          </div>
        )}

        <Button
          text={
            resendCooldown > 0
              ? `Resend Email in ${resendCooldown}s`
              : "Resend Verification Email"
          }
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        />
      </div>
    </div>
  );
};

export default VerifyEmail;