import React, { useState } from "react";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
import { ChangePasswordHandler } from "@/utils/api";
import BackHeader from "@/components/Custom/BackHeader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import Modal from "@/pages/notifications/Modal";

const ChangePasswordForm = () => {
  const router = useRouter();
  const { toastSuccess, toastError } = useResponsiveToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if current password and new password are the same
    if (formData.currentPassword === formData.newPassword) {
      toastError("New password cannot be the same as current password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toastError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await ChangePasswordHandler({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setLoading(false);

      // Check if response indicates success
      // API might return status: true or just not have an error
      if (res.status === true || (res.status !== false && !res.message?.includes("failed"))) {
        toastSuccess("Password changed successfully!");
        setShowSuccessModal(true);
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        
        // Navigate back to profile page after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/profile");
        }, 3000);
      } else {
        toastError(res.message || "Password change failed");
      }
    } catch (error) {
      setLoading(false);
      toastError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col  px-4 md:px-[30px] md:mt-48">
          <BackHeader  className="w-[100px]"/>
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 mt-10">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm text-black mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-main-primary pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-black mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-main-primary pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-black mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-main-primary pr-10"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 bg-main-primary text-white font-medium py-3 rounded hover:bg-main-secondary transition-all duration-200"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => {}}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Password Changed Successfully!</h3>
          <p className="text-gray-600 mb-4">Your password has been updated successfully. You will be redirected to your profile page shortly.</p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePasswordForm;