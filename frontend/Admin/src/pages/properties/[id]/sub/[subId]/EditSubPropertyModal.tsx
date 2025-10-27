"use client";

import { useRouter } from "next/router";
import { useEffect, useState, ChangeEvent } from "react";
import Loader from "@/layouts/Loader";
import { fetchSubProperty, updateSubProperty } from "@/hooks/property.hooks";
import { parsePriceString } from "@/utils/priceFormatter";
import { toast } from "react-toastify";
interface KeyValue {
  label: string;
  value: string;
}

interface Bathroom {
  type: string;
  count: number;
}

const propertyTypes = ["Rent", "Sale", "Lease"];

const EditSubPropertyPage = () => {
  const router = useRouter();
  const { id: propertyId, subId: subPropertyId } = router.query;

  const [subProperty, setSubProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<any>({
    name: "",
    description: "",
    price: 0,
    bedrooms: 0,
    bathrooms: [] as Bathroom[],
    location: "",
    landMark: "",
    type: "Rent",
    yearBuilt: "",
    keyInfo: [] as KeyValue[],
    landInfo: [] as KeyValue[],
    appliances: [] as string[],
    interior: [] as string[],
    otherRooms: [] as string[],
    utilities: [] as string[],
    images: [] as File[],
    existingImages: [] as string[],
  });

  // Remove the old parsePriceString function since we're importing it

  // Fetch sub-property
  useEffect(() => {
    if (!propertyId || !subPropertyId) return;

    const getData = async () => {
      try {
        setLoading(true);
        const sub = await fetchSubProperty(propertyId as string, subPropertyId as string);
        setSubProperty(sub);

        // Add null check before accessing sub properties
        if (sub) {
          setFormValues({
            name: sub.name || "",
            description: sub.description || "",
            price: parsePriceString(sub.price),
            bedrooms: sub.bedrooms || 0,
            bathrooms: sub.bathrooms || [],
            location: sub.location || "",
            landMark: sub.landMark || "",
            type: sub.type || "Rent",
            yearBuilt: sub.yearBuilt || "",
            keyInfo: sub.keyInfo || [],
            landInfo: sub.landInfo || [],
            appliances: sub.appliances || [],
            interior: sub.interior || [],
            otherRooms: sub.otherRooms || [],
            utilities: sub.utilities || [],
            images: [],
            existingImages: sub.images || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [propertyId, subPropertyId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: string, value: string, idx: number) => {
    const arr = [...formValues[field]];
    arr[idx] = value;
    setFormValues((prev: any) => ({ ...prev, [field]: arr }));
  };

  const handleKeyValueChange = (field: string, idx: number, key: "label" | "value", value: string) => {
    const arr = [...formValues[field]];
    arr[idx][key] = value;
    setFormValues((prev: any) => ({ ...prev, [field]: arr }));
  };

  const handleAddArrayItem = (field: string) => {
    if (["keyInfo", "landInfo"].includes(field)) {
      setFormValues((prev: any) => ({ ...prev, [field]: [...prev[field], { label: "", value: "" }] }));
    } else {
      setFormValues((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const handleRemoveArrayItem = (field: string, idx: number) => {
    const arr = [...formValues[field]];
    arr.splice(idx, 1);
    setFormValues((prev: any) => ({ ...prev, [field]: arr }));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormValues((prev: any) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveNewImage = (idx: number) => {
    const newImages = [...formValues.images];
    newImages.splice(idx, 1);
    setFormValues((prev: any) => ({ ...prev, images: newImages }));
  };

  const handleRemoveExistingImage = (idx: number) => {
    const oldImages = [...formValues.existingImages];
    oldImages.splice(idx, 1);
    setFormValues((prev: any) => ({ ...prev, existingImages: oldImages }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        if (key === "images") {
          formValues.images.forEach((file: File) => formData.append("images", file));
        } else if (
          ["bathrooms", "appliances", "interior", "otherRooms", "utilities", "keyInfo", "landInfo"].includes(key)
        ) {
          formData.append(key, JSON.stringify(formValues[key]));
        } else {
          formData.append(key, formValues[key]);
        }
      });
      await updateSubProperty(subProperty.sid, formData);
      setSuccessMessage("Sub-property updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update sub-property.");
    }
  };

  if (loading) return <div className="p-6 flex justify-center items-center"><Loader /></div>;
  if (!subProperty) return <div className="p-6 text-center text-red-600">Sub-property not found.</div>;

  return (
    <div className="p-6 w-full text-black bg-gray-50 space-y-6">
      <button onClick={() => router.back()} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Back</button>
      <h1 className="text-2xl font-bold">Edit Sub-Property</h1>

      <div className="space-y-4">
        {/* Basic info */}
        <label className="block font-semibold">Property Name</label>
        <input type="text" name="name" value={formValues.name} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Description</label>
        <textarea name="description" value={formValues.description} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Price</label>
        <input type="number" name="price" value={formValues.price} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Bedrooms</label>
        <input type="number" name="bedrooms" value={formValues.bedrooms} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Property Type</label>
        <select name="type" value={formValues.type} onChange={handleChange} className="w-full p-2 border rounded">
          {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="block font-semibold">Year Built</label>
        <input type="text" name="yearBuilt" value={formValues.yearBuilt} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Location</label>
        <input type="text" name="location" value={formValues.location} onChange={handleChange} className="w-full p-2 border rounded" />

        <label className="block font-semibold">Landmark</label>
        <input type="text" name="landMark" value={formValues.landMark} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* Bathrooms, Key Info, Land Info, arrays... */}
        {/* ...same as your code... */}

        {/* Images */}
        <div>
          <label className="block font-semibold">Images</label>
          <input type="file" multiple onChange={handleImagesChange} className="mb-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Existing images */}
            {formValues.existingImages.map((img: string, idx: number) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`existing-${idx}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setPreviewImage(img)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  x
                </button>
              </div>
            ))}

            {/* Newly selected images */}
            {formValues.images.map((file: File, idx: number) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`new-${idx}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setPreviewImage(URL.createObjectURL(file))}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 mt-4">
          Update Sub-Property
        </button>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>

      {/* Modal preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full">
            <button
              className="absolute top-2 right-2 text-white text-2xl p-1 hover:text-gray-300"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>
            <img
              src={previewImage}
              className="max-h-[80vh] w-full sm:w-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubPropertyPage;