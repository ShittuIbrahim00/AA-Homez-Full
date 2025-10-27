"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const MapDisplay = dynamic(() => import("@/components/Custom/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface SubPropertyMapInnerProps {
  finalMapLink?: string;
}

export default function SubPropertyMapInner({ finalMapLink }: SubPropertyMapInnerProps) {
  const [hasValidData, setHasValidData] = useState(false);

  useEffect(() => {
    setHasValidData(!!(finalMapLink && finalMapLink.trim() !== ''));
  }, [finalMapLink]);

  if (!hasValidData) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
        <div className="text-lg font-semibold mb-2">Location Unavailable</div>
        <div className="text-sm">
          Sub-property location data is not available
        </div>
      </div>
    );
  }

  return <MapDisplay finalMapLink={finalMapLink} />;
}