import React, { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const MyScheduler = ({ schedules, }) => {


 

  return (
    <div className="p-4 md:p-6 space-y-6 bg-blue-50 ">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
        Schedule Calender
      </h1>

    

      <div className="bg-white p-4 rounded shadow w-full overflow-auto min-h-[400px]">
        <div className="min-w-[300px] h-[500px]">
          <Calendar
            localizer={localizer}
            events={schedules}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default MyScheduler;
