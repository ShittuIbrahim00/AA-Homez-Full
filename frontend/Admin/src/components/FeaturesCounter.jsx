import React from "react";

const FeaturesCounter = ({ label, count, onChange }) => {
  const handleIncrement = () => onChange(count + 1);
  const handleDecrement = () => {
    if (count > 0) onChange(count - 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        className="px-3 py-1 bg-gray-300 rounded"
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <span className="min-w-[24px] text-center">{count}</span>
      <button
        type="button"
        onClick={handleIncrement}
        className="px-3 py-1 bg-gray-300 rounded"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
      <span className="ml-2 font-medium">{label}</span>
    </div>
  );
};

export default FeaturesCounter;
