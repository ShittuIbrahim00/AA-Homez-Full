import React from "react";
import ScheduleCard from "./ScheduleCard";

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

interface ScheduleCardViewProps {
  schedules: Schedule[];
  onView: (schedule: Schedule) => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onReschedule: (id: number) => void;
  statusColor: (status: string) => string;
  formatDateTime: (dateStr: string, timeStr: string) => string;
  getInitials: (name: string) => string;
}

const ScheduleCardView: React.FC<ScheduleCardViewProps> = ({
  schedules,
  onView,
  onApprove,
  onDecline,
  onReschedule,
  statusColor,
  formatDateTime,
  getInitials,
}) => {
  return (
    // Fixed responsive grid layout with proper container constraints
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-8 w-full">
      {schedules.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No schedules found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      )}
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.scid}
          schedule={schedule}
          onView={onView}
          onApprove={onApprove}
          onDecline={onDecline}
          onReschedule={onReschedule}
          statusColor={statusColor}
          formatDateTime={formatDateTime}
          getInitials={getInitials}
        />
      ))}
    </div>
  );
};

export default ScheduleCardView;