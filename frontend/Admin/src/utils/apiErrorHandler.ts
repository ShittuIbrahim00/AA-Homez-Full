import { toastError } from "@/utils/toastMsg"; // Updated import

// Centralized API error handler
export const handleApiError = (error: any, defaultMessage: string = "An error occurred") => {
  console.error("API Error:", error);
  
  // Handle network errors
  if (!error.response) {
    toastError("Network error. Please check your connection.");
    return new Error("Network error. Please check your connection.");
  }
  
  // Handle different status codes
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      toastError(data?.message || "Bad request. Please check your input.");
      return new Error(data?.message || "Bad request. Please check your input.");
      
    case 401:
      toastError("Session expired. Please login again.");
      // Clear auth tokens
      localStorage.removeItem("business-token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("guard-token");
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return new Error("Unauthorized. Please login again.");
      
    case 403:
      toastError("Access denied. You don't have permission to perform this action.");
      return new Error("Access denied. You don't have permission to perform this action.");
      
    case 404:
      toastError(data?.message || "Resource not found.");
      return new Error(data?.message || "Resource not found.");
      
    case 422:
      toastError(data?.message || "Validation error. Please check your input.");
      return new Error(data?.message || "Validation error. Please check your input.");
      
    case 500:
      toastError("Server error. Please try again later.");
      return new Error("Server error. Please try again later.");
      
    default:
      toastError(data?.message || defaultMessage);
      return new Error(data?.message || defaultMessage);
  }
};