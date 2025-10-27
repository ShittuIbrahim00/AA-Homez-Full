// components/PropertyDetails/DeleteConfirmationModal.tsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  propertyName: string;
}

const DeleteConfirmationModal: React.FC<Props> = ({
  show,
  onClose,
  onConfirm,
  isDeleting,
  propertyName,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-600 text-3xl" />
          <h2 className="text-xl font-semibold">Confirm Delete</h2>
        </div>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete the property{" "}
          <strong>{propertyName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
