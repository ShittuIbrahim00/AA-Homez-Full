"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  properties: any[];
}

export default function PropertyTypeChart({ properties }: Props) {
  const data = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    properties.forEach((p) => {
      const type = p.type || "Other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          data: Object.values(typeCounts),
          backgroundColor: ["#3b82f6", "#f97316", "#22c55e", "#eab308"],
        },
      ],
    };
  }, [properties]);

  return <Pie data={data} options={{ maintainAspectRatio: false }} style={{ height: "250px" }} />;
}