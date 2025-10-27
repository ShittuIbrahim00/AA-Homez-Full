"use client";

import React, { useMemo } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  properties: any[];
}

export default function ListingStatusChart({ properties }: Props) {
  const data = useMemo(() => {
    const statusByMonth: Record<string, { available: number; sold: number; pending: number }> = {};

    properties.forEach((p) => {
      if (!p.createdAt) return;
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;

      if (!statusByMonth[key]) statusByMonth[key] = { available: 0, sold: 0, pending: 0 };
      const status = (p.listingStatus || "pending").toLowerCase();
      if (["available", "sold", "pending"].includes(status)) statusByMonth[key][status]++;
    });

    const sortedKeys = Object.keys(statusByMonth).sort();

    return {
      labels: sortedKeys,
      datasets: [
        {
          label: "Available",
          data: sortedKeys.map((k) => statusByMonth[k].available),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.4,
        },
        {
          label: "Sold",
          data: sortedKeys.map((k) => statusByMonth[k].sold),
          borderColor: "#eab308",
          backgroundColor: "rgba(234,179,8,0.2)",
          tension: 0.4,
        },
        {
          label: "Pending",
          data: sortedKeys.map((k) => statusByMonth[k].pending),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.4,
        },
      ],
    };
  }, [properties]);

  return <Line data={data} options={{ maintainAspectRatio: false }} style={{ height: "250px" }} />;
}