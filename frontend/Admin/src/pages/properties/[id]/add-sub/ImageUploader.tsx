// pages/properties/[id]/add-sub/components/ImageUploader.tsx
import React from "react";
import { FaPlus } from "react-icons/fa";

interface Props {
  imgInputRefs: any;
  livingRoomImages: File[];
  setLivingRoomImages: React.Dispatch<React.SetStateAction<File[]>>;
  bedroomImages: File[];
  setBedroomImages: React.Dispatch<React.SetStateAction<File[]>>;
  kitchenImages: File[];
  setKitchenImages: React.Dispatch<React.SetStateAction<File[]>>;
  bathroomImages: File[];
  setBathroomImages: React.Dispatch<React.SetStateAction<File[]>>;
  garageImages: File[];
  setGarageImages: React.Dispatch<React.SetStateAction<File[]>>;
  otherImages: File[];
  setOtherImages: React.Dispatch<React.SetStateAction<File[]>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<File[]>>) => void;
}

export default function ImageUploader({ imgInputRefs, livingRoomImages, setLivingRoomImages, bedroomImages, setBedroomImages, kitchenImages, setKitchenImages, bathroomImages, setBathroomImages, garageImages, setGarageImages, otherImages, setOtherImages, handleFileChange }: Props) {
  const categories = [
    { label: "Living Room", state: livingRoomImages, setState: setLivingRoomImages, ref: imgInputRefs.living },
    { label: "Bedroom", state: bedroomImages, setState: setBedroomImages, ref: imgInputRefs.bedroom },
    { label: "Kitchen", state: kitchenImages, setState: setKitchenImages, ref: imgInputRefs.kitchen },
    { label: "Bathroom", state: bathroomImages, setState: setBathroomImages, ref: imgInputRefs.bathroom },
    { label: "Garage", state: garageImages, setState: setGarageImages, ref: imgInputRefs.garage },
    { label: "Other", state: otherImages, setState: setOtherImages, ref: imgInputRefs.other },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-gray-800 font-semibold text-lg mb-4">Property Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(({ label, state, setState, ref }) =>
          state.map((file, i) => (
            <div key={`${label}-${i}`} className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition">
              <img src={URL.createObjectURL(file)} alt={`${label}-${i}`} className="w-full h-full object-cover" />
              <button type="button" className="absolute top-1 right-1 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition" onClick={() => setState(state.filter((_, idx) => idx !== i))}>
                &times;
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {categories.map(({ label, ref, setState }) => (
          <div key={label}>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition" onClick={() => ref.current?.click()}>
              <FaPlus /> Add {label} Images
            </button>
            <input type="file" multiple accept="image/*" ref={ref} onChange={(e) => handleFileChange(e, setState)} className="hidden" />
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">Supported formats: PNG, JPG, JPEG</p>
    </div>
  );
}
