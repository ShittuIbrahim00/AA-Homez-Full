import React, { useState } from 'react';
import Image from "next/image";
import hide from "../../../public/icons/hide.svg";
import show_pass from "../../../public/icons/show-pass.svg";
import close from "../../../public/icons/close.png";
import date from "../../../public/icons/calendar_month_filled.png";
import { sanitizeInput } from "@/utils/inputSanitizer";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  rightIcon?: boolean;
  className?: string;
  isDisabled?: boolean;
  containerStyle?: string;
  cancel?: boolean;
  sanitize?: boolean;
  onCancel?: () => void;  // <-- NEW prop here
}

function Input(props: InputProps) {
  const {
    type,
    value,
    onChange,
    placeholder,
    rightIcon,
    className,
    isDisabled,
    containerStyle,
    cancel,
    sanitize = true,
    onCancel, // <-- grab new prop
    ...rest
  } = props;

  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const sanitizedValue = sanitize ? sanitizeInput(e.target.value) : e.target.value;
      onChange({
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      });
    }
  };

  return (
    <>
      {type === "password" ? (
        <div className={`flex ${containerStyle ?? "w-full"}`}>
          <input
            className={`
              w-[90%] py-2 px-3 font-light rounded-l border-y-2 border-l-2 border-r-0 
              text-black text-[12px] 
              border-y-gray-100 border-l-gray-100 focus:border-gray-100 outline-none ${className}`}
            placeholder={placeholder}
            readOnly={isDisabled}
            value={value}
            onChange={handleChange}
            {...rest}
            type={toggle ? "text" : "password"}
          />
          <div
            className="w-[10%] rounded-r border-y-2 border-r-2 border-l-0 border-y-gray-100 border-r-gray-100
            focus:border-gray-100 outline-none flex justify-center cursor-pointer"
            onClick={handleToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleToggle();
              }
            }}
            aria-label={toggle ? "Hide password" : "Show password"}
          >
            {!toggle ? (
              <Image
                src={hide}
                alt="Hide password"
                width={20}
                height={20}
                priority={true}
              />
            ) : (
              <Image
                src={show_pass}
                alt="Show password"
                width={20}
                height={20}
                priority={true}
              />
            )}
          </div>
        </div>
      ) : (
        <div className={`flex items-center ${containerStyle ?? "w-full"}`}>
          <input
            className={`
              py-2 px-3 rounded-l border-[1px] font-light border-gray-100 focus:border-gray-100 
              text-black text-[12px] 
              outline-none w-full ${className}
            `}
            value={value}
            placeholder={placeholder}
            type={type}
            readOnly={isDisabled}
            onChange={handleChange}
            {...rest}
          />
          {/* Show cancel icon with onClick handler if cancel is true */}
          {cancel && (
            <div
              className="rounded-r border-[1px] border-l-0 border-gray-100 flex items-center justify-center cursor-pointer p-2"
              onClick={onCancel}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onCancel && onCancel();
                }
              }}
              aria-label="Clear input"
            >
              <Image src={close} alt="Clear input" width={16} height={16} priority={true} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Input;
