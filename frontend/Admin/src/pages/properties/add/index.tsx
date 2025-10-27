"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { _addProperty } from "@/hooks/property.hooks";
import { toast } from "react-toastify";
import Loader from "@/layouts/Loader";

export default function AddProperty() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    price: 0,
    mapLink: "",
    landMark: "",
    yearBuilt: 0,
    type: "",
    listingStatus: "",
  });

  const [formattedPrice, setFormattedPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm bg-white text-sm sm:text-base";
  const labelStyle =
    "block text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 text-gray-700 transition-colors group-focus-within:text-orange-600";

  // Format price with Naira sign and commas
  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    return `₦${Number(num).toLocaleString()}`;
  };

  // Parse formatted price back to number
  const parsePrice = (value: string) => {
    return Number(value.replace(/\D/g, ""));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      // Create previews
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append form fields
      Object.entries(form).forEach(([key, value]) => {
        // Handle price fields
        if (key === "price") {
          const formattedValue = parsePrice(formattedPrice);
          formData.append(key, formattedValue.toString());
        } else {
          formData.append(key, value.toString());
        }
      });

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await _addProperty(formData);

      if (res?.status) {
        toast.success("Property added successfully!");
        setShowSuccessModal(true);
      } else {
        toast.error(res?.message || "Failed to add property");
      }
    } catch (err: any) {
      console.error("Add property error:", err);
      toast.error(err.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      location: "",
      price: 0,
      mapLink: "",
      landMark: "",
      yearBuilt: 0,
      type: "",
      listingStatus: "",
    });
    setFormattedPrice("");
    setImages([]);
    setPreviews([]);
    setShowSuccessModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Property</h1>

      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Property Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputStyle}
              required
            >
              <option value="">Select Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Land">Land</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Listing Status</label>
            <select
              value={form.listingStatus}
              onChange={(e) =>
                setForm({ ...form, listingStatus: e.target.value })
              }
              className={inputStyle}
              required
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Price</label>
            <input
              type="text"
              value={formattedPrice}
              onChange={(e) => {
                const formatted = formatPrice(e.target.value);
                setFormattedPrice(formatted);
                setForm({ ...form, price: parsePrice(formatted) });
              }}
              className={inputStyle}
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Year Built</label>
            <input
              type="number"
              value={form.yearBuilt || ""}
              onChange={(e) =>
                setForm({ ...form, yearBuilt: Number(e.target.value) })
              }
              className={inputStyle}
              placeholder="e.g., 2020"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputStyle} h-32`}
            placeholder="Describe the property..."
            required
          />
        </div>

        {/* Price Range */}
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Price Start</label>
            <input
              type="text"
              value={formattedPriceStart}
              onChange={(e) => {
                const formatted = formatPrice(e.target.value);
                setFormattedPriceStart(formatted);
                setForm({ ...form, priceStart: parsePrice(formatted) });
              }}
              className={inputStyle}
              placeholder="Starting price"
            />
          </div>

          <div>
            <label className={labelStyle}>Price End</label>
            <input
              type="text"
              value={formattedPriceEnd}
              onChange={(e) => {
                const formatted = formatPrice(e.target.value);
                setFormattedPriceEnd(formatted);
                setForm({ ...form, priceEnd: parsePrice(formatted) });
              }}
              className={inputStyle}
              placeholder="Ending price"
            />
          </div>
        </div>
        */}

        {/* Map & Landmark */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Map Link</label>
            <input
              type="text"
              value={form.mapLink}
              onChange={(e) => setForm({ ...form, mapLink: e.target.value })}
              className={inputStyle}
              placeholder="Google Maps link"
            />
          </div>

          <div>
            <label className={labelStyle}>Landmark</label>
            <input
              type="text"
              value={form.landMark}
              onChange={(e) => setForm({ ...form, landMark: e.target.value })}
              className={inputStyle}
              placeholder="Nearby landmark"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className={labelStyle}>Property Images</label>
          <div className="mt-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-500 file:text-white
                hover:file:bg-orange-600 transition"
            />
          </div>

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? "Adding Property..." : "Add Property"}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Property Added!</h3>
            <p className="text-gray-600 mb-6">
              Your property has been successfully added to the system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  resetForm();
                  router.push("/properties");
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                View Properties
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
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