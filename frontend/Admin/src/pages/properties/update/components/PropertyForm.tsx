import React, { Dispatch, SetStateAction, useState, useEffect } from "react";

type FormType = {
  name: string;
  description: string;
  location: string;
  price: string;        // changed to string
  mapLink: string;
  landMark: string;
  yearBuilt: string;    // changed to string
  type: string;
};

type Props = {
  form: FormType;
  setForm: Dispatch<SetStateAction<FormType>>;
};

const inputStyle =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm bg-white text-sm sm:text-base";
const labelStyle =
  "block text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 text-gray-700 transition-colors group-focus-within:text-orange-600";

// Helper: format price with Naira sign and commas (like sub-property add form)
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

// Helper: parse price for submission (like sub-property add form)
function parsePrice(value: string) {
  if (!value) return "";
  
  const valueStr = value.toString().toUpperCase();
  
  if (valueStr.includes('M')) {
    // Million: "₦5,000,000" or "5.0M" -> 5000000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return (num * 1000000).toString();
  } else if (valueStr.includes('B')) {
    // Billion: "₦5,000,000,000" or "5.0B" -> 5000000000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return (num * 1000000000).toString();
  } else if (valueStr.includes('K')) {
    // Thousand: "₦5,000" or "5.0K" -> 5000
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    return (num * 1000).toString();
  } else {
    // Regular formatted number: "₦5,000,000" -> 5000000
    return valueStr.replace(/[^0-9.]/g, '');
  }
}

export default function PropertyForm({ form, setForm }: Props) {
  // Initialize formatted price states with form values
  const [formattedPrice, setFormattedPrice] = useState(() => formatPrice(form.price));

  // Sync formatted prices if form values change externally (use useCallback to prevent re-renders)
  useEffect(() => {
    const newFormatted = formatPrice(form.price);
    if (newFormatted !== formattedPrice) {
      setFormattedPrice(newFormatted);
    }
  }, [form.price]);

  const handlePriceChange = (value: string) => {
    // Parse the input value to get the raw numeric value
    const parsedValue = parsePrice(value);
    
    // Format price with Naira sign and commas for display
    const formatted = formatPrice(value);
    
    // Store the raw numeric value in the form state
    setForm((prev) => ({ ...prev, price: parsedValue }));
    setFormattedPrice(formatted);
  };

  // Export parsePrice function for use in parent component
  (PropertyForm as any).parsePrice = parsePrice;

  return (
    <>
      {/* Property + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className={labelStyle}>Property Name *</label>
          <input
            type="text"
            placeholder="e.g., Dantata housing Estate"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputStyle}
          />
        </div>

        <div className="group">
          <label className={labelStyle}>Location *</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g., Wuse, Maitama, Asokoro..."
            className={inputStyle}
          />
        </div>
      </div>

      {/* Description */}
      <div className="group">
        <label className={labelStyle}>Description *</label>
        <textarea
          rows={4}
          placeholder="Provide details: bedrooms, amenities, nearby facilities, etc."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputStyle}
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group md:col-span-3">
          <label className={labelStyle}>Price *</label>
          <input
            type="text"
            placeholder="₦50,000,000"
            value={formattedPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Extras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group">
          <label className={labelStyle}>Map Link</label>
          <input
            type="text"
            placeholder="Paste Google Maps link"
            value={form.mapLink}
            onChange={(e) => setForm({ ...form, mapLink: e.target.value })}
            className={inputStyle}
          />
        </div>
        <div className="group">
          <label className={labelStyle}>Landmark</label>
          <input
            type="text"
            placeholder="e.g., Near Banex Plaza, Wuse"
            value={form.landMark}
            onChange={(e) => setForm({ ...form, landMark: e.target.value })}
            className={inputStyle}
          />
        </div>
        <div className="group">
          <label className={labelStyle}>Year Built</label>
          <input
            type="text"
            placeholder="e.g., 2018"
            value={form.yearBuilt}
            onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className={labelStyle}>Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputStyle}
          >
            <option value="">Select type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Land">Land</option>
          </select>
        </div>
      </div>
    </>
  );
}