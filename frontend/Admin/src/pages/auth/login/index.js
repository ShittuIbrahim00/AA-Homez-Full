import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Input } from "../../../components/Custom";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { UserContext } from "../../../context/user";
import { LoginHandler } from "../../../utils/api";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/layouts/Loader";

const initialFormData = { email: "", password: "" };

function Login() {
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState(""); // Add state for API errors

  useEffect(() => {
    setFormData((prev) => ({ ...prev, password: "" }));

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated]);

  // === Validation ===
  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) return "Email Address is required.";
    if (!regex.test(email)) return "Email Address is not valid.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    return "";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  const gotoRoute = (path) => {
    router.push(path);
  };

  const _login = async () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    
    // Clear previous API error
    setApiError("");

    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await LoginHandler(formData);

      if (!res?.status) {
        const errorMessage = res?.message || "Login failed";
        setApiError(errorMessage); // Set API error to display under inputs
        toast.error(errorMessage);
      } else {
        const userData = res.data;
        const token = res.data.token || userData.token;

        // Use the auth hook login function
        login(userData, token);

        // Also set in context for backward compatibility
        setUser(userData);

        toast.success("Login successful 🎉");

        // Router will handle redirect via useAuth hook
      }
    } catch (e) {
      console.error("Login error:", e);
      const errorMessage = "Something went wrong during login!";
      setApiError(errorMessage); // Set API error to display under inputs
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 relative">
      {/* Loader overlay only during login */
      }
      <Loader show={loading} />

      {/* Left Image Section (desktop only) */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src={require("../../../../public/images/building1.jpg")}
          alt="A&A"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right Login Form */}
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

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back Admin
          </h2>
          <p className="text-gray-500 mb-8 text-base">
            Please log in to continue to your account
          </p>

          {/* API Error Message - Displayed at the top of the form */}
          {apiError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{apiError}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email address
            </label>
            <Input
              placeholder="john@example.com"
              type="email"
              aria-label="Email address"
              disabled={loading}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-60 text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <small className="text-red-600 text-sm mt-1 block">{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <Input
              placeholder="********"
              type="password"
              aria-label="Password"
              disabled={loading}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-60 text-black ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <small className="text-red-600 text-sm mt-1 block">{errors.password}</small>
            )}
          </div>

          {/* Forgot Password Link */}
          {/* <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => gotoRoute("/forgot-password")}
              disabled={loading}
              className="text-sm text-orange-600 hover:underline disabled:opacity-60"
            >
              Forgot password?
            </button>
          </div> */}

          {/* Button */}
          <Button
            onClick={_login}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Signup Link */}
          {/* <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => gotoRoute("/register")}
              className="text-orange-600 hover:underline font-medium"
              disabled={loading}
            >
              Sign up
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;