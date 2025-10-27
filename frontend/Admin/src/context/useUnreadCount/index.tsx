import React, { createContext, useContext, useState, useEffect } from "react";
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

interface UnreadCountContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(undefined);

export const UnreadCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      // Check if we have a token before making the request
      const token = localStorage.getItem("business-token") ||
                    localStorage.getItem("authToken") ||
                    localStorage.getItem("guard-token");
      
      // Only fetch if we have a token
      if (token) {
        const res = await axios.get(`${API_BASE}/stats`, {
          headers: {
            Authorization: token,
          },
        });
        const {
          data: {
            data: { unread },
          },
        } = res;
        setUnreadCount(unread);
      }
    } catch (error) {
      // Only log error if it's not the expected "Auth token missing" error
      if (error instanceof Error && !error.message.includes("Auth token missing")) {
        console.error("Failed to fetch unread count:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up interval to refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  return (
    <UnreadCountContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = (): UnreadCountContextType => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error("useUnreadCount must be used within an UnreadCountProvider");
  }
  return context;
};