import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type Props = {
  existingImages: string[];
  setExistingImages: Dispatch<SetStateAction<string[]>>;
  newImages: File[];
  setNewImages: Dispatch<SetStateAction<File[]>>;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
};

const labelStyle =
  "block text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 text-gray-700 transition-colors group-focus-within:text-orange-600";

export default function ImageUploader({
  existingImages,
  setExistingImages,
  newImages,
  setNewImages,
  setSelectedImage,
}: Props) {
  const [newImagePreviews, setNewImagePreviews] = React.useState<string[]>([]);

  // Combined previews for display
  const previews = [...existingImages, ...newImagePreviews];

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    console.log("🖼️ New images selected:", fileArray);

    if (fileArray.length + newImages.length + existingImages.length > 10) {
      return toast.error("You can only upload up to 10 images");
    }

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => {
      const updated = [...prev, ...fileArray];
      console.log("🖼️ Updated newImages state:", updated);
      return updated;
    });
    setNewImagePreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      console.log("🖼️ Updated newImagePreviews state:", updated);
      return updated;
    });
  };

  const handleDelete = (src: string) => {
    console.log("🗑️ Deleting image:", src);
    if (existingImages.includes(src)) {
      console.log("🗑️ Deleting existing image");
      setExistingImages((prev) => {
        const updated = prev.filter((img) => img !== src);
        console.log("🗑️ Updated existingImages state:", updated);
        return updated;
      });
    } else {
      const indexToRemove = newImagePreviews.indexOf(src);
      if (indexToRemove === -1) return;

      console.log("🗑️ Deleting new image");
      setNewImages((prev) => {
        const updated = prev.filter((_, idx) => idx !== indexToRemove);
        console.log("🗑️ Updated newImages state:", updated);
        return updated;
      });
      setNewImagePreviews((prev) => {
        const updated = prev.filter((_, idx) => idx !== indexToRemove);
        console.log("🗑️ Updated newImagePreviews state:", updated);
        return updated;
      });

      URL.revokeObjectURL(src);
    }
  };

  React.useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  return (
    <div className="group">
      <label className={labelStyle}>Upload Images *</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageSelect(e.target.files)}
          className="hidden"
          id="images"
        />
        <label
          htmlFor="images"
          className="cursor-pointer text-orange-600 font-medium"
        >
          Click to upload or drag & drop (Max 10)
        </label>
      </div>

      {/* Thumbnails */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-3 relative">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group">
              <img
                src={src}
                alt={`Preview ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow cursor-pointer hover:opacity-80"
                onClick={() => setSelectedImage(src)}
              />
              <button
                type="button"
                onClick={() => handleDelete(src)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}