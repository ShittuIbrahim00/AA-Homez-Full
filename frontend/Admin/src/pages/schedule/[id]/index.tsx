// app/schedule/[id]/page.tsx (note: `page.tsx` is a server component by default)

import React from "react";
import moment from "moment";
import Image from "next/image";
import { getScheduleById } from "@/hooks/schedule.hooks";

interface ScheduleDetail {
  scid: number;
  uid: number;
  aid: number;
  sid: number | null;
  pid: number | null;
  clientName: string;
  clientPhone: string;
  title: string;
  date: string;
  time: string;
  start: string;
  end: string;
  status: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Agent?: { fullName?: string; phone?: string; rank?: string; avatar?: string };
  Property?: { name?: string; mapLink?: string; image?: string };
  SubProperty?: { name?: string; mapLink?: string };
}

interface PageProps {
  params: { id: string };
}

export default async function ScheduleDetails({ params }: PageProps) {
  console.log("Params ID:", params.id);

  let schedule: ScheduleDetail | null = null;
  try {
    schedule = await getScheduleById(Number(params.id));
    console.log("Schedule data:", schedule);
  } catch (error: any) {
    return <div className="p-6 text-center text-red-600">Failed to load schedule: {(error as Error).message}</div>;
  }

  if (!schedule) {
    return <div className="p-6 text-center">Schedule not found</div>;
  }

  // Double check fields are NOT promises:
  for (const key in schedule) {
    if (schedule[key] instanceof Promise) {
      console.error(`Field ${key} is a Promise!`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">{schedule.title || "Schedule Details"}</h1>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Client Info</h2>
          <p><strong>Name:</strong> {schedule.clientName}</p>
          <p><strong>Phone:</strong> {schedule.clientPhone}</p>
          <p><strong>Status:</strong> <span className={`inline-block px-2 py-1 rounded text-white ${
            schedule.status.toLowerCase() === "approved" ? "bg-green-600" :
            schedule.status.toLowerCase() === "declined" ? "bg-red-600" :
            "bg-yellow-500"
          }`}>{schedule.status}</span></p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Schedule Timing</h2>
          <p><strong>Date:</strong> {moment(schedule.date).format("MMM D, YYYY")}</p>
          <p><strong>Start Time:</strong> {moment(schedule.start).format("h:mm A")}</p>
          <p><strong>End Time:</strong> {moment(schedule.end).format("h:mm A")}</p>
          <p><strong>Created At:</strong> {moment(schedule.createdAt).format("MMM D, YYYY h:mm A")}</p>
          <p><strong>Last Updated:</strong> {moment(schedule.updatedAt).format("MMM D, YYYY h:mm A")}</p>
        </div>
      </div>

      {/* Property Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Property Details</h2>
        {schedule.Property ? (
          <div className="flex gap-4 items-center">
            <Image
              src={schedule.Property.image || "/default-property.jpg"}
              alt={schedule.Property.name || "Property Image"}
              width={200}
              height={140}
              className="rounded"
            />
            <div>
              <p><strong>Name:</strong> {schedule.Property.name}</p>
              {schedule.Property.mapLink && (
                <p>
                  <a
                    href={schedule.Property.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Map
                  </a>
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>No property information available.</p>
        )}
      </div>

      {/* SubProperty Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sub-Property Details</h2>
        {schedule.SubProperty ? (
          <>
            <p><strong>Name:</strong> {schedule.SubProperty.name}</p>
            {schedule.SubProperty.mapLink && (
              <p>
                <a
                  href={schedule.SubProperty.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Sub-Property on Map
                </a>
              </p>
            )}
          </>
        ) : (
          <p>No sub-property information available.</p>
        )}
      </div>

      {/* Agent Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Agent Details</h2>
        {schedule.Agent ? (
          <div className="flex items-center gap-4">
            <Image
              src={schedule.Agent.avatar || "/default-avatar.png"}
              alt={schedule.Agent.fullName || "Agent"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p><strong>Name:</strong> {schedule.Agent.fullName}</p>
              <p><strong>Phone:</strong> {schedule.Agent.phone}</p>
              <p><strong>Rank:</strong> {schedule.Agent.rank}</p>
            </div>
          </div>
        ) : (
          <p>No agent information available.</p>
        )}
      </div>

      {/* Other Details */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Additional Info</h2>
        <p><strong>Title:</strong> {schedule.title}</p>
        <p><strong>Type:</strong> {schedule.type || "N/A"}</p>
        <p><strong>Deleted At:</strong> {schedule.deletedAt ? moment(schedule.deletedAt).format("MMM D, YYYY h:mm A") : "N/A"}</p>
      </div>
    </div>
  );
}
