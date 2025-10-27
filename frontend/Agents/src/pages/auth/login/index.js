import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
import { UserContext } from "../../../context/user";
import { useGlobalContext } from "../../../context/global";
import { LoginHandler } from "../../../utils/api";
import { Input, Button } from "../../../components/Custom";
import { Footer } from "../../../components/auth";
import Image from "next/image";
import Loader from "@/layouts/Loader";

const initialFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const { toastSuccess, toastError } = useResponsiveToast();
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useContext(UserContext);
  const { loading, setLoading } = useGlobalContext();
  const router = useRouter();
  const passwordRef = useRef(null);


useEffect(() => {
  const token = localStorage.getItem("$token_key");
  if (token) {
    router.replace("/home");
  }
}, []);


  // ✅ Prefill email if passed via query param and show welcome toast
  useEffect(() => {
    const emailFromQuery = router.query.email;

    if (emailFromQuery) {
      const decodedEmail = decodeURIComponent(emailFromQuery);
      setFormData((prev) => ({ ...prev, email: decodedEmail }));

      // Show welcome toast
      toastSuccess("Welcome back! Please log in with your new password");

      // Focus password field after a short delay
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 300);
    }
  }, [router.query.email, toastSuccess]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const gotoDashboard = () => router.replace("/home");

  const _login = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toastError("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const res = await LoginHandler(formData);

      if (!res || res.status === false) {
        toastError(res?.message || "Login failed");
        return;
      }

      setUser(res.data);
      toastSuccess("Login successful!");
      gotoDashboard();
    } catch (error) {
      toastError("An error occurred during login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 relative">
      <Loader show={loading} />

      {/* Left Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src={require("../../../../public/images/dum.jpg")}
          alt="Login visual"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
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
          <div className="text-start mb-6">
            <h2 className="text-gray-600 text-xl font-light">
              In the moment we live and build!!
            </h2>
            <h2 className="text-gray-600 font-extrabold text-xl">
              Welcome back Affiliate
            </h2>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              aria-label="Email address"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-60"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <Input
              ref={passwordRef}
              type="password"
              onKeyDown={(e) => e.key === "Enter" && _login()}
              placeholder="************"
              aria-label="Password"
              disabled={loading}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-60"
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Login Button */}
          <Button
            text={loading ? "Logging in..." : "Login"}
            onClick={_login}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          />

          {/* Forgot Password */}
          <div className="text-right mt-4">
            <button
              onClick={() => router.push("/auth/forgot")}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <Footer user={user} setUser={setUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
