import { useEffect, useState } from "react";
import { AgencySettings, AgencySettingsForm } from "@/types/settings";
import { getSettings, updateSettings } from "@/services/settings.service";
import { toast } from "react-toastify";

export const useAgencySettings = () => {
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSettings();
      console.log("🔧 Fetched settings data:", res.data);
      
      // Log specific fields to compare
      console.log("🔍 Fetched Name:", res.data?.name);
      console.log("🔍 Fetched Description:", res.data?.description);
      console.log("🔍 Fetched Location:", res.data?.location);
      
      setSettings(res.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load settings";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitSettings = async (form: Partial<AgencySettingsForm>) => {
    console.log("🔧 Submitting settings form:", form);
    
    // Validate required fields
    if (!form.name || form.name.trim() === "") {
      const errorMsg = "Agency name is required";
      setError(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Create partial update object with only the fields that are provided
    const updateData: any = {};
    
    // Only add fields that have values
    if (form.name !== undefined) updateData.name = form.name.trim();
    if (form.description !== undefined) updateData.description = form.description;
    if (form.location !== undefined) updateData.location = form.location;
    if (form.scheduleDays !== undefined) updateData.scheduleDays = form.scheduleDays;
    if (form.scheduleTime !== undefined) updateData.scheduleTime = form.scheduleTime;
    // For images, we'll send the actual file names for now (will be updated with real image handling)
    if (form.images !== undefined && form.images.length > 0) {
      // Convert File[] to string[] with file names
      updateData.images = form.images.map(file => file.name);
    }

    console.log("🔧 Constructed partial update data:", updateData);

    try {
      setSaving(true);
      setError(null);
      const updateResult = await updateSettings(updateData);
      console.log("🔧 Update result:", updateResult);
      console.log("🔍 Update Result Name:", updateResult?.data?.name);
      console.log("🔍 Update Result Description:", updateResult?.data?.description);
      console.log("🔍 Update Result Location:", updateResult?.data?.location);
      
      // Add a delay before fetching to ensure backend has time to process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("🔧 Refreshing settings after update...");
      await fetchSettings(); // Refresh settings after update
      toast.success("Settings updated successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to save settings";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      console.error("Failed to save settings:", err);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, saving, error, submitSettings, refetch: fetchSettings };
};