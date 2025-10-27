"use client";

import { Pie } from "react-chartjs-2";

interface PieChartCardProps {
  title: string;
  data: any;
  height?: string | number;
}

export function PieChartCard({ title, data, height = 600 }: PieChartCardProps) {
  return (
    <div className="bg-white shadow p-4 rounded-lg border" style={{ height }}>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <Pie
        data={data}
        options={{ maintainAspectRatio: false }}
        aria-label={`${title} pie chart`}
        role="img"
      />
    </div>
  );
}

// Add default export to prevent Next.js page error
export default PieChartCard;
