import React, { Dispatch, SetStateAction } from "react";

type Props = {
  selectedImage: string;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
};

export default function ImagePreviewModal({ selectedImage, setSelectedImage }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={() => setSelectedImage(null)}
    >
      <img
        src={selectedImage}
        alt="Large Preview"
        className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
      />
    </div>
  );
}
