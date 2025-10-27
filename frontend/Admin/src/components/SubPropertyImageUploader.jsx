import React, { useRef } from "react";

const SubPropertyImageUploader = ({ subProperties, onImageChange }) => {
  const fileInputRef = useRef(null);
  const currentIndexRef = useRef(null);

  const handleSubPropertyClick = (index) => {
    currentIndexRef.current = index;
    fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    if (!currentIndexRef.current && currentIndexRef.current !== 0) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert files to array of URLs or file objects as needed
    const fileArray = Array.from(files);
    onImageChange(currentIndexRef.current, fileArray);

    // Reset input value to allow selecting same file again if needed
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-4">
      {subProperties.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer w-24 h-24 border rounded overflow-hidden flex flex-col items-center"
          onClick={() => handleSubPropertyClick(index)}
          title={`Edit images for ${item.name}`}
        >
          {item.images && item.images.length > 0 ? (
            <img
              src={typeof item.images[0] === "string" ? item.images[0] : URL.createObjectURL(item.images[0])}
              alt={item.name}
              className="w-full h-16 object-cover"
            />
          ) : (
            <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div className="text-center mt-1 text-sm">{item.name}</div>
        </div>
      ))}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFilesSelected}
      />
    </div>
  );
};

export default SubPropertyImageUploader;
