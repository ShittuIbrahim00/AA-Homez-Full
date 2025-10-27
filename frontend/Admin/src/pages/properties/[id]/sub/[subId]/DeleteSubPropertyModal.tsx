"use client";

import React, { useState } from "react";
import { deleteSubProperty } from "@/hooks/property.hooks";
import { toast } from "react-toastify";

interface DeleteSubPropertyModalProps {
  isOpen: boolean;
  subPropertyName: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteSubPropertyModal: React.FC<DeleteSubPropertyModalProps> = ({
  isOpen,
  subPropertyName,
  onCancel,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete sub-property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full text-center">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete <strong>{subPropertyName}</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubPropertyModal;
