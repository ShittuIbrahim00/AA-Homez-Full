import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ChartWrapper({ title, children }: Props) {
  return (
    <div className="bg-white shadow p-4 rounded-lg border flex flex-col" style={{ minHeight: 300 }}>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <div className="flex-1">{children}</div>
    </div>
  );
}