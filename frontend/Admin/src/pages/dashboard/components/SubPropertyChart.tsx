import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface SubPropertyChartProps {
  data: any;
  title: string;
}

export default function SubPropertyChart({ data, title }: SubPropertyChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg border flex flex-col" style={{ minHeight: 400 }}>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <div className="flex-1">
        <Pie data={data} options={options} aria-label={`${title} chart`} role="img" />
      </div>
    </div>
  );
}