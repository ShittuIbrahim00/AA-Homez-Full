"use client";
import React, { useMemo, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { parsePrice } from "./ParsePrice";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  properties: any[];
  month?: string;
  year?: string;
}

export default function SalesRevenueChart({ properties, month, year }: Props) {
  const chartRef = useRef<any>(null);

  const data = useMemo(() => {
    const monthlyData: Record<
      string,
      { total: number; paid: number; pending: number }
    > = {};
    const monthIndex = month ? new Date(`${month} 1, 2000`).getMonth() : null;

    properties.forEach((p) => {
      if (!p.createdAt) return;
      const d = new Date(p.createdAt);
      if (monthIndex !== null && d.getMonth() !== monthIndex) return;
      if (year && d.getFullYear().toString() !== year) return;

      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      const price = parsePrice(p.price);
      const paid = (p.paymentStatus || "pending").toLowerCase() === "paid" ? price : 0;
      const pending = price - paid;

      if (!monthlyData[key]) monthlyData[key] = { total: 0, paid: 0, pending: 0 };
      monthlyData[key].total += price;
      monthlyData[key].paid += paid;
      monthlyData[key].pending += pending;
    });

    const sortedMonths = Object.keys(monthlyData).sort(
      (a, b) => new Date(`${a} 1`).getTime() - new Date(`${b} 1`).getTime()
    );

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Sales & Revenue (₦)",
          data: sortedMonths.map((m) => monthlyData[m].total),
          borderColor: function (context: any) {
            const chart = chartRef.current;
            if (!chart) return "#16a34a";

            const gradient = chart.ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, "#16a34a"); // Paid - green
            gradient.addColorStop(0.5, "#16a34a");
            gradient.addColorStop(0.5, "#f97316"); // Pending - orange
            gradient.addColorStop(1, "#f97316");
            return gradient;
          },
          backgroundColor: "rgba(22,163,74,0.2)",
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [properties, month, year]);

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const month = context.label;
            const propsMonth = properties.filter((p) => {
              if (!p.createdAt) return false;
              const d = new Date(p.createdAt);
              const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
              return key === month;
            });

            const total = propsMonth.reduce((sum, p) => sum + parsePrice(p.price), 0);
            const paid = propsMonth
              .filter((p) => (p.paymentStatus || "pending").toLowerCase() === "paid")
              .reduce((sum, p) => sum + parsePrice(p.price), 0);
            const pending = total - paid;

            return [
              `Total: ₦${total.toLocaleString()}`,
              `Paid: ₦${paid.toLocaleString()}`,
              `Pending: ₦${pending.toLocaleString()}`,
            ];
          },
        },
      },
    },
  };

  return <Line ref={chartRef} data={data} options={options} style={{ height: "250px" }} />;
}