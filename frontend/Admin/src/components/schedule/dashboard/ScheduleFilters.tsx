import React from "react";

interface ScheduleFiltersProps {
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
  filterAgent: string;
  setFilterAgent: (value: string) => void;
  filterProperty: string;
  setFilterProperty: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  loading: boolean;
  totalSchedules: number;
  displayedSchedules: number;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  viewMode,
  setViewMode,
  filterAgent,
  setFilterAgent,
  filterProperty,
  setFilterProperty,
  filterStatus,
  setFilterStatus,
  loading,
  totalSchedules,
  displayedSchedules,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <button
            onClick={() => setViewMode("card")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              viewMode === "card"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium border-l border-gray-300 transition-colors ${
              viewMode === "table"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Table View
          </button>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          Showing <span className="font-semibold">{displayedSchedules}</span> of <span className="font-semibold">{totalSchedules}</span> schedules
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input
            type="text"
            placeholder="Filter by Agent name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition"
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Property Name</label>
          <input
            type="text"
            placeholder="Filter by Property name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTQgNmw0IDQgNCA0Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] sm:bg-[right_0.75rem_center]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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

export default ScheduleFilters;