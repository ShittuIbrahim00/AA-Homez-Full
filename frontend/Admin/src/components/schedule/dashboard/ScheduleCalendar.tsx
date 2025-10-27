import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

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

interface CustomAgendaEventProps {
  event: any;
}

const CustomAgendaEvent: React.FC<CustomAgendaEventProps> = ({ event }) => (
  <div className="space-y-1 py-1 sm:space-y-2 sm:py-2">
    <p className="font-bold text-blue-600 text-xs sm:text-sm">
       <span className="font-medium">Agent:</span> {event.agentName}
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

interface ScheduleCalendarProps {
  schedules: Schedule[];
  openDetailsModal: (schedule: Schedule) => void;
  eventStyleGetter: (event: any) => any;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  openDetailsModal,
  eventStyleGetter,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Schedule Calendar
        </h2>
      </div>
      <div className="p-2 sm:p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[300px] md:min-w-full w-full">
          <Calendar
            localizer={localizer}
            events={schedules.map((s) => ({
              id: s.scid,
              title: `${s.title}`,
              start: new Date(s.start),
              end: new Date(s.end),
              status: s.status,
              agentName: s.Agent?.fullName || s.clientName,
              propertyName: s.Property?.name || "Unknown Property",
              subPropertyName: s.SubProperty?.name || "",
              schedule: s, // Pass the entire schedule object
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "500px", width: "100%", minWidth: "100%" }}
            eventPropGetter={eventStyleGetter}
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
              openDetailsModal(event.schedule);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;