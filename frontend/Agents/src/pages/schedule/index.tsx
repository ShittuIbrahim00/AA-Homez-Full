"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
import Spinner from "@/layouts/Loader";
import ScheduleDetailsModal from "@/components/schedule/ScheduleDetailsModal";
import ScheduleStatsBar from "@/components/schedule/ScheduleStatsBar";
import ViewToggleFilters from "@/components/schedule/ViewToggleFilters";
import ScheduleSettingsBanner from "@/components/schedule/ScheduleSettingsBanner";
import PaginationControls from "@/components/schedule/PaginationControls";
import ScheduleCalendarView from "@/components/schedule/ScheduleCalendarView";

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface Schedule {
  scid: number;
  uid: number;
  aid: number;
  sid: number | null;
  pid: number | null;
  clientName: string;
  clientPhone: string;
  title: string;
  date: string;
  time: string;
  start: string;
  end: string;
  status: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Agent?: { fullName?: string; phone?: string; rank?: string; avatar?: string };
  Property?: { name?: string; image?: string; mapLink?: string };
  SubProperty?: { name?: string; mapLink?: string };
}

const ITEMS_PER_PAGE = 8;

export default function AgentScheduleDashboard() {
  const { toastError } = useResponsiveToast();
  const [agentId, setAgentId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [displayedSchedules, setDisplayedSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    schedule?: Schedule;
  }>({ open: false });

  const [filterProperty, setFilterProperty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchSchedules = async () => {
    if (!agentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://aa-homez.onrender.com/api/v1/schedule/agent",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("$token_key")}`,
          },
        }
      );

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setSchedules(result.data);
        setDisplayedSchedules(result.data.slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } else {
        throw new Error("Invalid schedule data");
      }
    } catch (err) {
      console.error("Error fetching or parsing schedules:", err);
      toastError("Failed to fetch schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const idStr = localStorage.getItem("$agent_id");
      const id = idStr ? Number(idStr) : null;

      if (!id) {
        toastError("Agent ID not found. Please login.");
        setLoading(false);
        return;
      }

      setAgentId(id);
    }
  }, [toastError]);

  useEffect(() => {
    fetchSchedules();
  }, [agentId]);

  // Add useEffect to update displayed schedules when filters or page changes
  useEffect(() => {
    const filtered = schedules.filter(
      (s) =>
        (s.Property?.name || "")
          .toLowerCase()
          .includes(filterProperty.toLowerCase()) &&
        (filterStatus
          ? (typeof s.status === 'string' && s.status.toLowerCase() === filterStatus.toLowerCase())
          : true)
    )
    // Sort by createdAt date, latest first
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Calculate total pages
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(total > 0 ? total : 1);
    
    // Get items for current page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedSchedules(filtered.slice(startIndex, endIndex));
  }, [schedules, filterProperty, filterStatus, page]);

  const openDetailsModal = (schedule: Schedule) => {
    setDetailsModal({ open: true, schedule });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ open: false, schedule: undefined });
  };

  const statusColor = (status: any) => {
    // Ensure status is a string before calling toLowerCase
    const statusString = typeof status === 'string' ? status : '';
    switch (statusString.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    // Check if timeStr is in the format of minutes (e.g., "600", "720", "840")
    if (/^\d+$/.test(timeStr)) {
      // Convert minutes to HH:MM format
      const minutes = parseInt(timeStr, 10);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      return new Date(`${dateStr.split("T")[0]}T${formattedTime}`).toLocaleString(
        "en-US", 
        { 
          month: "short", 
          day: "numeric", 
          year: "numeric", 
          hour: "numeric", 
          minute: "2-digit" 
        }
      );
    }
    
    // If it's already in HH:MM format, use it as is
    return new Date(`${dateStr.split("T")[0]}T${timeStr}`).toLocaleString(
      "en-US", 
      { 
        month: "short", 
        day: "numeric", 
        year: "numeric", 
        hour: "numeric", 
        minute: "2-digit" 
      }
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
         My Schedules
        </h1>
        
        <ScheduleSettingsBanner />

        <ScheduleStatsBar 
          totalSchedules={schedules.length}
          pendingCount={schedules.filter(s => typeof s.status === 'string' && s.status.toLowerCase() === "pending").length}
          approvedCount={schedules.filter(s => typeof s.status === 'string' && s.status.toLowerCase() === "approved").length}
          declinedCount={schedules.filter(s => typeof s.status === 'string' && s.status.toLowerCase() === "declined").length}
        />

        <ViewToggleFilters
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalSchedules={schedules.length}
          displayedSchedules={displayedSchedules.length}
          filterProperty={filterProperty}
          onFilterPropertyChange={setFilterProperty}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          loading={loading}
        />

        {loading && (
          <div className="flex justify-center my-6">
            <Spinner />
          </div>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Conditional rendering based on view mode */}
        {viewMode === "card" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {!loading && displayedSchedules.length === 0 && (
              <p className="text-center col-span-full text-gray-600">
                No schedules found.
              </p>
            )}
            {displayedSchedules.map((s) => (
              <div
                key={s.scid}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={s.Property?.image || "/default-schedule.jpg"}
                    alt={s.Property?.name || "Property"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {s.Agent?.avatar ? (
                      <Image
                        src={s.Agent.avatar}
                        alt={s.Agent.fullName || "Agent"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white text-sm font-semibold">
                        {getInitials(s.Agent?.fullName || s.clientName || "Unknown")}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-gray-900 truncate">
                        {s.clientName || "Unknown Client"}
                      </h2>
                      <p className="text-xs text-gray-500 truncate">
                        Client
                      </p>
                    </div>
                  </div>
                
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {s.Property?.name || "Unknown Property"}
                    </h3>
                    {s.SubProperty?.name && (
                      <p className="text-sm text-gray-600 truncate">
                        {s.SubProperty.name}
                      </p>
                    )}
                  </div>
                
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="truncate">{s.clientName}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span className="truncate">{s.clientPhone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="truncate">{formatDateTime(s.date, s.time)}</span>
                    </div>
                  </div>
                
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <span className="font-medium">Details:</span> {s.title}
                    </p>
                  </div>

                  {/* Property Navigation Links */}
                  <div className="mb-3">
                    {s.pid && (
                      <a href={`/properties/${s.pid}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium inline-flex items-center mr-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        View Property
                      </a>
                    )}
                    {s.sid && s.pid && (
                      <a href={`/properties/${s.pid}/sub/${s.sid}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        View Sub-Property
                      </a>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openDetailsModal(s)}
                      className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View (simplified for agent view)
          <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No schedules found
                      </td>
                    </tr>
                  ) : (
                    displayedSchedules.map((schedule) => (
                      <tr key={schedule.scid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white text-sm font-semibold">
                                {getInitials(schedule.clientName || "Unknown")}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{schedule.clientName}</div>
                              <div className="text-sm text-gray-500">{schedule.clientPhone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{schedule.Property?.name || "Unknown Property"}</div>
                          {schedule.SubProperty?.name && (
                            <div className="text-sm text-gray-500">{schedule.SubProperty.name}</div>
                          )}
                          {/* Property Navigation Links in Table View */}
                          <div className="mt-1">
                            {schedule.pid && (
                              <a href={`/properties/${schedule.pid}`} className="text-orange-600 hover:text-orange-800 text-xs font-medium inline-flex items-center mr-2">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Property
                              </a>
                            )}
                            {schedule.sid && schedule.pid && (
                              <a href={`/properties/${schedule.pid}/sub/${schedule.sid}`} className="text-orange-600 hover:text-orange-800 text-xs font-medium inline-flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Sub-Property
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(schedule.date, schedule.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(schedule.status)}`}>
                            {schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openDetailsModal(schedule)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      
        <div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={schedules.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          )}

          {/* Calendar View */}
          <ScheduleCalendarView 
            schedules={displayedSchedules} 
            onEventClick={openDetailsModal} 
          />

          {/* Details Modal */}
          <ScheduleDetailsModal 
            open={detailsModal.open} 
            schedule={detailsModal.schedule} 
            onClose={closeDetailsModal} 
          />
        </div>
      </div>
    </div>
  );
}