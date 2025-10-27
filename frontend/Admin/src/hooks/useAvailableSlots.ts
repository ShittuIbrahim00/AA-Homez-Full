import { useState, useEffect } from 'react';
import { getSettings } from '@/services/settings.service';

interface AvailableSlot {
  date: string;
  time: string;
}

interface UseAvailableSlotsReturn {
  availableSlots: AvailableSlot[];
  loading: boolean;
  error: string | null;
  refreshSlots: () => void;
}

// Generate time slots based on agency settings
const generateTimeSlots = (scheduleTime: number[]): string[] => {
  return scheduleTime.map(timeInMinutes => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });
};

// Generate available dates for the next 30 days based on agency settings
const generateAvailableDates = (scheduleDays: number[]): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  // Generate dates for the next 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday from 0 to 7
    
    // Check if this day is in the agency's available days
    if (scheduleDays.includes(dayOfWeek)) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  return dates;
};

export const useAvailableSlots = (): UseAvailableSlotsReturn => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch agency settings
      const settingsResponse = await getSettings();
      const settings = settingsResponse.data;
      
      if (!settings || !settings.scheduleDays || !settings.scheduleTime) {
        throw new Error('Agency settings not available');
      }
      
      // Generate available dates and times
      const availableDates = generateAvailableDates(settings.scheduleDays);
      const availableTimes = generateTimeSlots(settings.scheduleTime);
      
      // Create all combinations of available dates and times
      const slots: AvailableSlot[] = [];
      availableDates.forEach(date => {
        availableTimes.forEach(time => {
          slots.push({ date, time });
        });
      });
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setError('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  return {
    availableSlots,
    loading,
    error,
    refreshSlots: fetchAvailableSlots
  };
};