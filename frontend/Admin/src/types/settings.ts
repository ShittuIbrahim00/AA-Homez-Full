// src/types/settings.ts
export interface AgencySettings {
  name: string;
  description: string;
  location: string;
  images: string[]; // URLs from server
  scheduleDays: number[];
  scheduleTime: number[];
}

// Type for form submission with file uploads
export interface AgencySettingsForm extends Omit<AgencySettings, "images"> {
  images: File[]; // Files for upload
}
