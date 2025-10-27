import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = "md" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-t-2 border-b-2",
    md: "h-12 w-12 border-t-2 border-b-2",
    lg: "h-16 w-16 border-t-4 border-b-4",
  };

  const borderSizeClasses = {
    sm: "border-t-2 border-b-2",
    md: "border-t-2 border-b-2",
    lg: "border-t-4 border-b-4",
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label={message}>
      <div className="text-center">
        <div 
          className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${borderSizeClasses[size]} border-green-600 mb-4`}
          aria-hidden="true"
        ></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}