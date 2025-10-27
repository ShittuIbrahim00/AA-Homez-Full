import { useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { Notification, NotificationResponse } from "@/types/notification";
import { useUnreadCount } from "@/context/useUnreadCount";
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

export const useAdminNotifications = (page: number = 1) => {
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

        const res = await axios.get<NotificationResponse>(`${API_BASE}?page=${page}`, {
          headers: {
            Authorization: token,
          },
        });
// console.log(res)
        const {
          data: {
            data: { notifications, total, unreadCount, totalPages, page: currentPage },
          },
        } = res;

        const sorted = [...notifications].sort(
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
        `${API_BASE}/${sid}/read`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) => (n.sid === sid ? { ...n, isRead: true } : n))
      );
      // Update unread count accordingly
      setUnreadCount((count) => Math.max(count - 1, 0));
      toast.success("Notification marked as read");
      // Refresh the global unread count
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
      await axios.patch(`${API_BASE}/read-all`, {}, {
        headers: { Authorization: token },
      });

      // Update all notifications locally
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      // Refresh the global unread count
      refreshUnreadCount();
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    } finally {
      setMarkAllLoading(false);
    }
  };


  const deleteNotification = async (sid: number) => {
  try {
    const token = getGuardToken();

    await axios.delete(`${API_BASE}/${sid}`, {
      headers: { Authorization: token },
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
    refreshUnreadCount();
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