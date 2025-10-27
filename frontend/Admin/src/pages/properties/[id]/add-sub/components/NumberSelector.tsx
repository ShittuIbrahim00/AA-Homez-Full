// components/NumberSelector.tsx
import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

interface NumberSelectorProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
}

export default function NumberSelector({ label, value, setValue }: NumberSelectorProps) {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg shadow-sm">
      <span className="font-medium mb-2">{label}</span>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setValue(Math.max(0, value - 1))}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaMinus />
        </button>
        <span className="px-3 py-1 text-lg font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => setValue(value + 1)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}
