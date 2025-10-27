import React, { forwardRef } from "react";

export interface DropdownOption {
  id?: string | number;
  value: string | number;
  name: string;
}

export interface DropdownModel extends React.SelectHTMLAttributes<HTMLSelectElement> {
  data?: DropdownOption[];
  selectItem?: any;
  className?: string;
  style?: React.CSSProperties;
  isDisabled?: boolean;
  placeholder: string;
  label?: string;
}

// drop down component
const Dropdown = forwardRef<HTMLSelectElement, DropdownModel>((props, ref) => {
  const { 
    data, 
    onChange, 
    className, 
    isDisabled, 
    placeholder, 
    label,
    id,
    ...rest 
  } = props;

  const selectId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full py-2 px-3 rounded-md border-[1px] text-[13px] capitalize font-normal border-gray-500 focus:border-gray-100 focus:ring-2 focus:ring-green-500 outline-none ${className}`}
        onChange={onChange}
        disabled={isDisabled}
        aria-label={label || placeholder}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {data && data.length > 0 ? (
          data.map((item) => (
            <option key={item.id || item.value} value={item.value}>
              {item.name}
            </option>
          ))
        ) : (
          <option disabled>{placeholder}(s) are not available</option>
        )}
      </select>
    </div>
  );
});

Dropdown.displayName = "Dropdown";

export { Dropdown };