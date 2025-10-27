import React from "react";

interface FilterBarProps {
  filterAgent: string;
  setFilterAgent: (val: string) => void;
  filterProperty: string;
  setFilterProperty: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  disabled: boolean;
}

export default function FilterBar({
  filterAgent,
  setFilterAgent,
  filterProperty,
  setFilterProperty,
  filterStatus,
  setFilterStatus,
  disabled,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
      <input
        type="text"
        placeholder="Filter by Agent"
        className="border p-2 rounded w-full md:w-1/3"
        value={filterAgent}
        onChange={(e) => setFilterAgent(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Filter by Property"
        className="border p-2 rounded w-full md:w-1/3"
        value={filterProperty}
        onChange={(e) => setFilterProperty(e.target.value)}
        disabled={disabled}
      />
      <select
        className="border p-2 rounded w-full md:w-1/3"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        disabled={disabled}
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Declined">Declined</option>
      </select>
    </div>
  );
}
