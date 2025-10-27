import React from "react";

interface ViewToggleFiltersProps {
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
  totalSchedules: number;
  displayedSchedules: number;
  filterProperty: string;
  onFilterPropertyChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  loading: boolean;
}

const ViewToggleFilters = ({ 
  viewMode, 
  onViewModeChange,
  totalSchedules,
  displayedSchedules,
  filterProperty,
  onFilterPropertyChange,
  filterStatus,
  onFilterStatusChange,
  loading
}: ViewToggleFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      {/* View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => onViewModeChange("card")}
            className={`px-4 py-2 text-sm font-medium ${
              viewMode === "card"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
              viewMode === "table"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Table View
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {displayedSchedules} of {totalSchedules} schedules
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Filter by Property name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={filterProperty}
            onChange={(e) => onFilterPropertyChange(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="sm:w-40">
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            disabled={loading}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ViewToggleFilters;