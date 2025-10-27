import { toast, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Store toast IDs to prevent duplicates
const toastIds = new Map<string, string | number>();

// Default toast options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

// Generate a unique key for each message
const generateToastKey = (message: string, type: string) => {
  return `${type}-${message}`;
};

// Clear old toast IDs to prevent memory leaks
const cleanupToastIds = () => {
  if (toastIds.size > 100) {
    const firstKey = toastIds.keys().next().value;
    if (firstKey) {
      toastIds.delete(firstKey);
    }
  }
};

export const toastSuccess = (message: string, options?: ToastOptions) => {
  const toastKey = generateToastKey(message, 'success');
  
  // Dismiss existing toast with same message
  if (toastIds.has(toastKey)) {
    toast.dismiss(toastIds.get(toastKey));
  }
  
  // Show new toast and store its ID
  const toastId = toast.success(message, { ...defaultOptions, ...options });
  toastIds.set(toastKey, toastId);
  
  // Clean up old toast IDs
  cleanupToastIds();
  
  return toastId;
};

export const toastError = (message: string, options?: ToastOptions) => {
  const toastKey = generateToastKey(message, 'error');
  
  // Dismiss existing toast with same message
  if (toastIds.has(toastKey)) {
    toast.dismiss(toastIds.get(toastKey));
  }
  
  // Show new toast and store its ID
  const toastId = toast.error(message, { ...defaultOptions, ...options });
  toastIds.set(toastKey, toastId);
  
  // Clean up old toast IDs
  cleanupToastIds();
  
  return toastId;
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  const toastKey = generateToastKey(message, 'warning');
  
  // Dismiss existing toast with same message
  if (toastIds.has(toastKey)) {
    toast.dismiss(toastIds.get(toastKey));
  }
  
  // Show new toast and store its ID
  const toastId = toast.warn(message, { ...defaultOptions, ...options });
  toastIds.set(toastKey, toastId);
  
  // Clean up old toast IDs
  cleanupToastIds();
  
  return toastId;
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  const toastKey = generateToastKey(message, 'info');
  
  // Dismiss existing toast with same message
  if (toastIds.has(toastKey)) {
    toast.dismiss(toastIds.get(toastKey));
  }
  
  // Show new toast and store its ID
  const toastId = toast.info(message, { ...defaultOptions, ...options });
  toastIds.set(toastKey, toastId);
  
  // Clean up old toast IDs
  cleanupToastIds();
  
  return toastId;
};

// Update ToastContainer configuration for better responsiveness
export const toastConfig = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true, // Show newest toasts on top
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark" as const,
  // Responsive positioning
  style: {
    marginTop: '10px',
    marginRight: '10px',
    maxWidth: '90vw',
  },
};

export default {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
};