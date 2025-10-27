import '@fullcalendar/react';

declare module '@fullcalendar/react' {
    interface CalendarOptions {
        resources?: Array<{ id: string; title: string }>;
    }
}

// Agency settings interface
interface AgencySettings {
    images: string[];
    scheduleDays: number[];
    scheduleTime: number[];
    sid: number;
    uid: number;
    name: string;
    description: string;
    location: string;
    type: string | null;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}