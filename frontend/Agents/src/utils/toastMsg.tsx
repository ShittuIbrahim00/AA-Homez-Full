import { ToastOptions } from "react-toastify";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";

// Export the responsive toast functions directly
// Components should import and use these functions directly
export const toastSuccess = (message: string, options?: ToastOptions) => {
  const { toast } = require("react-toastify");
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    ...options
  });
};

export const toastError = (message: string, options?: ToastOptions) => {
  const { toast } = require("react-toastify");
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    ...options
  });
};

// For backward compatibility, keep the module.exports
module.exports = {
  toastSuccess,
  toastError
};