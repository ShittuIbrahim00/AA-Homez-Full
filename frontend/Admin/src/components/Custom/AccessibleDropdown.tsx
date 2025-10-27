import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  id?: string | number;
  value: string | number;
  name: string;
}

interface AccessibleDropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  id,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dropdownId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, focusedIndex, options]);

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };

  // Get display text for the button
  const getDisplayText = () => {
    if (value === undefined || value === null || value === "") {
      return placeholder;
    }
    
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.name : placeholder;
  };

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label 
          htmlFor={dropdownId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          id={dropdownId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? undefined : dropdownId}
          disabled={disabled}
          onClick={handleButtonClick}
          onKeyDown={handleButtonKeyDown}
          className={`w-full py-2 px-3 text-left rounded-md border text-[13px] font-normal focus:outline-none focus:ring-2 focus:ring-green-500 ${
            disabled 
              ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-white border-gray-500 hover:border-gray-600 focus:border-gray-100"
          } flex justify-between items-center`}
        >
          <span className="truncate">{getDisplayText()}</span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <ul 
            role="listbox"
            aria-labelledby={dropdownId}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={option.id || option.value}
                  role="option"
                  aria-selected={option.value === value}
                  tabIndex={-1}
                  className={`py-2 px-3 text-[13px] cursor-pointer ${
                    option.value === value 
                      ? "bg-green-100 text-green-800" 
                      : focusedIndex === index 
                        ? "bg-gray-100" 
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="py-2 px-3 text-[13px] text-gray-500 cursor-not-allowed">
                No options available
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccessibleDropdown;