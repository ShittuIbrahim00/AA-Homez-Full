import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface DateTimeSelectionProps {
  date: Date | null;
  time: string;
  loading: boolean;
  agencySettings: any;
  isDateAvailable: (date: Date) => boolean;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  minutesToTime: (minutes: number) => string;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  date,
  time,
  loading,
  agencySettings,
  isDateAvailable,
  onDateChange,
  onTimeChange,
  minutesToTime
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Desktop-specific props
  const desktopProps = {
    popperPlacement: "bottom-start" as const,
    popperModifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          padding: 10,
          tether: false,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom", "top", "bottom-end"],
        },
      },
    ],
    showPopperArrow: false,
  };

  // Mobile-specific props for always visible calendar
  const mobileProps = {
    withPortal: true,
    portalId: "root-portal",
    fixedHeight: true,
    showPopperArrow: false,
    // Always keep calendar open on mobile
    open: true,
  };

  const datePickerProps = isMobile ? mobileProps : desktopProps;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          htmlFor="date"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-orange-500" />
            Select Date
          </div>
        </label>
        <div className="relative overflow-visible">
      <DatePicker
  selected={date}
  onChange={onDateChange}
  filterDate={isDateAvailable}
  minDate={new Date()}
  dateFormat="yyyy-MM-dd"
  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition pl-12"
  disabled={loading || !agencySettings}
  required
  placeholderText="Select date"
  autoComplete="off"
  withPortal
  portalId="root-portal"
  popperPlacement="bottom-start"
  popperModifiers={[
    { name: "offset", options: { offset: [0, 8] } },
    { name: "preventOverflow", options: { altAxis: true, padding: 10 } },
  ]}
/>

          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaCalendarAlt />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Select from available dates in calendar
        </p>
      </div>

      <div>
        <label
          htmlFor="time"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          <div className="flex items-center">
            <FaClock className="mr-2 text-orange-500" />
            Select Time
          </div>
        </label>
        <div className="relative">
          <select
            id="time"
            name="time"
            value={time}
            onChange={onTimeChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition pl-12 appearance-none"
            disabled={loading || !agencySettings}
            required
          >
            <option value="">Select available time</option>
            {agencySettings?.scheduleTime && Array.isArray(agencySettings.scheduleTime) ? (
              agencySettings.scheduleTime.map((minutes) => {
                const display = minutesToTime(minutes);
                return (
                  <option key={minutes} value={display}>
                    {display}
                  </option>
                );
              })
            ) : (
              <option value="">No available times</option>
            )}
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaClock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;