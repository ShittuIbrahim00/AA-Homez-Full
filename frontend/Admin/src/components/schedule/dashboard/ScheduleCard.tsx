import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

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

interface ScheduleCardProps {
  schedule: Schedule;
  onView: (schedule: Schedule) => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onReschedule: (id: number) => void;
  statusColor: (status: string) => string;
  formatDateTime: (dateStr: string, timeStr: string) => string;
  getInitials: (name: string) => string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onView,
  onApprove,
  onDecline,
  onReschedule,
  statusColor,
  formatDateTime,
  getInitials,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      key={schedule.scid}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 w-full property-card"
    >
      <div className="relative w-full h-40 sm:h-48">
        <Image
          src={schedule.Property?.image || "/default-schedule.jpg"}
          alt={schedule.Property?.name || "Property"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span
            className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${statusColor(
              schedule.status
            )}`}
          >
            {schedule.status}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
          {schedule.Agent?.avatar ? (
            <div className="relative flex-shrink-0">
              <Image
                src={schedule.Agent.avatar}
                alt={schedule.Agent.fullName || "Agent"}
                width={40}
                height={40}
                className="rounded-full border-2 border-white shadow-sm"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs sm:text-base font-bold shadow-sm">
              {getInitials(schedule.Agent?.fullName || schedule.clientName || "Unknown")}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              {schedule.Agent?.fullName || schedule.clientName || "Unknown"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {schedule.Agent?.rank || "Agent"}
            </p>
          </div>
        </div>
      
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {schedule.Property?.name || "Unknown Property"}
          </h3>
          {schedule.SubProperty?.name && (
            <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
              {schedule.SubProperty.name}
            </p>
          )}
        </div>
      
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
          <div className="flex items-center text-xs sm:text-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="truncate font-medium">{schedule.clientName}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span className="truncate">{schedule.clientPhone}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="truncate">{formatDateTime(schedule.date, schedule.time)}</span>
          </div>
        </div>
      
        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
            <span className="font-semibold">Details:</span> {schedule.title}
          </p>
        </div>

        {/* Action Buttons with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm flex items-center justify-center gap-2"
            aria-label="Actions"
            aria-haspopup="true"
            aria-expanded={openDropdown}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            <span>Actions</span>
          </button>

          {openDropdown && (
            <div 
              className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                onClick={() => {
                  onView(schedule);
                  closeDropdown();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View Details
              </button>

              {schedule.status.toLowerCase() === "pending" && (
                <>
                  <button
                    onClick={() => {
                      onApprove(schedule.scid);
                      closeDropdown();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      onDecline(schedule.scid);
                      closeDropdown();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      onReschedule(schedule.scid);
                      closeDropdown();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Reschedule
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;