import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "@/layouts/Loader";
import { Input, Button } from "../../components/Custom";
import { verifyNINHandler } from "@/utils/api";

const VerifyNIN = () => {
  const router = useRouter();
  const { aid, status: urlStatus, message } = router.query;

  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Handle status from URL parameters (from backend redirect)
 useEffect(() => {
  if (urlStatus === 'success') {
    setStatus("Email verified successfully! Please enter your NIN to continue.");
  } else if (urlStatus === 'error' && message) {
    // If message is an array, take the first string, otherwise use the string directly
    const decodedMessage = Array.isArray(message)
      ? decodeURIComponent(message[0])
      : decodeURIComponent(message);
    setStatus(decodedMessage);
  }
}, [urlStatus, message]);


  const handleVerify = async () => {
    if (!nin || !aid) {
      setStatus("NIN and Agent ID are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyNINHandler({ aid: aid, nin });
      if (res.status) {
        setStatus("NIN verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        setStatus(res.message || "NIN verification failed.");
      }
    } catch {
      setStatus("Something went wrong during NIN verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Loader show={loading} />
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-orange-600">Verify Your NIN</h2>

        <p className="text-gray-700">
          Enter your National Identification Number (NIN) to complete verification.
        </p>

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

        <Input
          placeholder="Enter NIN"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
        />

        <Button
          text="Verify NIN"
          onClick={handleVerify}
          disabled={loading || !nin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        />
      </div>
    </div>
  );
};

export default VerifyNIN;