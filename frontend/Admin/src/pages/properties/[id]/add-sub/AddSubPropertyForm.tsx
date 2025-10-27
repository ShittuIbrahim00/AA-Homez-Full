"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react"
;import { toast } from "react-toastify";
import { useProperties, useProperty, useCreateSubProperty } from "@/hooks/useProperty";

import axios from "axios";
import NumberSelector from "../add-sub/components/NumberSelector";
import TagMultiSelect from "./components/TagMultiSelect";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { dividerClasses } from "@mui/material";
import { formatPrice, parsePriceString } from "@/utils/priceFormatter";

interface Bathroom {
   id: string; // unique ID for React key
  type: string;
  count: number;
}

interface KeyValue {
     id: string;
  label: string;
  value: string;
}

// Update the Property interface to match the actual API response
interface Property {
  pid: number;  // Changed from _id: string
  name: string;
}

export default function AddSubPropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const params = useParams();
  const propertyId = params?.id; 

  const [propertyName, setPropertyName] = useState("");
  const { properties, loading: propertiesLoading } = useProperties();
  const { property: singleProperty, loading: propertyLoading } = useProperty(id as string);
  const { createSubProperty, loading: createLoading } = useCreateSubProperty();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(id ? String(id) : null);


  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string>("");
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [bedrooms, setBedrooms] = useState(0);
const [bathrooms, setBathrooms] = useState<Bathroom[]>([
  { id: crypto.randomUUID(), type: "Full", count: 0 },
]);


  // const [kitchens, setKitchens] = useState(0);
  // const [garages, setGarages] = useState(0);
  const [type, setType] = useState("");
const [loading, setLoading] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [createdSubPropertyId, setCreatedSubPropertyId] = useState<number | null>(null);

  // Multi-fields
  const [keyInfo, setKeyInfo] = useState<KeyValue[]>([]);

  const [appliances, setAppliances] = useState<string[]>([]);
  const [interior, setInterior] = useState<string[]>([]);
  const [otherRooms, setOtherRooms] = useState<string[]>([]);
const [landInfo, setLandInfo] = useState<KeyValue[]>([]);

  const [utilities, setUtilities] = useState<string[]>([]);

  // Other fields
  const [mapLink, setMapLink] = useState("");
  const [landMark, setLandMark] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [foundation, setFoundation] = useState("");
  // Listing status temporarily disabled due to backend validation error
  // const [listingStatus, setListingStatus] = useState("available");

  // Images
  const [livingRoomImages, setLivingRoomImages] = useState<File[]>([]);
  const [bedroomImages, setBedroomImages] = useState<File[]>([]);
  const [kitchenImages, setKitchenImages] = useState<File[]>([]);
  const [bathroomImages, setBathroomImages] = useState<File[]>([]);
  const [garageImages, setGarageImages] = useState<File[]>([]);
  const [otherImages, setOtherImages] = useState<File[]>([]);

  const imgInputRefs = {
    living: useRef<HTMLInputElement>(null),
    bedroom: useRef<HTMLInputElement>(null),
    kitchen: useRef<HTMLInputElement>(null),
    bathroom: useRef<HTMLInputElement>(null),
    garage: useRef<HTMLInputElement>(null),
    other: useRef<HTMLInputElement>(null),
  };

  const inputClass =
    "border border-gray-300 rounded px-4 py-2 w-full text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition";
  const labelClass = "text-gray-800 font-semibold mb-1";

  const imageCategories = [
    { label: "Living Room", images: livingRoomImages, setImages: setLivingRoomImages, ref: imgInputRefs.living },
    { label: "Bedroom", images: bedroomImages, setImages: setBedroomImages, ref: imgInputRefs.bedroom },
    { label: "Kitchen", images: kitchenImages, setImages: setKitchenImages, ref: imgInputRefs.kitchen },
    { label: "Bathroom", images: bathroomImages, setImages: setBathroomImages, ref: imgInputRefs.bathroom },
    { label: "Garage", images: garageImages, setImages: setGarageImages, ref: imgInputRefs.garage },
    { label: "Other", images: otherImages, setImages: setOtherImages, ref: imgInputRefs.other },
  ];

 useEffect(() => {
    if (id) {
      // Use the hook data instead of direct API call
      if (singleProperty) {
        setPropertyName(singleProperty.name || "");
      }
    } else {
      // Properties are already loaded via the hook
    }
  }, [id, singleProperty]);

 const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setImages: React.Dispatch<React.SetStateAction<File[]>>
) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    setImages(prev => [...prev, ...Array.from(files)]);
  }
};

  // Format price with Naira sign and commas
  const formatPriceInput = (value: string) => {
    // Remove all non-digit characters
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    // Format with Naira sign and commas
    return `₦${Number(num).toLocaleString()}`;
  };

  // Parse formatted price back to number string
  const parseFormattedPrice = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast.error("Sub-property name is required");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }
    
    const priceValue = parseFormattedPrice(formattedPrice);
    if (!priceValue || Number(priceValue) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    
    if (bedrooms < 0) {
      toast.error("Bedrooms must be a positive number");
      return;
    }
    
    if (!type) {
      toast.error("Property type is required");
      return;
    }

    // Validate bathrooms
    for (const bathroom of bathrooms) {
      if (bathroom.count < 0) {
        toast.error("Bathroom count must be a positive number");
        return;
      }
    }

    // Validate images (at least one required)
    const allImages = [...livingRoomImages, ...bedroomImages, ...kitchenImages, ...bathroomImages, ...garageImages, ...otherImages];
    if (allImages.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    // ✅ Determine final property ID (from URL OR dropdown)
    const targetId = id || selectedProperty;
    if (!targetId) {
      toast.warn("Please select a property first.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", priceValue);
    formData.append("bedrooms", bedrooms.toString());
    // formData.append("kitchens", kitchens.toString());
    // formData.append("garages", garages.toString());
    formData.append("mapLink", mapLink);
    formData.append("landMark", landMark);
    formData.append("yearBuilt", yearBuilt);
    formData.append("foundation", foundation);
    formData.append("type", type);
    // Listing status temporarily disabled due to backend validation error
    // formData.append("listingStatus", "available");

    keyInfo.forEach((item, i) => {
      formData.append(`keyInfo[${i}][label]`, item.label);
      formData.append(`keyInfo[${i}][value]`, item.value);
    });

    bathrooms.forEach((b, i) => {
      formData.append(`bathrooms[${i}][type]`, b.type);
      formData.append(`bathrooms[${i}][count]`, b.count.toString());
    });

    appliances.forEach((a, i) => formData.append(`appliances[${i}]`, a));
    interior.forEach((i, idx) => formData.append(`interior[${idx}]`, i));
    otherRooms.forEach((r, idx) => formData.append(`otherRooms[${idx}]`, r));

    landInfo.forEach((item, i) => {
      formData.append(`landInfo[${i}][label]`, item.label);
      formData.append(`landInfo[${i}][value]`, item.value);
    });

    utilities.forEach((u, i) => formData.append(`utilities[${i}]`, u));

    [...livingRoomImages, ...bedroomImages, ...kitchenImages, ...bathroomImages, ...garageImages, ...otherImages]
      .forEach(file => formData.append("images", file));

    try {
      const response = await createSubProperty(Number(targetId), formData);
      
      // Log the full response for debugging
      console.log("🔍 AddSubPropertyForm - Create sub-property response:", response);
      console.log("🔍 AddSubPropertyForm - Created sub-property data:", response?.data);
      console.log("🔍 AddSubPropertyForm - Created sub-property listingStatus:", response?.data?.listingStatus);
      
      // Store the created sub-property ID
      if (response?.data?.sid) {
        setCreatedSubPropertyId(response.data.sid);
      }
      
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Error adding sub-property:", err);
      toast.error("Failed to add sub-property.");
    }
  };

 return (
  
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg my-6 text-black">
      <button
        onClick={() => router.back()}
        className="md:px-4 p-2 items-center gap-2 md:py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-xs flex flex-row mb-4"
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      <h1 className="md:text-3xl font-bold mb-6">
        Add Sub-Property{" "}
        {id ? `to: ${propertyName}` : selectedProperty ? "" : "(Select Property First)"}
      </h1>

      {/* Dropdown only if no id in URL */}
      {!id && (
        <div className="mb-6">
          <label className={labelClass}>Select Property</label>
          <select
            value={selectedProperty || ""}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">-- Choose Property --</option>
            {properties.map((prop) => (
              <option key={prop.pid} value={prop.pid}>  {/* Changed from prop._id */}
                {prop.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show form only when property is selected */}
      {(id || selectedProperty) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className={labelClass}>Sub-property Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter sub-property name" className={inputClass} required />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location" className={inputClass} required />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter property description" className={inputClass + " h-32 resize-none"} required />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className={labelClass}>Price</label>
          <input
            type="text"
            value={formattedPrice}
            onChange={e => {
              const formatted = formatPriceInput(e.target.value);
              setFormattedPrice(formatted);
              // Update the price state with the numeric value for validation
              setPrice(parseFormattedPrice(formatted));
            }}
            placeholder="Enter price (e.g. ₦5,000,000)"
            className={inputClass}
            required
          />
        </div>

        {/* Number selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberSelector label="Bedrooms" value={bedrooms} setValue={setBedrooms} />
          {/* <NumberSelector label="Kitchens" value={kitchens} setValue={setKitchens} /> */}
          {/* <NumberSelector label="Garages" value={garages} setValue={setGarages} /> */}
        </div>

<div className="flex flex-col">
  <label className={labelClass}>Type</label>
  <select value={type} onChange={e => setType(e.target.value)} className={inputClass} required>
    <option value="">Select type</option>
    <option value="Rent">Rent</option>
    <option value="Sale">Sale</option>
  </select>
</div>

{/* Listing status temporarily disabled due to backend validation error
<div className="flex flex-col">
  <label className={labelClass}>Listing Status</label>
  <select 
    value={listingStatus} 
    onChange={e => setListingStatus(e.target.value)} 
    className={inputClass}
  >
    <option value="available">Available</option>
    <option value="unavailable">Unavailable</option>
  </select>
</div> */}


        {/* Dynamic Bathrooms */}
      <div className="flex flex-col">
  <label className={labelClass}>Bathrooms</label>
  {bathrooms.map((b) => (
    <div key={b.id} className="flex gap-2 mb-2 items-center">
      <select
        value={b.type}
        onChange={(e) =>
          setBathrooms((prev) =>
            prev.map((bath) =>
              bath.id === b.id ? { ...bath, type: e.target.value } : bath
            )
          )
        }
        className={inputClass + " w-32"}
      >
        <option value="Full">Full</option>
        <option value="Half">Half</option>
        <option value="Shower">Shower</option>
      </select>

      <NumberSelector
        label=""
        value={b.count}
        setValue={(val) =>
          setBathrooms((prev) =>
            prev.map((bath) =>
              bath.id === b.id ? { ...bath, count: val } : bath
            )
          )
        }
      />

      <button
        type="button"
        className="text-red-500"
        onClick={() =>
          setBathrooms((prev) => prev.filter((bath) => bath.id !== b.id))
        }
      >
        <FaTrash />
      </button>
    </div>
  ))}

  <button
    type="button"
    className="mt-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition w-fit"
    onClick={() =>
      setBathrooms((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type: "Full", count: 0 },
      ])
    }
  >
    Add Bathroom
  </button>
</div>


        {/* Multi-fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TagMultiSelect label="Appliances" options={["Fridge","Oven","Microwave","Dishwasher"]} selected={appliances} setSelected={setAppliances} />
          <TagMultiSelect label="Interior" options={["Modern","Classic","Minimalist"]} selected={interior} setSelected={setInterior} />
          <TagMultiSelect label="Other Rooms" options={["Study","Library","Gym"]} selected={otherRooms} setSelected={setOtherRooms} />
          <TagMultiSelect label="Utilities" options={["Electricity","Water","Gas"]} selected={utilities} setSelected={setUtilities} />
        </div>

        {/* Dynamic Key Info */}
       <div className="flex flex-col">
  <label className={labelClass}>Key Info</label>
  {keyInfo.map((item) => (
    <div key={item.id} className="flex gap-2 mb-2 items-center">
      <input
        type="text"
        placeholder="Label"
        value={item.label}
        onChange={(e) =>
          setKeyInfo((prev) =>
            prev.map((k) =>
              k.id === item.id ? { ...k, label: e.target.value } : k
            )
          )
        }
        className={inputClass + " w-32"}
      />
      <input
        type="text"
        placeholder="Value"
        value={item.value}
        onChange={(e) =>
          setKeyInfo((prev) =>
            prev.map((k) =>
              k.id === item.id ? { ...k, value: e.target.value } : k
            )
          )
        }
        className={inputClass + " w-32"}
      />
      <button
        type="button"
        className="text-red-500"
        onClick={() =>
          setKeyInfo((prev) => prev.filter((k) => k.id !== item.id))
        }
      >
        <FaTrash />
      </button>
    </div>
  ))}

  <button
    type="button"
    className="mt-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition w-fit"
    onClick={() =>
      setKeyInfo((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: "", value: "" },
      ])
    }
  >
    Add Key Info
  </button>
</div>


        {/* Dynamic Land Info */}
     <div className="flex flex-col">
  <label className={labelClass}>Land Info</label>
  {landInfo.map((item) => (
    <div key={item.id} className="flex gap-2 mb-2 items-center">
      <input
        type="text"
        placeholder="Label"
        value={item.label}
        onChange={(e) =>
          setLandInfo((prev) =>
            prev.map((k) =>
              k.id === item.id ? { ...k, label: e.target.value } : k
            )
          )
        }
        className={inputClass + " w-32"}
      />
      <input
        type="text"
        placeholder="Value"
        value={item.value}
        onChange={(e) =>
          setLandInfo((prev) =>
            prev.map((k) =>
              k.id === item.id ? { ...k, value: e.target.value } : k
            )
          )
        }
        className={inputClass + " w-32"}
      />
      <button
        type="button"
        className="text-red-500"
        onClick={() =>
          setLandInfo((prev) => prev.filter((k) => k.id !== item.id))
        }
      >
        <FaTrash />
      </button>
    </div>
  ))}

  <button
    type="button"
    className="mt-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition w-fit"
    onClick={() =>
      setLandInfo((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: "", value: "" },
      ])
    }
  >
    Add Land Info
  </button>
</div>


        {/* Other Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className={labelClass}>Map Link</label>
            <input type="text" value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="Enter map link" className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Landmark</label>
            <input type="text" value={landMark} onChange={e => setLandMark(e.target.value)} placeholder="Enter landmark" className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Year Built</label>
            <input type="text" value={yearBuilt} onChange={e => setYearBuilt(e.target.value)} placeholder="Enter year built" className={inputClass} />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Foundation</label>
            <input type="text" value={foundation} onChange={e => setFoundation(e.target.value)} placeholder="Enter foundation" className={inputClass} />
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 font-semibold text-lg mb-4">Property Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageCategories.map(({ label, images, setImages, ref }) =>
              images.map((file, i) => (
                <div key={`${label}-${i}`} className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition">
                  <img src={URL.createObjectURL(file)} alt={`${label}-${i}`} className="w-full h-full object-cover" />
                  <button type="button" className="absolute top-1 right-1 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>&times;</button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {imageCategories.map(({ label, setImages, ref }) => (
              <div key={label}>
                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition" onClick={() => ref.current?.click()}>
                  <FaPlus /> Add {label} Images
                </button>
                <input type="file" multiple accept="image/*" ref={ref} onChange={(e) => handleFileChange(e, setImages)} className="hidden" />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Supported formats: PNG, JPG, JPEG</p>
        </div>

       <button
  type="submit"
  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition w-fit mt-4 flex items-center gap-2"
  disabled={createLoading}
>
  {createLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      Saving...
    </>
  ) : (
    "Add Sub-Property"
  )}
</button>




      </form>
      )}



   {/* 🚀 Animated & Responsive Success Modal with Confetti */}
{showSuccessModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6">
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-slideUpFade relative overflow-hidden">

      {/* ✅ Confetti Layer */}
      {Array.from({ length: 30 }).map((_, idx) => {
        const size = Math.random() * 6 + 4; // 4px to 10px
        const left = Math.random() * 100; // percentage from left
        const delay = Math.random() * 0.8; // stagger animations
        const colors = ['#FE783D', '#E14B0E', '#FFDD57', '#00CC99', '#1293BA'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <span
            key={idx}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              backgroundColor: color,
              top: '-10px',
              animation: `confettiFall 1.2s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}

      {/* ✅ Success Icon */}
      <div className="flex justify-center mb-4 relative z-10">
        <div className="bg-green-100 rounded-full p-3 sm:p-4 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Title & Message */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 relative z-10">
        Sub-Property Created!
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base relative z-10">
        Your sub-property has been successfully added.<br />
        What would you like to do next?
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
        <button
          onClick={() => {
            // Redirect to the sub-property view page if we have the ID
            const propertyId = id || selectedProperty; // Use the same logic as in handleSubmit
            if (createdSubPropertyId && propertyId) {
              router.push(`/properties/${propertyId}/sub/${createdSubPropertyId}`);
            } else {
              router.push("/properties");
            }
          }}
          className="bg-orange-500 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-orange-600 transition transform hover:scale-105 w-full sm:w-auto"
        >
          View Sub-Property
        </button>
        <button
          onClick={() => {
            setShowSuccessModal(false);

            // Reset all form fields individually
            setName("");
            setDescription("");
            setLocation("");
            setPrice("");
            setFormattedPrice("");
            setBedrooms(0);
            setBathrooms([{ id: crypto.randomUUID(), type: "Full", count: 0 }]);
            // setKitchens(0);
            // setGarages(0);
            setType("");
            setKeyInfo([]);
            setAppliances([]);
            setInterior([]);
            setOtherRooms([]);
            setLandInfo([]);
            setUtilities([]);
            setMapLink("");
            setLandMark("");
            setYearBuilt("");
            setFoundation("");
            setLivingRoomImages([]);
            setBedroomImages([]);
            setKitchenImages([]);
            setBathroomImages([]);
            setGarageImages([]);
            setOtherImages([]);
          }}
          className="bg-gray-100 text-gray-700 px-5 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition transform hover:scale-105 w-full sm:w-auto"
        >
          Add Another
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}