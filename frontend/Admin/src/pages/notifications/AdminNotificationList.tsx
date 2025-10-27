"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import NotificationCard from "./NotificationCard";
import Spinner from "@/components/Custom/Spinner";

type FilterType = "all" | "unread" | "commission" | "system" | "profile";

const FILTER_OPTIONS: FilterType[] = ["all", "unread", "commission", "system", "profile"];

export default function AdminNotificationList() {
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
  } = useAdminNotifications(page);

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

  return (
    <div className="w-full px-4 md:py-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              unreadCount === 0 || markAllLoading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {markAllLoading ? (
              <span className="flex items-center">
                <div className="mr-2">
                  <Spinner size="sm" />
                </div>
                Marking all...
              </span>
            ) : (
              "Mark all as read"
            )}
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <nav className="flex gap-2 mb-6 flex-wrap" aria-label="Notification filters">
        {FILTER_OPTIONS.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === type
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
            aria-pressed={filter === type}
          >
            {type}
          </button>
        ))}
      </nav>

      {/* Notifications List */}
      <section className="grid gap-4" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-medium">Error loading notifications</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-gray-500">Try changing your filter or check back later</p>
          </div>
        ) : (
          filteredList.map((n) => (
            <NotificationCard
              key={`${n.sid}-${n.createdAt}`}
              notification={n}
              onMarkAsRead={() => handleMarkedAsRead(n.sid)}
              isMarking={markingRead}
              deleteNotification={deleteNotification}
            />
          ))
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex justify-between items-center mt-8 border-t border-gray-200 pt-6" aria-label="Pagination">
          <button
            onClick={() => {
              const newPage = Math.max(page - 1, 1);
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage <= 1 || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              currentPage <= 1 || loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-disabled={currentPage <= 1 || loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          
          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </div>
          
          <button
            onClick={() => {
              const newPage = Math.min(page + 1, totalPages);
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage >= totalPages || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              currentPage >= totalPages || loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-disabled={currentPage >= totalPages || loading}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}