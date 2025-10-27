"use client";
import React, { useEffect, useState } from "react";
import { useAgencySettings } from "@/hooks/settings.hooks";
import { FaSave, FaUpload, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const daysOfWeek = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

// Generate time slots in 2-hour intervals from 8:00 to 18:00 (in minutes)
const timeSlots = [
  { value: 480, label: "8:00" },   // 8:00 AM
  { value: 600, label: "10:00" },  // 10:00 AM
  { value: 720, label: "12:00" },  // 12:00 PM
  { value: 840, label: "14:00" },  // 2:00 PM
  { value: 960, label: "16:00" },  // 4:00 PM
  { value: 1080, label: "18:00" }, // 6:00 PM
];

export default function SettingsPage() {
  const { settings, loading, saving, error, submitSettings } = useAgencySettings();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    images: [] as File[],
    scheduleDays: [] as number[],
    scheduleTime: [] as number[],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || "",
        description: settings.description || "",
        location: settings.location || "",
        images: [], // reset image upload
        scheduleDays: settings.scheduleDays || [],
        scheduleTime: settings.scheduleTime || [],
      });
    }
  }, [settings]);

  // Handle image preview
  useEffect(() => {
    const previews: string[] = [];
    form.images.forEach((file) => {
      previews.push(URL.createObjectURL(file));
    });
    setImagePreviews(previews);

    // Cleanup
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [form.images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm({ ...form, images: files });
    }
  };

  const toggleDay = (dayValue: number) => {
    setForm(prev => {
      const updated = prev.scheduleDays.includes(dayValue)
        ? prev.scheduleDays.filter(day => day !== dayValue)
        : [...prev.scheduleDays, dayValue];
      return { ...prev, scheduleDays: updated };
    });
  };

  const toggleHour = (hourValue: number) => {
    setForm(prev => {
      const updated = prev.scheduleTime.includes(hourValue)
        ? prev.scheduleTime.filter(hour => hour !== hourValue)
        : [...prev.scheduleTime, hourValue];
      return { ...prev, scheduleTime: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      await submitSettings(form);
      toast.success("Settings saved successfully!");
    } catch (err) {
      // Error is already handled in the hook, no need to show another toast
      console.error("Form submission error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agency Settings</h1>
        <p className="mt-2 text-gray-600">Manage your agency information and availability</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Show error but keep the form visible */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading settings</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Agency Name */}
            <div>
              <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaBuilding className="mr-2 text-orange-500" />
                Agency Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="agencyName"
                value={form.name}
                placeholder="Enter your agency name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                placeholder="Describe your agency..."
                rows={4}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                Location
              </label>
              <input
                type="text"
                id="location"
                value={form.location}
                placeholder="Enter agency location"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUpload className="mr-2 text-orange-500" />
                Agency Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">New Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                Available Days
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the days your agency is open</p>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      form.scheduleDays.includes(day.value)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaClock className="mr-2 text-orange-500" />
                Available Hours
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the hours your agency is open (2-hour intervals)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => toggleHour(slot.value)}
                    className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      form.scheduleTime.includes(slot.value)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <FaSave className="mr-2 -ml-1 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}