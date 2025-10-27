import { useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { Notification, NotificationResponse } from "@/types/notification";
import { useUnreadCount } from "@/context/useUnreadCount";
import { log } from "console";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";

const getGuardToken = (): string => {
  const token =
   localStorage.getItem("$token_key")

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

export const useAgentNotifications = (page: number = 1) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const { refreshUnreadCount } = useUnreadCount();
  
  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = getGuardToken();

        const res = await axios.get(`${API_BASE}/notifications?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(res)
        const {
          data,
          pagination: { total, pages: totalPages, page: currentPage },
          unreadCount,
        } = res.data;

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(sorted);
        setTotal(total);
        setUnreadCount(unreadCount);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setError(null);
      } catch (err: any) {
        console.error("🔴 Notification fetch error:", err);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  // Mark a single notification as read
  const markAsRead = async (sid: number) => {
    try {
       setMarkingRead(true);
      const token = getGuardToken();

      await axios.patch(
        `${API_BASE}/notifications/${sid}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) => (n.sid === sid ? { ...n, isRead: true } : n))
      );
      // Update unread count accordingly
      setUnreadCount((count) => Math.max(count - 1, 0));
      toast.success("Notification marked as read");
      refreshUnreadCount();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    } finally {
      setMarkingRead(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setMarkAllLoading(true);
      const token = getGuardToken();
      await axios.patch(`${API_BASE}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update all notifications locally
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      refreshUnreadCount(); // Refresh the global unread count
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    } finally {
      setMarkAllLoading(false);
    }
  };

  const deleteNotification = async (sid: number) => {
  try {
    const token = getGuardToken();

    await axios.delete(`${API_BASE}/notifications/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove deleted notification from local state
    setNotifications((prev) => prev.filter((n) => n.sid !== sid));

    // Optionally update unread count if the deleted notification was unread
    setUnreadCount((count) => {
      const deletedNotif = notifications.find(n => n.sid === sid);
      if (deletedNotif && !deletedNotif.isRead) {
        return Math.max(count - 1, 0);
      }
      return count;
    });

    toast.success("Notification deleted");
    refreshUnreadCount(); // Refresh the global unread count
  } catch (error) {
    toast.error("Failed to delete notification");
  }
};

   return {
    notifications,
    unreadCount,
    loading,
    error,
    totalPages,
    currentPage,
    markAsRead,
    markAllAsRead,
    markingRead,
    markAllLoading,
      deleteNotification,
  };
};