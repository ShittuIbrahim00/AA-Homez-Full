import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function ScheduleCalendar({
  events,
  onSelectEvent,
  onMouseEnter,
  onMouseLeave,
}) {
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#facc15";
    if (event.status === "Approved") backgroundColor = "#16a34a";
    if (event.status === "Declined") backgroundColor = "#dc2626";
    return { style: { backgroundColor, color: "white", borderRadius: "6px", padding: "2px 6px" } };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      eventPropGetter={eventStyleGetter}
      onSelectEvent={onSelectEvent}
      components={{
        event: (props) => (
          <div
            onMouseEnter={(e) => onMouseEnter(props.event, e)}
            onMouseLeave={onMouseLeave}
            className="cursor-pointer"
          >
            {props.event.title}
          </div>
        ),
      }}
    />
  );
}
