import axios from "axios";
import { handleApiError } from "@/utils/apiErrorHandler";

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Add request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token =
      localStorage.getItem("business-token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("guard-token");

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `${token}`;
    }

    // Set content type for non-form data requests
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleApiError(error, "API request failed"));
  }
);

export default apiClient;