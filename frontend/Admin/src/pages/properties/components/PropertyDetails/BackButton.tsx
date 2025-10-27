// components/PropertyDetails/BackButton.tsx
import React from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm border border-gray-200"
    >
      <FaArrowLeft className="text-gray-500" /> 
      <span className="font-medium">Back to Properties</span>
    </button>
  );
};

export default BackButton;