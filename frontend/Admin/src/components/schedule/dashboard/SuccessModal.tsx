import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-xs sm:max-w-sm w-full p-4 sm:p-6 text-center shadow-xl">
        <h2 className="text-green-600 text-lg sm:text-xl font-bold mb-2">
          Rescheduled Successfully
        </h2>
        <p className="text-gray-700 text-xs sm:text-sm mb-4">
          The appointment has been updated successfully.
        </p>
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;