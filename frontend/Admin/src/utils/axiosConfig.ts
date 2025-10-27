import axios from "axios";
import { toastError } from "@/utils/toastMsg"; // Updated import

// Flag to prevent multiple redirects
let isRedirecting = false;

// Global logout function
const handleLogout = () => {
  if (isRedirecting) return;
  isRedirecting = true;

  // Clear all possible tokens
  localStorage.removeItem("business-token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("guard-token");
  localStorage.removeItem("$token_key");
  localStorage.removeItem("user");

  // Show message
  toastError("Session expired. Please login again.");

  // Redirect to login
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }

  // Reset flag after a delay
  setTimeout(() => {
    isRedirecting = false;
  }, 1000);
};

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("business-token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);