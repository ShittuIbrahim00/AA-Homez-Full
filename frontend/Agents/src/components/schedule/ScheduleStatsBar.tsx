import React from "react";

interface ScheduleStatsBarProps {
  totalSchedules: number;
  pendingCount: number;
  approvedCount: number;
  declinedCount: number;
}

const ScheduleStatsBar = ({ 
  totalSchedules, 
  pendingCount, 
  approvedCount, 
  declinedCount 
}: ScheduleStatsBarProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Schedules</h2>
          <p className="text-sm text-gray-500">{totalSchedules} total schedules</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingCount} Pending
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {approvedCount} Approved
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {declinedCount} Declined
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStatsBar;