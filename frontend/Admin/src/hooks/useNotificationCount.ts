// hooks/useAdminUnreadCount.ts
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = `${API_URL}/notifications/business`;

const getGuardToken = (): string => {
  const token =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

export const useAdminUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getGuardToken();

        const res = await axios.get(`${API_BASE}/stats`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        console.log(res.data.data.unread); // For debugging

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

    fetchUnreadCount();
  }, []);

  return { unreadCount, loading };
};
