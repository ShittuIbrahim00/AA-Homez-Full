// hooks/useFetchProperty.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Property } from "@/types/property"; // adjust path if needed

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = `${API_URL}/property`;

const getGuardToken = (): string => {
  const token =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

export const useFetchProperty = (propertyId: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchProperty = async (source = "initial") => {
    if (!propertyId) return;

    // Prevent rapid successive fetches (debounce)
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${API_BASE}/${propertyId}`, {
        headers: {
          Authorization: getGuardToken(),
        },
      });
      console.log(res.data.data)
      console.log(res.data.data.
SubProperties
)

      setProperty(res.data.data);
      setLastFetchTime(now);      
    } catch (err: any) {
      console.error("Error fetching property:", err);
      setError("Failed to load property");
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  // Refetch function to manually trigger data refresh
  const refetch = (source = "manual") => {
    fetchProperty(source);
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty("mount");
    }
  }, [propertyId]); // Only depend on propertyId, not the function

  return { property, loading, error, refetch };
};
