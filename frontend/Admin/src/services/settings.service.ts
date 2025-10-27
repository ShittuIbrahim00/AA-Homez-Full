import apiClient from "./apiClient";

export const getSettings = async () => {
  try {
    // Add cache-busting to ensure we get fresh data
    const res = await apiClient.get(`settings?t=${Date.now()}`);
    console.log("🔧 Settings Fetch Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateSettings = async (payload: any) => {
  try {
    console.log("🔧 Settings Update - Sending JSON data:", payload);
    
    // Use PATCH method with JSON data for partial updates
    console.log("🔧 Trying PATCH method with JSON data for settings update...");
    const res = await apiClient.patch("settings", payload);
    
    console.log("✅ Settings Update Response:", res.data);
    
    // Add a small delay before returning to ensure backend processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return res.data;
  } catch (error: any) {
    console.error("❌ Error updating settings:", error.response?.data || error.message);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error headers:", error.response?.headers);
    throw error;
  }
};