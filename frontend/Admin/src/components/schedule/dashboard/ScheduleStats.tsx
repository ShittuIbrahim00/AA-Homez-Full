import React from "react";

interface ScheduleStatsProps {
  totalSchedules: number;
  pendingSchedules: number;
  approvedSchedules: number;
  declinedSchedules: number;
}

const ScheduleStats: React.FC<ScheduleStatsProps> = ({
  totalSchedules,
  pendingSchedules,
  approvedSchedules,
  declinedSchedules,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Schedule Overview</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{totalSchedules} total schedules</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-700">{pendingSchedules}</div>
            <div className="text-xs sm:text-sm font-medium text-yellow-600">Pending</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">{approvedSchedules}</div>
            <div className="text-xs sm:text-sm font-medium text-green-600">Approved</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-700">{declinedSchedules}</div>
            <div className="text-xs sm:text-sm font-medium text-red-600">Declined</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">{totalSchedules}</div>
            <div className="text-xs sm:text-sm font-medium text-blue-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStats;