import React, { useState } from "react";
import Image from "next/image";
import { Button, Input } from "@/components/Custom";
import Footer from "@/components/auth/signup_footer";
import { useRouter } from "next/router";
import Loader from "@/layouts/Loader";
import { forgotPasswordHandler } from "@/utils/api";

const initialFormData = {
  email: "",
};

function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");

  const _setEmail = (val: string) => {
    setFormData({ ...formData, email: val });
    setMessage("");

    const regx = /^([a-zA-Z0-9_.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,})$/;

    if (!val.trim()) {
      setErrors({ email: "Email address is required." });
    } else if (!regx.test(val)) {
      setErrors({ email: "Email address is not valid." });
    } else {
      setErrors({ email: "" });
    }
  };

  const _forgotPassword = async () => {
    if (!formData.email || errors.email) {
      setErrors({ email: "Please enter a valid email." });
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await forgotPasswordHandler(formData.email);

      if (response.status) {
        setMessage("✅ Password reset link sent to your email.");
        setFormData(initialFormData);
      } else {
        setMessage(response.message || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 relative">
      <Loader show={loading} />

      {/* Left Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src={require("../../../../public/images/high_build2.jpeg")}
          alt="Forgot Password Visual"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-10">
        <div className="w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-2xl p-8 mx-auto relative">
          {/* Logo */}
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

          <div className="text-center mb-6">
            <h2 className="text-gray-600 text-xl font-light">
              In the moment we live and build.
            </h2>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              aria-label="Email address"
              value={formData.email}
              onChange={(e) => _setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-60"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Response Message */}
          {message && (
            <p
              className={`text-sm mt-2 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Recover Button */}
          <Button
            text={loading ? "Processing..." : "Recover Password"}
            onClick={_forgotPassword}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 mt-4"
          />

          {/* Back to Login */}
          <div className="text-center mt-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
