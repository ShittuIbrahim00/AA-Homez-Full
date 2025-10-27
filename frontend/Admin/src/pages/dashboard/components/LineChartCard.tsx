"use client";

import { Line } from "react-chartjs-2";

interface LineChartCardProps {
  title: string;
  data: any;
  height?: string | number;
}

export function LineChartCard({
  title,
  data,
  height = 400,
}: LineChartCardProps) {
  return (
    <div className="bg-white shadow p-4 rounded-lg border" style={{ height }}>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <Line
        data={data}
        options={{ maintainAspectRatio: false }}
        aria-label={`${title} line chart`}
        role="img"
      />
    </div>
  );
}

// Add default export to prevent Next.js page error
export default LineChartCard;
