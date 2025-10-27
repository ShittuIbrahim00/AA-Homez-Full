// property.services.js
import axios from "axios";
import { handleApiError } from "@/utils/apiErrorHandler";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/property`;

// Create an axios instance with default configuration
const propertyApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to add auth headers
propertyApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("business-token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("guard-token");

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    // For FormData requests, let the browser set the correct Content-Type
    // For JSON requests, set Content-Type to application/json
    if (config.data instanceof FormData) {
      // For FormData, delete Content-Type to let browser set it with boundary
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
propertyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleApiError(error, "Failed to fetch property data"));
  }
);

const getAuthHeaders = (isFormData = false) => {
  const token =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!token) throw new Error("Auth token missing. Please login again.");

  const headers = {
    Authorization: `${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

class PropertyServices {
  getAllHotProperty() {
    return propertyApi.get("/hot");
  }

  getProperty(id) {
    return propertyApi.get(`/${id}`);
  }

  removeProperty(id) {
    return propertyApi.delete(`/delete/${id}`);
  }

  updateProperty(id, payload) {
    console.log("🚀 PropertyServices - Update API URL:", `/update/${id}`);
    console.log("🚀 PropertyServices - Sending payload type:", typeof payload);
    console.log("🚀 PropertyServices - Is FormData:", payload instanceof FormData);
  
    // Check if payload is FormData
    if (payload instanceof FormData) {
      console.log("🚀 PropertyServices - Sending FormData payload");
      // Let the browser set the Content-Type with the correct boundary
      return propertyApi.patch(`/update/${id}`, payload);
    }
    
    return propertyApi.patch(`/update/${id}`, payload);
  }

  getProperties(page = 1, status) {
    const url = `?page=${page}${status ? `&status=${status}` : ""}`;
    return propertyApi.get(url);
  }

  getAllSubProperties() {
    return propertyApi.get("/sub");
  }

  getSubProperty(id) {
    return propertyApi.get(`/sub/${id}`);
  }

  addSubProperty(id, payload) {
    return propertyApi.post(`/sub/add/${id}`, payload);
  }

  removeSubProperty(id) {
    return propertyApi.delete(`/sub/delete/${id}`);
  }

  updateSubProperty(id, payload) {
    return propertyApi.patch(`/sub/update/${id}`, payload);
  }

  addProperty(formData) {
    return propertyApi.post("/add", formData);
  }
}

export default new PropertyServices();