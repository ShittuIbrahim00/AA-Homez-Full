import React, { useState, useRef, useEffect, useCallback } from "react";
import ActionDropdown from "./ActionDropdown";

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

interface ScheduleTableProps {
  schedules: Schedule[];
  onView: (schedule: Schedule) => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onReschedule: (id: number) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onView,
  onApprove,
  onDecline,
  onReschedule,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);


  

  const statusColor = useCallback((status: string) => {
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
  }, []);

  const toggleDropdown = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  }, [openDropdownId]);

  const closeDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside any dropdown
      const dropdowns = document.querySelectorAll('.schedule-action-dropdown');
      let clickedInsideDropdown = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target as Node)) {
          clickedInsideDropdown = true;
        }
      });
      
      if (!clickedInsideDropdown && openDropdownId !== null) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, closeDropdown]);

  // Memoized action handlers
  const handleView = useCallback((schedule: Schedule) => {
    onView(schedule);
  }, [onView]);

  const handleApprove = useCallback((scid: number) => {
    onApprove(scid);
  }, [onApprove]);

  const handleDecline = useCallback((scid: number) => {
    onDecline(scid);
  }, [onDecline]);

  const handleReschedule = useCallback((scid: number) => {
    onReschedule(scid);
  }, [onReschedule]);

  return (
    <div className="w-full relative">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                Property
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                Client
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                Date & Time
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.scid} className="hover:bg-gray-50 transition-colors">
                {/* Agent */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap">
                  <div className="flex items-center">
                    {schedule.Agent?.avatar ? (
                      <img
                        src={schedule.Agent.avatar}
                        alt={schedule.Agent.fullName || "Agent"}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold mr-2">
                        {schedule.Agent?.fullName
                          ? schedule.Agent.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "N/A"}
                      </div>
                    )}
                    <div className="truncate max-w-[100px] sm:max-w-[150px]">
                      <div className="font-medium text-gray-900 truncate">
                        {schedule.Agent?.fullName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">{schedule.Agent?.rank || "Agent"}</div>
                    </div>
                  </div>
                </td>

                {/* Property */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">
                  <div className="truncate max-w-[120px] sm:max-w-[150px]">
                    <div className="font-medium text-gray-900 truncate">{schedule.Property?.name || "N/A"}</div>
                    {schedule.SubProperty?.name && (
                      <div className="text-xs text-gray-500 truncate mt-1">{schedule.SubProperty.name}</div>
                    )}
                  </div>
                </td>

                {/* Client */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                  <div className="font-medium text-gray-900 truncate max-w-[100px]">{schedule.clientName}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[100px]">{schedule.clientPhone}</div>
                </td>

                {/* Date & Time */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                  <div className="font-medium">{new Date(schedule.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{schedule.time}</div>
                </td>

                {/* Status */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3 text-xs sm:text-sm whitespace-nowrap relative">
                  <div className="relative">
                    <button
                      onClick={(e) => toggleDropdown(schedule.scid, e)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Actions"
                      aria-haspopup="true"
                      aria-expanded={openDropdownId === schedule.scid}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                {openDropdownId === schedule.scid && (
  <div className="schedule-action-dropdown fixed top-auto left-auto z-[9999] mt-2 bg-white shadow-lg border rounded-md">
    <ActionDropdown
      schedule={schedule}
      onView={handleView}
      onApprove={handleApprove}
      onDecline={handleDecline}
      onReschedule={handleReschedule}
      onClose={closeDropdown}
    />
  </div>
)}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;