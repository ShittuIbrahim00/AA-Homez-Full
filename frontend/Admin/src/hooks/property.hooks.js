import axios from "axios";
import { toast } from "react-toastify";
import propertyServices from "../services/property.services";
import { useState, useEffect } from "react";
import { Property } from "@/types/property"; // adjust path if needed
// Define API constants
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = `${API_URL}/property`;

// Token getter
const getGuardToken = () => {
  const guardToken =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!guardToken) throw new Error("Auth token missing. Please login again.");
  return guardToken;
};

// Add Main Property (FormData)
export const _addProperty = async (formData) => {
  try {
    const token = getGuardToken();
    // console.log("🚀 Sending property with formData:");
    for (let [key, value] of formData.entries())
      
      console.log(key, value);

    const res = await axios.post(`${API_BASE}/add`, formData, {
      headers: { Authorization: `${token}` },
    });

    // console.log("✅ Add property response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Add property error:", err.response?.data || err.message);
    return {
      status: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

// Fetch Sub-Property by IDs
export const fetchSubProperty = async (propertyId, subPropertyId) => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_BASE}/${propertyId}`, {
      headers: { Authorization: `${token}` },
    });

    // console.log("🔍 Debug - Full property response:", res.data.data);
    // console.log("🔍 Debug - SubProperties array:", res.data.data.SubProperties);

    const sub = res.data.data.SubProperties?.find(
      (s) => s.sid.toString() === subPropertyId.toString()
    );

    // console.log("🔍 Debug - Found sub-property:", sub);
    // console.log("🔍 Debug - Sub-property price:", sub?.price, "Type:", typeof sub?.price);

    return sub || null;
  } catch (err) {
    console.error(
      "❌ Fetch sub-property error:",
      err.response?.data || err.message
    );
    return null;
  }
};

// Update Sub-Property
export const updateSubProperty = async (subPropertyId, payload) => {
  try {
    const token = getGuardToken();
    const res = await axios.patch(
      `${API_BASE}/sub/update/${subPropertyId}`,
      payload,
      {
        headers: { Authorization: `${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "❌ Update sub-property error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// Delete Sub-Property
export const deleteSubProperty = async (subPropertyId) => {
  try {
    const token = getGuardToken();
    const res = await axios.delete(`${API_BASE}/sub/delete/${subPropertyId}`, {
      headers: { Authorization: `${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Delete sub-property error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// Get All Properties
export const getAllProperties = async () => {
  try {
    const guardToken = getGuardToken();
    // console.log("Fetching all properties with guard-token:", guardToken);

    const res = await axios.get(`${API_URL}/property/admin/all?limit=100`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${guardToken}`,
      },
    });

    // console.log("Full getAllProperties Response:", res.data.data);
    // console.log("Full getAllProperties Meta:", res.data.meta);

    return res?.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching properties:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Get single Property by ID
export const getPropertyById = async (propertyId) => {
  try {
    const guardToken = getGuardToken();
    // console.log(
    //   `Fetching property ${propertyId} with guard-token:`,
    //   guardToken
    // );

    const res = await axios.get(`${API_URL}/property/${propertyId}`, {
      headers: {
        Authorization: guardToken,
      },
    });

    // console.log("Property data received:", res.data);
    return res.data.data;
  } catch (error) {
    console.error(
      `Error fetching property ${propertyId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

// Get Sub-properties for a main property
export const getSubProperties = async (parentId) => {
  try {
    const guardToken = getGuardToken();
    // console.log(
    //   `Fetching sub-properties for property ${parentId} with guard-token:`,
    //   guardToken
    // );

    const res = await axios.get(`${API_URL}/property/all/sub/property`, {
      headers: {
        Authorization: guardToken,
      },
      params: { parentId },
    });

    // console.log(`Sub-properties for ${parentId}:`, res.data);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error(
      `Error fetching subproperties for ${parentId}:`,
      error.response?.data || error.message
    );
    return [];
  }
};

// Delete Property
export const deleteProperty = async (pid) => {
  try {
    const token = getGuardToken();

    const res = await axios.delete(`${API_BASE}/delete/${pid}`, {
      headers: { Authorization: `${token}` },
    });

    // console.log("🟢 Response:", res);

    if (res.data?.status && res.data?.data > 0) {
      return { success: true, message: "Property deleted successfully." };
    } else {
      return { success: false, message: "No property was deleted." };
    }
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, message: "Error deleting property." };
  }
};

export const updateProperty = async (id, payload) => {
  try {
    // console.log("🔧 Property Update - ID:", id);
    // console.log("🔧 Property Update - Payload type:", typeof payload);
    // console.log("🔧 Property Update - Is FormData:", payload instanceof FormData);
    // console.log("🔧 Property Update - Payload:", payload);
    
    // Use direct axios call like sub-property update does
    const token = getGuardToken();
    
    const response = await axios.patch(
      `${API_BASE}/update/${id}`,
      payload,
      {
        headers: { Authorization: `${token}` },
      }
    );

    // console.log("✅ Property Update Response:", response.data);
    
    if (response.data.status === true) {
      toast.success("Property updated successfully.");
      return { success: true, data: response.data.data };
    } else {
      const msg =
        response.data.message ||
        "Update failed: Backend responded with status false.";
      console.warn("⚠️ Server responded without status true:", msg);
      return { success: false, message: msg };
    }
  } catch (error) {
    console.error("🔴 Error caught during property update:", error);
    console.error("🔴 Error response:", error.response);

    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to update property.";
    toast.error(msg);

    return { success: false, message: msg };
  }
};

// Pay for Property
export const payForProperty = async (pid, payload) => {
  try {
    const token = getGuardToken();

    const res = await axios.post(`${API_BASE}/${pid}/pay`, payload, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log("💰 Pay Response:", res);

    if (res.data?.status || res.data?.success) {
      return {
        success: true,
        message: res.data.message || "Payment successful.",
      };
    } else {
      return { success: false, message: res.data.message || "Payment failed." };
    }
  } catch (error) {
    console.error("Pay error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error processing payment for property.",
    };
  }
};

// Pay for Sub-Property
export const payForSubProperty = async (pid, sid, payload) => {
  try {
    const token = getGuardToken();

    const res = await axios.post(
      `${API_BASE}/${pid}/sub-properties/${sid}/pay`,
      payload,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("💳 Sub-Property Pay Response:", res);

    if (res.data?.status || res.data?.success) {
      toast.success(res.data.message || "Payment successful.");
      return {
        success: true,
        message: res.data.message || "Payment successful.",
      };
    } else {
      toast.error(res.data.message || "Payment failed.");
      return { success: false, message: res.data.message || "Payment failed." };
    }
  } catch (error) {
    console.error("Sub-Property Pay error:", error);
    const msg =
      error.response?.data?.message || "Error processing sub-property payment.";
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// ✅ Get properties (alias for getAllProperties)
export const _getProperties = async () => {
  return await getAllProperties();
};

// ✅ Get hot/featured properties (filtered from all properties)
export const _getAllHotProperty = async () => {
  try {
    const allProperties = await getAllProperties();
    // You can filter based on your criteria for "hot" properties
    // For now, returning all properties. Adjust the filter as needed:
    return (
      allProperties.filter(
        (property) => property.isFeatured || property.isHot
      ) || allProperties
    );
  } catch (err) {
    console.error("❌ Get hot properties error:", err);
    return [];
  }
};

// ✅ Get single property (alias for getPropertyById)
export const _getProperty = async (id) => {
  return await getPropertyById(id);
};

// ✅ Get sub-property
export const _getSubProperty = async (propertyId, subPropertyId) => {
  return await fetchSubProperty(propertyId, subPropertyId);
};
