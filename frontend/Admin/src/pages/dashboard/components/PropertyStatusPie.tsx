"use client";

import React from "react";
import { Pie } from "react-chartjs-2";

interface PropertyStatusPieProps {
  propertyStatusData: any;
}

export default function PropertyStatusPie({ propertyStatusData }: PropertyStatusPieProps) {
  return (
    <div
      className="bg-white shadow p-4 rounded-lg border"
      style={{ height: "600px" }}
    >
      <h4 className="mb-4 font-semibold">Property Status</h4>
      <Pie
        data={propertyStatusData}
        options={{ maintainAspectRatio: false }}
        aria-label="Property status pie chart"
        role="img"
      />
    </div>
  );
}
