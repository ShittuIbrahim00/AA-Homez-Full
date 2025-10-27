import React from "react";

// Settings structure
const scheduleSettings = {
  name: "AA Homez",
  description: "Daily schedule for AA Homez",
  location: "Abuja",
  images: ["img1.jpg", "img2.jpg"],
  scheduleDays: [1, 2, 3, 4, 5], // Mon-Fri
  scheduleTime: [480, 600, 720, 840] // 8:00, 10:00, 12:00, 14:00 (2-hour intervals)
};

// Convert minutes to time format (HH:MM)
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Convert day numbers to day names
const dayNumberToName = (dayNumber: number) => {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayNumber] || '';
};

const ScheduleSettingsBanner = () => {
  return (
    <div className="bg-blue-50 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-900">{scheduleSettings.description}</h2>
          <p className="text-sm text-blue-700">Location: {scheduleSettings.location}</p>
          <p className="text-sm text-blue-700">
            Available Days: {scheduleSettings.scheduleDays.map(dayNumberToName).join(", ")}
          </p>
          <p className="text-sm text-blue-700">
            Available Times: {scheduleSettings.scheduleTime.map(minutesToTime).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettingsBanner;