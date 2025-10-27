"use client";
import { useEffect, useState } from "react";

interface MapDisplayProps {
  finalMapLink?: string;
}

export default function MapDisplay({ finalMapLink }: MapDisplayProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!finalMapLink) {
      setError("Map link not available");
    }
  }, [finalMapLink]);

  if (error) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
        <div className="text-lg font-semibold mb-2">Location Unavailable</div>
        <div className="text-sm">
          Property location data is not available
        </div>
      </div>
    );
  }

  if (finalMapLink) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe
          title="Property Location"
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
          src={finalMapLink}
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
      <div className="text-lg font-semibold mb-2">Location Unavailable</div>
      <div className="text-sm">
        Property location data is not available
      </div>
    </div>
  );
}
