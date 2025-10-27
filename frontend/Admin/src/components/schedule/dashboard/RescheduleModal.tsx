import React, { useEffect, useState, ReactElement } from "react";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  newDate: string;
  setNewDate: (date: string) => void;
  newTime: string;
  setNewTime: (time: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  newDate,
  setNewDate,
  newTime,
  setNewTime,
  onSubmit,
  isSubmitting,
}) => {
  const { availableSlots, loading, error } = useAvailableSlots();
  const [filteredTimes, setFilteredTimes] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Filter available times when date changes
  useEffect(() => {
    if (newDate && availableSlots.length > 0) {
      const timesForDate = availableSlots
        .filter(slot => slot.date === newDate)
        .map(slot => slot.time);
      setFilteredTimes(timesForDate);
    } else {
      setFilteredTimes([]);
    }
  }, [newDate, availableSlots]);

  // Get unique dates from available slots
  const availableDates = [...new Set(availableSlots.map(slot => slot.date))];

  // Check if a date is available
  const isDateAvailable = (date: string) => {
    return availableDates.includes(date);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: string) => {
    setNewDate(date);
    setShowCalendar(false);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Render calendar days
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days: ReactElement[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 text-sm rounded-md bg-gray-50"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isAvailable = isDateAvailable(dateStr);
      const isSelected = newDate === dateStr;
      const isToday = new Date().toDateString() === date.toDateString();
      
      // Only show dates that are in the future or today
      const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push(
        <button
          key={day}
          onClick={() => isAvailable && !isPastDate && handleDateSelect(dateStr)}
          disabled={!isAvailable || isPastDate}
          className={`p-2 text-sm rounded-md ${
            isSelected
              ? "bg-orange-600 text-white"
              : isToday
              ? "bg-blue-100 text-blue-800 font-bold"
              : isAvailable && !isPastDate
              ? "bg-white text-gray-800 hover:bg-gray-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <div className="font-medium">{day}</div>
        </button>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
    >
      <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full p-3 sm:p-4 md:p-6 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh] focus:outline-none focus:ring-2 focus:ring-orange-400">
        {/* Title */}
        <h3
          id="reschedule-title"
          className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6"
        >
          Reschedule Appointment
        </h3>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Date Input with Calendar */}
        <div className="mb-3 sm:mb-4 md:mb-5">
          <label
            htmlFor="new-date"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            New Date
          </label>
          <div className="relative">
            <input
              type="text"
              id="new-date"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-2.5 md:p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm"
              value={newDate ? new Date(newDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : ""}
              onClick={() => setShowCalendar(!showCalendar)}
              readOnly
              placeholder="Select a date"
              aria-required="true"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showCalendar && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-full">
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={prevMonth}
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Previous month"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h4 className="text-sm font-medium text-gray-700">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button 
                    onClick={nextMonth}
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Next month"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                      {day}
                    </div>
                  ))}
                </div>
                {renderCalendar()}
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-600 rounded mr-1"></div>
                    <span>Selected date</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Input */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <label
            htmlFor="new-time"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            New Time
          </label>
          <select
            id="new-time"
            className="w-full border border-gray-300 rounded-md p-2 sm:p-2.5 md:p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            aria-required="true"
            disabled={loading || !newDate}
          >
            <option value="">Select a time</option>
            {filteredTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !newDate || !newTime}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm ${
              (isSubmitting || !newDate || !newTime) ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-1 sm:gap-2">
                <svg
                  className="animate-spin h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Submitting...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;