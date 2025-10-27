import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { useRouter } from 'next/router';
import { EventClickArg } from '@fullcalendar/core';

// New settings structure
const scheduleSettings = {
  name: "AA Homez",
  description: "Daily schedule for AA Homez",
  location: "Abuja",
  images: ["img1.jpg", "img2.jpg"],
  scheduleDays: [1, 2, 3, 4, 5], // Mon-Fri
  scheduleTime: [480, 600, 720, 840] // 8:00, 10:00, 12:00, 14:00 (2-hour intervals)
};

// Convert minutes to time format (HH:MM)
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

interface SchedulerProps {
    data: Array<{
        id: string;
        title: string;
        start: string;
        end: string;
    }>;
}

function Scheduler(props: SchedulerProps) {
    const router = useRouter();

    const gotoPage = (value: string) => {
        router.push(value, undefined, { shallow: true });
    };

    return (
        <div>
            {/* Settings Info Banner */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-blue-900">{scheduleSettings.name}</h3>
                <p className="text-blue-700">{scheduleSettings.description}</p>
                <p className="text-blue-700 text-sm">
                    Available Days: Monday to Friday | 
                    Available Times: {scheduleSettings.scheduleTime.map(minutesToTime).join(", ")}
                </p>
            </div>
            
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin]}
                initialView="resourceTimeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth',
                }}
                events={props.data}
                eventClick={(info: EventClickArg) => {
                    // If your event has an id, you can use it for navigation
                    const eventId = info.event.id;
                    gotoPage(`/schedule/view?scidParams=${eventId}`);
                }}
                resources={[
                    { id: 'roomA', title: 'Room A' },
                    { id: 'roomB', title: 'Room B' },
                ]}
                height="auto"
                // Restrict to weekdays only
                hiddenDays={[0, 6]} // Hide Sunday (0) and Saturday (6)
                slotMinTime="08:00:00"
                slotMaxTime="15:00:00"
            />
        </div>
    );
}

export default Scheduler;