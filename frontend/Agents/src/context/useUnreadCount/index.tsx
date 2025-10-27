import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";

const getGuardToken = (): string => {
  const token = localStorage.getItem("$token_key");
  
  if (!token) {
    console.warn("🟡 No token found. Skipping unread count fetch.");
    return "";
  }
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
      const token = getGuardToken();
      
      // If no token, skip the request
      if (!token) {
        setLoading(false);
        return;
      }
      
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
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up an interval to refresh the count every 30 seconds
    const interval = setInterval(() => {
      // Only fetch if we're not already loading
      if (!loading) {
        fetchUnreadCount();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loading]);

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