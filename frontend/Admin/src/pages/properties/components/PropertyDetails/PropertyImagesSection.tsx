import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/priceFormatter";
// Import React Icons
import { FaEdit, FaTrash, FaMoneyBillWave, FaCamera } from "react-icons/fa";

interface Props {
  images: string[];
  featuredImage: string | null;
  setFeaturedImage: (img: string) => void;
  onDelete: () => void;
  isDeleting: boolean;
  pid: number; // Changed from string to number
  onPay: () => void;
  listingStatus?: string;
  // New props for property info
  name?: string;
  description?: string;
  price?: string;
  priceStart?: string;
  priceEnd?: string;
  type?: string;
}

const PropertyImagesSection: React.FC<Props> = ({
  images,
  featuredImage,
  setFeaturedImage,
  onDelete,
  isDeleting,
  pid,
  onPay,
  listingStatus,
  // New props
  name,
  description,
  price,
  priceStart,
  priceEnd,
  type
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
  };

  // Function to get image source with fallback
  const getImageSrc = (imgSrc: string | null | undefined) => {
    if (!imgSrc || imageErrors[imgSrc]) {
      return "/images/house5.png";
    }
    return imgSrc;
  };

  return (
    <div className="space-y-6">
      {/* Property Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
            {type && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                {type}
              </span>
            )}
          </div>
          {listingStatus && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              listingStatus === "sold" 
                ? "bg-red-100 text-red-800" 
                : listingStatus === "pending" 
                ? "bg-yellow-100 text-yellow-800" 
                : "bg-green-100 text-green-800"
            }`}>
              {listingStatus.charAt(0).toUpperCase() + listingStatus.slice(1)}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-2xl font-bold text-green-700">
            {price ? formatPrice(price) : 
             priceStart || priceEnd ? 
             `${priceStart ? formatPrice(priceStart) : ''} - ${priceEnd ? formatPrice(priceEnd) : ''}` : 
             'Price not available'}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative rounded-xl overflow-hidden shadow-lg h-80 sm:h-96 md:h-[32rem]">
        <Image
          src={getImageSrc(featuredImage)}
          alt="Featured"
          layout="fill"
          objectFit="cover"
          onError={() => featuredImage && handleImageError(featuredImage)}
          unoptimized={true}
          className="cursor-pointer hover:opacity-90 transition"
        />
        {featuredImage && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            Featured Image
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900 mb-3">Gallery ({images.length} photos)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all h-24 ${
                  featuredImage === img ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setFeaturedImage(img)}
              >
                <Image
                  src={getImageSrc(img)}
                  alt={`Gallery ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                  onError={() => handleImageError(img)}
                  unoptimized={true}
                />
                {featuredImage === img && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <span className="text-white font-bold text-xs bg-blue-600 px-2 py-1 rounded">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {listingStatus !== "sold" && (
          <Link href={`/properties/update/${pid}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors">
              <FaEdit /> Edit Property
            </button>
          </Link>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </>
          ) : (
            <><FaTrash /> Delete Property</>
          )}
        </button>
        {listingStatus !== "sold" && (
          <button
            onClick={onPay}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <FaMoneyBillWave /> Pay for Property
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyImagesSection;