"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  properties: any[];
}

export default function PaymentStatusChart({ properties }: Props) {
  const data = useMemo(() => {
    const counts = { paid: 0, pending: 0 };
    properties.forEach((p) => {
      const status = (p.paymentStatus || "pending").toLowerCase();
      if (status in counts) counts[status]++;
    });

    return {
      labels: ["Paid", "Pending"],
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ["#22c55e", "#f97316"],
        },
      ],
    };
  }, [properties]);

  return <Pie data={data} options={{ maintainAspectRatio: false }} style={{ height: "250px" }} />;
}