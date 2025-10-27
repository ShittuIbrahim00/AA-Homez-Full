// components/PropertyDetails/ImagePreviewModal.tsx
import React from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="relative max-w-full">
        <button
          className="absolute top-2 right-2 text-white text-2xl p-1 hover:text-gray-300"
          onClick={onClose}
          aria-label="Close image preview"
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          className="max-h-[80vh] w-full sm:w-auto object-contain rounded"
          alt="Preview"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
