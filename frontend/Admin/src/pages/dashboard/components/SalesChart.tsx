import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data: any;
  title: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number | "") => void;
  selectedMonth: string;
  selectedYear: number | "";
  allProps: any[];
  filteredSales: number;
}

export default function SalesChart({
  data,
  title,
  onMonthChange,
  onYearChange,
  selectedMonth,
  selectedYear,
  allProps,
  filteredSales,
}: SalesChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `₦${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg border col-span-2 flex flex-col" style={{ minHeight: 400 }}>
      <h4 className="mb-4 font-semibold">{title}</h4>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            aria-label="Filter by month"
          >
            <option value="">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Year</label>
          <select
            value={selectedYear}
            onChange={(e) =>
              onYearChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-gray-300 rounded px-3 py-2"
            aria-label="Filter by year"
          >
            <option value="">All Years</option>
            {Array.from(
              new Set(
                allProps
                  .filter((p) => p.createdAt)
                  .map((p) => new Date(p.createdAt).getFullYear())
              )
            )
              .sort((a, b) => a - b)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <strong>Filtered Sales:</strong>{" "}
        {filteredSales > 0
          ? `₦${filteredSales.toLocaleString()}`
          : "No sales for selected period"}
      </div>

      <div className="flex-1">
        <Line data={data} options={options} aria-label={`${title} chart`} role="img" />
      </div>
    </div>
  );
}