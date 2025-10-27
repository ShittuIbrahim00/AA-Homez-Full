import React from "react";

interface Props {
  totalProperties: number;
  totalAgents: number;
  pendingInspections: number;
  totalTransactions: number;
}

export default function StatsCards({
  totalProperties,
  totalAgents,
  pendingInspections,
  totalTransactions,
}: Props) {
  const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <div
      tabIndex={0}
      className="bg-white shadow p-4 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label={`${label}: ${value}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard label="Total Properties" value={totalProperties} />
      <StatCard label="Agents" value={totalAgents} />
      <StatCard label="Pending Inspections" value={pendingInspections} />
      <StatCard label="Transactions" value={`₦${totalTransactions.toLocaleString()}`} />
    </div>
  );
}