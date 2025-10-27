"use client";

import React from "react";

interface Activity {
  message: string;
  time: string;
}

interface Props {
  activities: Activity[];
}

export default function RecentActivity({ activities }: Props) {
  return (
    <div className="bg-white shadow p-4 rounded-lg border max-w-2xl">
      <h4 className="mb-4 font-semibold">Recent Activity</h4>
      <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {activities.length > 0 ? (
          activities.map(({ message, time }, idx) => (
            <li
              key={idx}
              tabIndex={0}
              className="flex justify-between text-sm text-gray-700 border-b border-gray-100 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label={`${message} - ${time}`}
            >
                <span>{message}</span>
              <time dateTime={time} className="text-gray-400 whitespace-nowrap ml-2">
                {time}
              </time>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No recent activity</li>
        )}
      </ul>
    </div>
  );
}