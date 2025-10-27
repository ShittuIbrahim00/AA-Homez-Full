"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchSubProperty, updateSubProperty } from "@/hooks/property.hooks";
import { toast } from "react-toastify";
import Loader from "@/layouts/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { formatPrice, parsePriceString } from "@/utils/priceFormatter";

interface KeyValue {
  label: string;
  value: string;
}

import type { Bathroom } from "@/types/property";

interface KeyValue {
  label: string;
  value: string;
}

const propertyTypes = ["Rent", "Sale", "Lease"];

export default function UpdateSubProperty() {
  const router = useRouter();
  const { id: propertyId, subId: subPropertyId } = router.query;

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    landMark: "",
    yearBuilt: "",
    type: "Rent",
    mapLink: "",
    foundation: "",
    keyInfo: [] as KeyValue[],
    landInfo: [] as KeyValue[],
    appliances: [] as string[],
    interior: [] as string[],
    otherRooms: [] as string[],
    utilities: [] as string[],
    bathrooms: [] as Bathroom[],
  });

  // URLs of images already uploaded & loaded from backend
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Files of new images added by user
  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [subProperty, setSubProperty] = useState<any>(null);

  // Remove the old parsePriceString, formatPrice, and parsePrice functions since we're importing them

  // Fetch sub-property data
  useEffect(() => {
    if (!propertyId || !subPropertyId) return;

    const fetchData = async () => {
      try {
        setFetching(true);
        const sub = await fetchSubProperty(propertyId as string, subPropertyId as string);
        console.log("💰 Debug - Raw sub-property data from API:", sub);
        // Add null check before accessing sub properties
        if (sub) {
          console.log("💰 Debug - Price value from API:", sub.price, "Type:", typeof sub.price);
        }
        setSubProperty(sub);

        // Populate form with existing data
        if (sub) {
          setForm({
            name: sub.name || "",
            description: sub.description || "",
            location: sub.location || "",
            price: sub.price ? formatPrice(sub.price) : "",
            bedrooms: sub.bedrooms?.toString() || "",
            landMark: sub.landMark || "",
            yearBuilt: sub.yearBuilt || "",
            type: sub.type || "Rent",
            mapLink: sub.mapLink || "",
            foundation: sub.foundation || "",
            keyInfo: sub.keyInfo || [],
            landInfo: sub.landInfo || [],
            appliances: sub.appliances || [],
            interior: sub.interior || [],
            otherRooms: sub.otherRooms || [],
            utilities: sub.utilities || [],
            bathrooms: sub.bathrooms || [],
          });

          if (sub.images && Array.isArray(sub.images)) {
            setExistingImages(sub.images);
          } else {
            setExistingImages([]);
          }
        }
        setNewImages([]); // reset new images on load
      } catch (err) {
        console.error("Error fetching sub-property:", err);
        toast.error("Failed to load sub-property data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [propertyId, subPropertyId]);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, idx: number) => {
    const newArray = [...form[field as keyof typeof form] as string[]];
    newArray[idx] = value;
    setForm((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleKeyValueChange = (field: string, idx: number, key: "label" | "value", value: string) => {
    const newArray = [...form[field as keyof typeof form] as KeyValue[]];
    newArray[idx][key] = value;
    setForm((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleBathroomChange = (idx: number, key: "type" | "count", value: string | number) => {
    const newBathrooms = [...form.bathrooms];
    newBathrooms[idx] = { ...newBathrooms[idx], [key]: value };
    setForm((prev) => ({ ...prev, bathrooms: newBathrooms }));
  };

  const addArrayItem = (field: string) => {
    if (["keyInfo", "landInfo"].includes(field)) {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as KeyValue[], { label: "", value: "" }],
      }));
    } else if (field === "bathrooms") {
      setForm((prev) => ({
        ...prev,
        bathrooms: [...prev.bathrooms, { type: "", count: 1 }],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], ""],
      }));
    }
  };

  const removeArrayItem = (field: string, idx: number) => {
    if (["keyInfo", "landInfo"].includes(field)) {
      const newArray = [...form[field as keyof typeof form] as KeyValue[]];
      newArray.splice(idx, 1);
      setForm((prev) => ({ ...prev, [field]: newArray }));
    } else if (field === "bathrooms") {
      const newBathrooms = [...form.bathrooms];
      newBathrooms.splice(idx, 1);
      setForm((prev) => ({ ...prev, bathrooms: newBathrooms }));
    } else {
      const newArray = [...form[field as keyof typeof form] as string[]];
      newArray.splice(idx, 1);
      setForm((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (idx: number) => {
    const newImagesArray = [...newImages];
    newImagesArray.splice(idx, 1);
    setNewImages(newImagesArray);
  };

  const removeExistingImage = (idx: number) => {
    const existingImagesArray = [...existingImages];
    existingImagesArray.splice(idx, 1);
    setExistingImages(existingImagesArray);
  };

  // Helper: convert URL to File for submission
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subPropertyId) return toast.error("Invalid sub-property ID");

    if (!form.name || !form.description || !form.price || !form.type) {
      return toast.error("Please fill all required fields");
    }

    const formData = new FormData();

    // Add basic form fields (following add form pattern)
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("price", parsePriceString(form.price).toString());
    formData.append("bedrooms", form.bedrooms.toString());
    formData.append("landMark", form.landMark);
    formData.append("yearBuilt", form.yearBuilt);
    formData.append("type", form.type);
    formData.append("mapLink", form.mapLink);
    formData.append("foundation", form.foundation);

    // Add array fields using the same structure as add form
    form.keyInfo.forEach((item, i) => {
      formData.append(`keyInfo[${i}][label]`, item.label);
      formData.append(`keyInfo[${i}][value]`, item.value);
    });

    form.landInfo.forEach((item, i) => {
      formData.append(`landInfo[${i}][label]`, item.label);
      formData.append(`landInfo[${i}][value]`, item.value);
    });

    form.bathrooms.forEach((b, i) => {
      formData.append(`bathrooms[${i}][type]`, b.type);
      formData.append(`bathrooms[${i}][count]`, b.count.toString());
    });

    form.appliances.forEach((a, i) => formData.append(`appliances[${i}]`, a));
    form.interior.forEach((item, idx) => formData.append(`interior[${idx}]`, item));
    form.otherRooms.forEach((r, idx) => formData.append(`otherRooms[${idx}]`, r));
    form.utilities.forEach((u, i) => formData.append(`utilities[${i}]`, u));

    try {
      setLoading(true);
      
      // Convert existing image URLs to Files and append with new images
      const existingImageFiles = await Promise.all(
        existingImages.map((url, index) => urlToFile(url, `existing-image-${index}.jpg`))
      );
      
      // Append all images (existing + new) as "images"
      [...existingImageFiles, ...newImages].forEach((file) => {
        formData.append("images", file);
      });
      
      await updateSubProperty(Number(subPropertyId), formData);
      toast.success("Sub-property updated successfully");
      router.push(`/properties/${propertyId}/sub/${subPropertyId}`);
    } catch (err) {
      console.error("🔴 Submit error:", err);
      toast.error("Error updating sub-property");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Loader />
      </div>
    );
  }

  if (!subProperty) {
    return (
      <p className="text-red-600 p-4">Sub-property not found</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-6">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6">
          {/* Back button and breadcrumb */}
          <div className="flex flex-col space-y-3 mb-4 xs:mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-2 xs:px-3 py-1.5 xs:py-2 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <FaArrowLeft className="mr-1 h-3 w-3" />
                <span>Back</span>
              </button>
            </div>
            <nav className="text-xs text-gray-500 overflow-x-auto" aria-label="Breadcrumb">
              <div className="flex items-center whitespace-nowrap">
                <span>Admin</span>
                <span className="mx-1">/</span>
                <span>Properties</span>
                <span className="mx-1">/</span>
                <span>Sub-Property</span>
                <span className="mx-1">/</span>
                <span className="text-orange-600 font-medium">Update</span>
              </div>
            </nav>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Update Sub-Property
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4">
              Modify the details of your sub-property listing
            </p>
            <div className="h-1 w-12 xs:w-16 sm:w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded mx-auto"></div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Basic Information Section */}
            <div className="p-3 xs:p-4 sm:p-6">
              <div className="mb-4 xs:mb-6">
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-1 xs:mb-2">
                  Basic Information
                </h2>
                <p className="text-xs xs:text-sm text-gray-600">
                  Update the core details of your sub-property
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:gap-6">
                {/* Property Name */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                    placeholder="Enter property name"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                    placeholder="Enter price (e.g. 5000000 or 5M)"
                    required
                  />
                  {form.price && (
                    <div className="text-xs text-gray-500 mt-1">
                      Formatted price: {formatPrice(form.price)}
                    </div>
                  )}
                </div>

                {/* Property Type and Bedrooms Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  {/* Property Type */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base bg-white"
                      required
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={form.bedrooms}
                      onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                      placeholder="Number of bedrooms"
                      min="0"
                    />
                  </div>
                </div>

                {/* Location and Landmark Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                      placeholder="Property location"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={form.landMark}
                      onChange={(e) => handleInputChange("landMark", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                {/* Year Built and Map Link Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  {/* Year Built */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Year Built
                    </label>
                    <input
                      type="text"
                      value={form.yearBuilt}
                      onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                      placeholder="Year built"
                    />
                  </div>

                  {/* Map Link */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                      Map Link
                    </label>
                    <input
                      type="url"
                      value={form.mapLink}
                      onChange={(e) => handleInputChange("mapLink", e.target.value)}
                      className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                      placeholder="Google Maps link"
                    />
                  </div>
                </div>

                {/* Foundation */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                    Foundation
                  </label>
                  <input
                    type="text"
                    value={form.foundation}
                    onChange={(e) => handleInputChange("foundation", e.target.value)}
                    className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base"
                    placeholder="Foundation type"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="block w-full px-2 xs:px-3 py-2 xs:py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-xs xs:text-sm sm:text-base resize-none"
                    placeholder="Property description"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bathrooms Section */}
            <div className="p-3 xs:p-4 sm:p-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 xs:mb-6 space-y-2 xs:space-y-0">
                <div>
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">
                    Bathrooms
                  </h3>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Add different types of bathrooms
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("bathrooms")}
                  className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Add Bathroom
                </button>
              </div>
              
              <div className="space-y-2 xs:space-y-3">
                {form.bathrooms.map((bathroom, idx) => (
                  <div key={idx} className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:gap-3 p-2 xs:p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Master, Guest"
                        value={bathroom.type}
                        onChange={(e) => handleBathroomChange(idx, "type", e.target.value)}
                        className="block w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs xs:text-sm"
                      />
                    </div>
                    <div className="w-full xs:w-20">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Count
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={bathroom.count}
                        onChange={(e) => handleBathroomChange(idx, "count", parseInt(e.target.value) || 1)}
                        className="block w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs xs:text-sm"
                        min="1"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem("bathrooms", idx)}
                        className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {form.bathrooms.length === 0 && (
                  <div className="text-center py-4 xs:py-6 text-xs xs:text-sm text-gray-500">
                    No bathrooms added yet. Click "Add Bathroom" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Arrays Section */}
            {[
              { field: "appliances", title: "Appliances", description: "Add appliances available in the property" },
              { field: "interior", title: "Interior Features", description: "Describe the interior features and finishes" },
              { field: "otherRooms", title: "Other Rooms", description: "List additional rooms and spaces" },
              { field: "utilities", title: "Utilities", description: "Specify available utilities and services" },
            ].map(({ field, title, description }) => (
              <div key={field} className="p-3 xs:p-4 sm:p-6">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 xs:mb-6 space-y-2 xs:space-y-0">
                  <div>
                    <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">
                      {title}
                    </h3>
                    <p className="text-xs xs:text-sm text-gray-600">
                      {description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem(field)}
                    className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Add {title.includes('Features') ? 'Feature' : title.slice(0, -1)}
                  </button>
                </div>
                
                <div className="space-y-2 xs:space-y-3">
                  {(form[field as keyof typeof form] as string[]).map((item, idx) => (
                    <div key={idx} className="flex flex-col xs:flex-row gap-2 xs:gap-3 p-2 xs:p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(field, e.target.value, idx)}
                        className="flex-1 px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs xs:text-sm"
                        placeholder={`Enter ${title.toLowerCase().slice(0, -1)}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field, idx)}
                        className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors mt-1 xs:mt-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(form[field as keyof typeof form] as string[]).length === 0 && (
                    <div className="text-center py-4 xs:py-6 text-xs xs:text-sm text-gray-500">
                      No {title.toLowerCase()} added yet. Click "Add {title.includes('Features') ? 'Feature' : title.slice(0, -1)}" to get started.
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Key-Value Arrays Section */}
            {[
              { field: "keyInfo", title: "Key Information", description: "Add important details and specifications" },
              { field: "landInfo", title: "Land Information", description: "Provide details about the land and plot" },
            ].map(({ field, title, description }) => (
              <div key={field} className="p-3 xs:p-4 sm:p-6">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 xs:mb-6 space-y-2 xs:space-y-0">
                  <div>
                    <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">
                      {title}
                    </h3>
                    <p className="text-xs xs:text-sm text-gray-600">
                      {description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem(field)}
                    className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Add Info
                  </button>
                </div>
                
                <div className="space-y-2 xs:space-y-3">
                  {(form[field as keyof typeof form] as KeyValue[]).map((item, idx) => (
                    <div key={idx} className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:gap-3 p-2 xs:p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Square Footage"
                          value={item.label}
                          onChange={(e) => handleKeyValueChange(field, idx, "label", e.target.value)}
                          className="block w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs xs:text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 2,500 sq ft"
                          value={item.value}
                          onChange={(e) => handleKeyValueChange(field, idx, "value", e.target.value)}
                          className="block w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs xs:text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeArrayItem(field, idx)}
                          className="w-full xs:w-auto inline-flex items-center justify-center px-2 xs:px-3 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {(form[field as keyof typeof form] as KeyValue[]).length === 0 && (
                    <div className="text-center py-4 xs:py-6 text-xs xs:text-sm text-gray-500">
                      No {title.toLowerCase()} added yet. Click "Add Info" to get started.
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Images Section */}
            <div className="p-3 xs:p-4 sm:p-6">
              <div className="mb-4 xs:mb-6">
                <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">
                  Property Images
                </h3>
                <p className="text-xs xs:text-sm text-gray-600">
                  Upload and manage property images
                </p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6 xs:mb-8">
                  <h4 className="text-sm xs:text-base font-medium text-gray-900 mb-3 xs:mb-4">
                    Current Images ({existingImages.length})
                  </h4>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-4">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={img}
                            alt={`Existing ${idx + 1}`}
                            className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                            onClick={() => setSelectedImage(img)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-red-500 text-white rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div className="mb-6 xs:mb-8">
                  <h4 className="text-sm xs:text-base font-medium text-gray-900 mb-3 xs:mb-4">
                    New Images ({newImages.length})
                  </h4>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-4">
                    {newImages.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-red-500 text-white rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 xs:p-6 hover:border-orange-400 transition-colors">
                <div className="text-center">
                  <svg
                    className="mx-auto h-8 w-8 xs:h-12 xs:w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-2 xs:mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 border border-transparent text-xs xs:text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                        Upload Images
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-1 xs:mt-2 text-xs text-gray-500">
                    PNG, JPG, JPEG up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-3 py-4 xs:px-4 xs:py-6 sm:px-6 bg-gray-50">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 xs:px-6 py-2.5 xs:py-3 border border-transparent text-sm xs:text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 xs:mr-3 h-4 w-4 xs:h-5 xs:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Sub-Property"
                )}
              </button>
            </div>
          </form>
        </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}