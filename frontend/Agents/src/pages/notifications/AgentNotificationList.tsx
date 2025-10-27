"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAgentNotifications } from "@/hooks/useAgenNotifications";
import NotificationCard from "./NotificationCard";
import Spinner from "./Spinner";

type FilterType = "all" | "unread" | "commission" | "system" | "profile";

const FILTER_OPTIONS: FilterType[] = [
  "all",
  "unread",
  "commission",
  "system",
  "profile",
];

export default function AgentNotificationList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");

  const {
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
  } = useAgentNotifications(page);

  const [filteredList, setFilteredList] = useState(notifications);

  useEffect(() => {
    setFilteredList(
      notifications.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.isRead;
        return n.data?.type === filter;
      })
    );
  }, [notifications, filter]);

  const handleMarkedAsRead = useCallback(
    async (sid: number) => {
      if (!markingRead) {
        await markAsRead(sid);
      }
    },
    [markAsRead, markingRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!markAllLoading && unreadCount > 0) {
      await markAllAsRead();
    }
  }, [markAllAsRead, markAllLoading, unreadCount]);

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full px-4 py-6 ">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                <span>{unreadCount} unread</span>
              </span>
            ) : (
              "All caught up!"
            )}
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markAllLoading}
          className={`px-3 py-1 rounded text-white text-sm flex items-center gap-1 ${
            unreadCount === 0 || markAllLoading
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {markAllLoading ? (
            <>
              <Spinner className="w-3 h-3" />
              Marking all...
            </>
          ) : (
            "Mark all as read"
          )}
        </button>
      </header>

      {/* Filter Tabs */}
      <nav
        className="flex gap-2 mb-4 flex-wrap"
        aria-label="Notification filters"
      >
        {FILTER_OPTIONS.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-sm capitalize flex items-center gap-1 ${
              filter === type
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            aria-pressed={filter === type}
          >
            {type === "unread" && unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-blue-500 rounded-full">
                {unreadCount}
              </span>
            )}
            {type}
          </button>
        ))}
      </nav>

      {/* Notifications List */}
      <section className="grid gap-4" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredList.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          filteredList.map((n) => (
            <NotificationCard
              key={`${n.sid}-${n.createdAt}`}
              notification={n}
              onMarkAsRead={() => handleMarkedAsRead(n.sid)}
              isMarking={markingRead}
              deleteNotification={deleteNotification} // Make sure this prop is defined or remove it
            />
          ))
        )}
      </section>

      {/* Pagination Controls */}
      <nav
        className="flex justify-between items-center mt-6"
        aria-label="Pagination"
      >
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1 || loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage <= 1 || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
          aria-disabled={currentPage <= 1 || loading}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages || loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage >= totalPages || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
          aria-disabled={currentPage >= totalPages || loading}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
