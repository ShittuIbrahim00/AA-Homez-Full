// hooks/useAdminUnreadCount.ts
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";

const getGuardToken = (): string => {
  const token =
  localStorage.getItem("$token_key")

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

export const useAgentUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      const token = getGuardToken();
      const res = await axios.get(`${API_BASE}/notifications/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        data: {
          data: { unread },
        },
      } = res;

      setUnreadCount(unread);
    } catch (err) {
      console.error("🔴 Failed to fetch unread count:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up an interval to refresh the count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, loading, refreshUnreadCount: fetchUnreadCount };
};