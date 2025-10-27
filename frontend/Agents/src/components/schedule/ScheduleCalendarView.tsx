import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const scheduleSettings = {
  scheduleTime: [480, 600, 720, 840] // 8:00, 10:00, 12:00, 14:00 (2-hour intervals)
};

// Convert minutes to time format (HH:MM)
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const CustomAgendaEvent = ({ event }: any) => (
  <div className="space-y-1 py-1">
    <p className="font-semibold text-main-primary text-sm">
       <span className="font-medium">Client:</span> {event.clientName}
    </p>
    <p className="text-xs text-gray-700">
      <span className="font-medium">Property:</span> {event.propertyName}
    </p>
    {event.subPropertyName && (
      <p className="text-xs text-gray-700">
        <span className="font-medium">Sub-Property:</span> {event.subPropertyName}
      </p>
    )}
  </div>
);

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

interface ScheduleCalendarViewProps {
  schedules: Schedule[];
  onEventClick: (schedule: Schedule) => void;
}

const statusColor = (status: any) => {
  // Ensure status is a string before calling toLowerCase
  const statusString = typeof status === 'string' ? status : '';
  let backgroundColor = "#facc15";
  if (statusString.toLowerCase() === "approved") backgroundColor = "#16a34a";
  if (statusString.toLowerCase() === "declined") backgroundColor = "#dc2626";
  return {
    style: {
      backgroundColor,
      color: "white",
      borderRadius: "6px",
      padding: "2px 6px",
    },
  };
};

const ScheduleCalendarView = ({ schedules, onEventClick }: ScheduleCalendarViewProps) => {
  const calendarEvents = schedules.map((s) => ({
    id: s.scid,
    title: `${s.title}`,
    start: new Date(s.start),
    end: new Date(s.end),
    status: s.status,
    clientName: s.clientName,
    propertyName: s.Property?.name || "Unknown Property",
    subPropertyName: s.SubProperty?.name || "",
    schedule: s, // Pass the entire schedule object
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Schedule Calendar
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Available Days: Monday to Friday | 
          Available Times: {scheduleSettings.scheduleTime.map(minutesToTime).join(", ")}
        </p>
      </div>
      <div className="p-2 md:p-4 overflow-x-auto">
        <div className="min-w-[400px] md:min-w-full">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: "100%", minWidth: "600px" }}
            eventPropGetter={statusColor}
            popup
            showMultiDayTimes
            views={["month", "agenda", "week", "day"]}
            components={{
              agenda: {
                event: CustomAgendaEvent,
              },
            }}
            messages={{
              next: "Next",
              previous: "Previous",
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
              agenda: "Agenda",
            }}
            onSelectEvent={(event) => {
              // Open details modal when clicking on calendar events
              onEventClick(event.schedule);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendarView;