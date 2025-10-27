"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { _cloudinaryUpload } from "@/hooks/global.hooks";
import { updateProperty } from "@/hooks/property.hooks"; // Import JavaScript version
import { useFetchProperty } from "@/hooks/useFetchProperty";
import { toast } from "react-toastify";
import Loader from "@/layouts/Loader";
import PropertyForm from "./components/PropertyForm";
import ImageUploader from "./components/ImageUploader";
import ImagePreviewModal from "./components/ImagePreviewModal";

// Helper: format price with Naira sign and commas
function formatPrice(value: string | number) {
  if (!value && value !== 0) return "";
  
  // Handle different input types and formatted values like "5.0M"
  let numericValue: number;
  
  if (typeof value === 'number') {
    numericValue = value;
  } else {
    const valueStr = value.toString().toUpperCase();
    
    if (valueStr.includes('M')) {
      // Million: "5.0M" -> 5000000
      const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
      numericValue = num * 1000000;
    } else if (valueStr.includes('B')) {
      // Billion: "2.5B" -> 2500000000
      const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
      numericValue = num * 1000000000;
    } else if (valueStr.includes('K')) {
      // Thousand: "1.2K" -> 1200
      const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
      numericValue = num * 1000;
    } else {
      // Regular number or formatted number
      numericValue = Number(valueStr.replace(/[^0-9.]/g, ''));
    }
  }
  
  if (isNaN(numericValue) || numericValue === 0) return "";
  
  return `₦${numericValue.toLocaleString()}`;
}

// Helper: parse price for submission
function parsePrice(value: string) {
  if (!value) return 0;
  
  const valueStr = value.toString().toUpperCase();
  
  if (valueStr.includes('M')) {
    // Million: "₦5,000,000" or "5.0M" -> 5000000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return num * 1000000;
  } else if (valueStr.includes('B')) {
    // Billion: "₦5,000,000,000" or "5.0B" -> 5000000000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return num * 1000000000;
  } else if (valueStr.includes('K')) {
    // Thousand: "₦5,000" or "5.0K" -> 5000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return num * 1000;
  } else {
    // Regular formatted number: "₦5,000,000" -> 5000000
    return Number(valueStr.replace(/[^0-9.]/g, ''));
  }
}

// Helper: convert URL to File for submission
const urlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export default function UpdateProperty() {
  const router = useRouter();
  const { id } = router.query;

  // Keep form fields as strings to match API format (prices, yearBuilt as strings)
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    mapLink: "",
    landMark: "",
    yearBuilt: "",
    type: "",
  });

  // URLs of images already uploaded & loaded from backend
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Files of new images added by user
  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { property, loading: fetching, error } = useFetchProperty(id as string);

  // Populate form and existing images URLs when property loads
  useEffect(() => {
    if (property) {
      // console.log("📥 Property data received:", property);
      setForm({
        name: property.name || "",
        description: property.description || "",
        location: property.location || "",
        price: property.price ? formatPrice(property.price) : "",
        mapLink: property.mapLink || "",
        landMark: property.landMark || "",
        yearBuilt: property.yearBuilt || "",
        type: property.type || "",
      });

      if (property.images && Array.isArray(property.images)) {
        // console.log("📥 Existing images from property:", property.images);
        setExistingImages(property.images);
      } else {
        // console.log("📥 No existing images found in property data");
        setExistingImages([]);
      }
      setNewImages([]); // reset new images on load
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return toast.error("Invalid property ID");

    // console.log("📤 Form data:", form);
    // console.log("📤 Existing images:", existingImages);
    // console.log("📤 New images:", newImages);

    if (
      !form.name ||
      !form.description ||
      !form.location ||
      !form.price ||
      !form.type
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      
      // Create FormData for the update request (like sub-property update)
      const formData = new FormData();
      
      // Add basic form fields
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("price", parsePrice(form.price).toString());
      formData.append("mapLink", form.mapLink);
      formData.append("landMark", form.landMark);
      formData.append("yearBuilt", form.yearBuilt);
      formData.append("type", form.type);
      
      // Handle images - convert existing image URLs to Files and append with new images
      const existingImageFiles = await Promise.all(
        existingImages.map((url, index) => urlToFile(url, `existing-image-${index}.jpg`))
      );
      
      // Append all images (existing + new) as "images"
      [...existingImageFiles, ...newImages].forEach((file) => {
        formData.append("images", file);
      });
      
      // Log all form data entries
      // console.log("🔄 FormData entries:");
      for (const [key, value] of formData.entries()) {
        // console.log(`  ${key}:`, value);
      }

      // Pass formData to the update function
      const res = await updateProperty(Number(id), formData);

      if (res.success) {
        toast.success("Property updated successfully");
        // Redirect with a refresh parameter to trigger data refetch
        router.push(`/properties/${id}?updated=true`);
      } else {
        toast.error(res.message || "Failed to update property");
      }
    } catch (err) {
      console.error("🔴 Submit error:", err);
      toast.error("Error updating property");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Loader />
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 p-4">
        Error loading property: {error.toString()}
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 bg-white shadow-xl rounded-2xl mt-6 border border-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Update Property
        </h1>
        <div className="h-1 w-20 bg-orange-500 mt-2 rounded"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PropertyForm form={form} setForm={setForm} />

        <ImageUploader
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          newImages={newImages}
          setNewImages={setNewImages}
          setSelectedImage={setSelectedImage}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg shadow-lg font-semibold text-base sm:text-lg hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Updating..." : "Update Property"}
        </button>
      </form>

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
}