// components/TagMultiSelect.tsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface TagMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (vals: string[]) => void;
}

export default function TagMultiSelect({ label, options, selected, setSelected }: TagMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (!selected.includes(tag)) setSelected([...selected, tag]);
    setInputValue("");
  };

  const removeTag = (tag: string) => setSelected(selected.filter((t) => t !== tag));

  return (
    <div className="flex flex-col">
      <span className="font-medium mb-2">{label}</span>
      <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200 min-h-[50px]">
        {selected.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <FaTimes className="cursor-pointer" onClick={() => removeTag(tag)} />
          </span>
        ))}
        <input
          type="text"
          placeholder="Add..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag(inputValue)}
          className="flex-1 border-none outline-none bg-transparent text-sm px-1 py-1"
        />
      </div>
      {/* Suggestions */}
      {inputValue && (
        <div className="mt-1 grid grid-cols-2 gap-2">
          {options
            .filter((o) => o.toLowerCase().includes(inputValue.toLowerCase()) && !selected.includes(o))
            .map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => addTag(opt)}
                className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 transition"
              >
                {opt}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
