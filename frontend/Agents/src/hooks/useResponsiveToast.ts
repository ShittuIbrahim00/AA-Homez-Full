import { toast, ToastOptions } from "react-toastify";
import { useEffect, useState } from "react";

// Custom hook for responsive toasts
export const useResponsiveToast = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // More comprehensive mobile detection
      const mobileCheck = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, options?: ToastOptions) => {
    const defaultOptions: ToastOptions = {
      position: isMobile ? "top-center" : "top-right",
      autoClose: isMobile ? 4000 : 5000, // Slightly faster on mobile
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      ...options
    };

    switch (type) {
      case 'success':
        return toast.success(message, defaultOptions);
      case 'error':
        return toast.error(message, defaultOptions);
      case 'info':
        return toast.info(message, defaultOptions);
      case 'warning':
        return toast.warn(message, defaultOptions);
      default:
        return toast(message, defaultOptions);
    }
  };

  const toastSuccess = (message: string, options?: ToastOptions) => {
    return showToast('success', message, options);
  };

  const toastError = (message: string, options?: ToastOptions) => {
    return showToast('error', message, options);
  };

  const toastInfo = (message: string, options?: ToastOptions) => {
    return showToast('info', message, options);
  };

  const toastWarning = (message: string, options?: ToastOptions) => {
    return showToast('warning', message, options);
  };

  return {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    isMobile
  };
};

export default useResponsiveToast;