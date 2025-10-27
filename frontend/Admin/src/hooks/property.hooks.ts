import axios from "axios";
import { toast } from "react-toastify";
import propertyServices from "../services/property.services";
import { useState, useEffect } from "react";
import { Property, SubProperty } from "@/types/property";

// Define API constants
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = `${API_URL}/property`;

// Token getter
const getGuardToken = (): string => {
  const guardToken =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!guardToken) throw new Error("Auth token missing. Please login again.");
  return guardToken;
};

// Add Main Property (FormData)
export const _addProperty = async (formData: FormData): Promise<any> => {
  try {
    const token = getGuardToken();
    // console.log("🚀 Sending property with formData:");
    // Convert FormData entries to an array and iterate
    Array.from(formData.entries()).forEach(([key, value]) => {
      // console.log(key, value);
    });

    const res = await axios.post(`${API_BASE}/add`, formData, {
      headers: { Authorization: `${token}` },
    });

    // console.log("✅ Add property response:", res.data);
    return res.data;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to add property";
    console.error("❌ Add property error:", errorMsg);
    toast.error(errorMsg);
    return {
      status: false,
      message: errorMsg,
    };
  }
};

// Fetch Sub-Property by IDs
export const fetchSubProperty = async (propertyId: string | number, subPropertyId: string | number): Promise<SubProperty | null> => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_BASE}/${propertyId}`, {
      headers: { Authorization: `${token}` },
    });

    console.log("🔍 Debug - Full property response:", res.data);
    console.log("🔍 Debug - Full property response data:", res.data.data);
    console.log("🔍 Debug - SubProperties array:", res.data.data.SubProperties);

    const sub = res.data.data.SubProperties?.find(
      (s: SubProperty) => s.sid.toString() === subPropertyId.toString()
    );

    console.log("🔍 Debug - Found sub-property:", sub);
    console.log("🔍 Debug - Sub-property price:", sub?.price, "Type:", typeof sub?.price);
    console.log("🔍 Debug - Sub-property listingStatus:", sub?.listingStatus);

    return sub || null;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to fetch sub-property";
    console.error(
      "❌ Fetch sub-property error:",
      errorMsg
    );
    toast.error(errorMsg);
    return null;
  }
};

// Update Sub-Property
export const updateSubProperty = async (subPropertyId: number, payload: any): Promise<any> => {
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
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to update sub-property";
    console.error(
      "❌ Update sub-property error:",
      errorMsg
    );
    toast.error(errorMsg);
    throw err;
  }
};

// Delete Sub-Property
export const deleteSubProperty = async (subPropertyId: number): Promise<any> => {
  try {
    const token = getGuardToken();
    const res = await axios.delete(`${API_BASE}/sub/delete/${subPropertyId}`, {
      headers: { Authorization: `${token}` },
    });
    return res.data;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to delete sub-property";
    console.error(
      "❌ Delete sub-property error:",
      errorMsg
    );
    toast.error(errorMsg);
    throw err;
  }
};

// Get All Properties
export const getAllProperties = async (): Promise<Property[]> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "Error fetching properties";
    console.error(
      "Error fetching properties:",
      errorMsg
    );
    toast.error(errorMsg);
    return [];
  }
};

// Get single Property by ID
export const getPropertyById = async (propertyId: string | number): Promise<Property | null> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || `Error fetching property ${propertyId}`;
    console.error(
      `Error fetching property ${propertyId}:`,
      errorMsg
    );
    toast.error(errorMsg);
    return null;
  }
};

// Get Sub-properties for a main property
export const getSubProperties = async (parentId: string | number): Promise<SubProperty[]> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || `Error fetching subproperties for ${parentId}`;
    console.error(
      `Error fetching subproperties for ${parentId}:`,
      errorMsg
    );
    toast.error(errorMsg);
    return [];
  }
};

// Delete Property
export const deleteProperty = async (pid: number): Promise<{ success: boolean; message: string }> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "Error deleting property";
    console.error("Delete error:", errorMsg);
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  }
};

// Update Property - using direct axios call like sub-property update
export const updateProperty = async (id: number, payload: any): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    console.log("🔧 Property Update - ID:", id);
    console.log("🔧 Property Update - Payload type:", typeof payload);
    console.log("🔧 Property Update - Is FormData:", payload instanceof FormData);
    console.log("🔧 Property Update - Payload:", payload);
    
    const token = getGuardToken();
    
    // Use direct axios call like sub-property update does
    const response = await axios.patch(
      `${API_BASE}/update/${id}`,
      payload,
      {
        headers: { Authorization: `${token}` },
      }
    );

    console.log("✅ Property Update Response:", response);
    
    // Access the data from the Axios response
    const responseData = response.data;
    
    if (responseData && responseData.status === true) {
      toast.success("Property updated successfully.");
      return { success: true, data: responseData.data };
    } else {
      const msg =
        responseData?.message ||
        "Update failed: Backend responded with status false.";
      console.warn("⚠️ Server responded without status true:", msg);
      return { success: false, message: msg };
    }
  } catch (error: any) {
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
export const payForProperty = async (pid: number, payload: any): Promise<{ success: boolean; message: string }> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "Error processing payment for property";
    console.error("Pay error:", errorMsg);
    toast.error(errorMsg);
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Pay for Sub-Property
export const payForSubProperty = async (pid: number, sid: number, payload: any): Promise<{ success: boolean; message: string }> => {
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
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "Error processing sub-property payment";
    console.error("Sub-Property Pay error:", errorMsg);
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  }
};

// ✅ Get properties (alias for getAllProperties)
export const _getProperties = async (): Promise<Property[]> => {
  return await getAllProperties();
};

// ✅ Get hot/featured properties (filtered from all properties)
export const _getAllHotProperty = async (): Promise<Property[]> => {
  try {
    const allProperties = await getAllProperties();
    // You can filter based on your criteria for "hot" properties
    // For now, returning all properties. Adjust the filter as needed:
    return (
      allProperties.filter(
        (property) => property.isFeatured || property.isHot
      ) || allProperties
    );
  } catch (err: any) {
    const errorMsg = err.message || "Error fetching hot properties";
    console.error("❌ Get hot properties error:", errorMsg);
    toast.error(errorMsg);
    return [];
  }
};

// ✅ Get single property (alias for getPropertyById)
export const _getProperty = async (id: string | number): Promise<Property | null> => {
  return await getPropertyById(id);
};

// ✅ Get sub-property
export const _getSubProperty = async (propertyId: string | number, subPropertyId: string | number): Promise<SubProperty | null> => {
  return await fetchSubProperty(propertyId, subPropertyId);
};