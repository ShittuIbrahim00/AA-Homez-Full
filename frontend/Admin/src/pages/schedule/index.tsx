"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import {
  getAllSchedules,
  updateScheduleStatus,
  rescheduleSchedule,
} from "@/hooks/schedule.hooks";
import { useScheduler } from "@/context/scheduler";
import Spinner from "@/components/Custom/Spinner";
import ScheduleTable from "@/components/schedule/ScheduleTable";
import ScheduleStats from "@/components/schedule/dashboard/ScheduleStats";
import ScheduleFilters from "@/components/schedule/dashboard/ScheduleFilters";
import ScheduleCardView from "@/components/schedule/dashboard/ScheduleCardView";
import SchedulePagination from "@/components/schedule/dashboard/SchedulePagination";
import ScheduleCalendar from "@/components/schedule/dashboard/ScheduleCalendar";
import RescheduleModal from "@/components/schedule/dashboard/RescheduleModal";
import DetailsModal from "@/components/schedule/dashboard/DetailsModal";
import SuccessModal from "@/components/schedule/dashboard/SuccessModal";
import { toastError, toastSuccess } from "@/utils/toastMsg";

const localizer = momentLocalizer(moment);

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

export default function AdminScheduleDashboard() {
  const { refreshPendingCount } = useScheduler();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [displayedSchedules, setDisplayedSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean;
    scheduleId?: number;
  }>({ open: false });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    schedule?: Schedule;
  }>({ open: false });

  const [filterAgent, setFilterAgent] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchSchedules = async () => {
    // console.log('🔄 Fetching schedules...');
    setLoading(true);
    setError(null);
    try {
      const allSchedules = await getAllSchedules();
      // console.log('✅ Fetched schedules:', allSchedules);
      setSchedules(allSchedules);
      setDisplayedSchedules(allSchedules.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    // console.log('📅 Schedule dashboard mounted');
    fetchSchedules();
  }, []);


  useEffect(() => {

    const filtered = schedules.filter(
      (s) =>
        (s.Agent?.fullName || s.clientName || "")
          .toLowerCase()
          .includes(filterAgent.toLowerCase()) &&
        (s.Property?.name || "")
          .toLowerCase()
          .includes(filterProperty.toLowerCase()) &&
        (filterStatus
          ? s.status.toLowerCase() === filterStatus.toLowerCase()
          : true)
    )
    // Sort by createdAt date, latest first
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // console.log('📊 Filtered schedules:', filtered);
    
    // Calculate total pages
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(total > 0 ? total : 1);
    
    // Get items for current page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedSchedules = filtered.slice(startIndex, endIndex);
    // console.log('📄 Paged schedules:', pagedSchedules);
    setDisplayedSchedules(pagedSchedules);
  }, [schedules, filterAgent, filterProperty, filterStatus, page]);

  // Calculate filtered schedules for display
  const filteredSchedules = displayedSchedules;

  const loadMore = () => {
    const nextPage = page + 1;
    const filtered = schedules.filter(
      (s) =>
        (s.Agent?.fullName || s.clientName || "")
          .toLowerCase()
          .includes(filterAgent.toLowerCase()) &&
        (s.Property?.name || "")
          .toLowerCase()
          .includes(filterProperty.toLowerCase()) &&
        (filterStatus
          ? s.status.toLowerCase() === filterStatus.toLowerCase()
          : true)
    );
    const newItems = filtered.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedSchedules(newItems);
    setPage(nextPage);
  };

  const handleApprove = async (id: number) => {
    const { success } = await updateScheduleStatus(id, "approved");
    if (success) {
      toastSuccess("Schedule approved");
      fetchSchedules();
      refreshPendingCount(); // Refresh the pending count in the context
    } else {
      toastError("Failed to approve schedule");
    }
  };

  const handleDecline = async (id: number) => {
    const { success } = await updateScheduleStatus(id, "declined");
    if (success) {
      toastSuccess("Schedule declined");
      fetchSchedules();
      refreshPendingCount(); // Refresh the pending count in the context
    } else {
      toastError("Failed to decline schedule");
    }
  };

  const openRescheduleModal = (id: number) => {
    setRescheduleModal({ open: true, scheduleId: id });
    setNewDate("");
    setNewTime("");
  };

  const submitReschedule = async () => {
    if (!newDate || !newTime) {
      return toastError("Please enter both date and time");
    }

    setIsSubmitting(true); // start loading spinner

    const { success } = await rescheduleSchedule(
      rescheduleModal.scheduleId!,
      newDate,
      newTime
    );

    setIsSubmitting(false); // stop spinner

    if (success) {
      toastSuccess("Schedule rescheduled successfully"); // Updated message
      setSuccessModal(true); // open success modal
      fetchSchedules(); // refresh the schedule list
      refreshPendingCount(); // Refresh the pending count in the context
      setRescheduleModal({ open: false }); // close the reschedule modal

      setTimeout(() => {
        setSuccessModal(false); // auto-close success modal after 3s
      }, 3000);
    } else {
      toastError("Failed to reschedule");
    }
  };

  const openDetailsModal = (schedule: Schedule) => {
    setDetailsModal({ open: true, schedule });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ open: false, schedule: undefined });
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    return moment(`${dateStr.split("T")[0]}T${timeStr}`).format(
      "MMM D, YYYY [at] h:mm A"
    );
  };

  const formatISODate = (isoStr: string) => {
    return moment(isoStr).format("MMM D, YYYY h:mm A");
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#facc15";
    if (event.status.toLowerCase() === "approved") backgroundColor = "#16a34a";
    if (event.status.toLowerCase() === "declined") backgroundColor = "#dc2626";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "6px",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="w-full ">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
          Schedule Management
        </h1>

        {/* Stats Bar */}
        <ScheduleStats
          totalSchedules={schedules.length}
          pendingSchedules={schedules.filter(s => s.status.toLowerCase() === "pending").length}
          approvedSchedules={schedules.filter(s => s.status.toLowerCase() === "approved").length}
          declinedSchedules={schedules.filter(s => s.status.toLowerCase() === "declined").length}
        />

        {/* View Toggle and Filters */}
        <ScheduleFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterAgent={filterAgent}
          setFilterAgent={setFilterAgent}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          loading={loading}
          totalSchedules={schedules.length}
          displayedSchedules={displayedSchedules.length}
        />

        {loading && (
          <div className="flex justify-center my-6 sm:my-8">
            <Spinner size="md" />
          </div>
        )}
        {error && <p className="text-center text-red-600 py-4">{error}</p>}

        {/* Conditional rendering based on view mode */}
        {!loading && !error && (
          <>
            {viewMode === "card" ? (
              <ScheduleCardView
                schedules={filteredSchedules}
                onView={openDetailsModal}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onReschedule={openRescheduleModal}
                statusColor={statusColor}
                formatDateTime={formatDateTime}
                getInitials={getInitials}
              />
            ) : (
              // Table View
              <div className="mb-6 sm:mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="schedule-table-container w-full overflow-x-auto">
                  <ScheduleTable
                    schedules={filteredSchedules}
                    onView={openDetailsModal}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    onReschedule={openRescheduleModal}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination Controls and Calendar - properly contained */}
        {!loading && !error && (
          <div className="w-full">
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <SchedulePagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                displayedSchedules={displayedSchedules.length}
              />
            )}

            {/* Calendar View */}
            <ScheduleCalendar
              schedules={filteredSchedules}
              openDetailsModal={openDetailsModal}
              eventStyleGetter={eventStyleGetter}
            />
          </div>
        )}

        {/* Reschedule Modal */}
        <RescheduleModal
          isOpen={rescheduleModal.open}
          onClose={() => setRescheduleModal({ open: false })}
          newDate={newDate}
          setNewDate={setNewDate}
          newTime={newTime}
          setNewTime={setNewTime}
          onSubmit={submitReschedule}
          isSubmitting={isSubmitting}
        />

        <DetailsModal
          isOpen={detailsModal.open}
          onClose={closeDetailsModal}
          schedule={detailsModal.schedule}
          formatISODate={formatISODate}
        />
        
        <SuccessModal
          isOpen={successModal}
          onClose={() => setSuccessModal(false)}
        />
      </div>
    </div>
  );
}
