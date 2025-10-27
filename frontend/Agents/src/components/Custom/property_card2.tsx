import React, { useState, useEffect } from "react";
import Image from "next/image";
import Spinner from "@/pages/notifications/Spinner";

interface PropertyCard2Props {
  item?: {
    name?: string;
    location?: string;
    price?: string | number;
    priceRange?: string;
    amount?: string | number;
    type?: string;
    listingStatus?: string;
    paidAmount?: string | number;
    img?: string;
    images?: string[];
    pid?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    yearBuilt?: string;
    [key: string]: any;
  };
  index?: number;
  onClick?: () => void;
  sold?: boolean;
  loading?: boolean;
}

const PropertyCard2: React.FC<PropertyCard2Props> = ({
  item,
  index,
  onClick,
  sold = false,
  loading = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // If not loading but item is missing, return null or a fallback
  if (!loading && !item) {
    return null;
  }

  // Provide default empty object when item is undefined
  const propertyItem = item || {};

  const hasImage = propertyItem.img || (propertyItem.images && propertyItem.images[0]);
  const imageUrl = propertyItem.img || (propertyItem.images?.[0] ?? "");
  
  const getImage = () => {
    if (!hasImage) {
      return require("../../../public/images/high_build2.jpeg");
    }
    return imageUrl;
  };

  const isSold =
    sold || propertyItem.listingStatus?.toLowerCase() === "sold";

  const displayPrice =
    propertyItem.priceRange || propertyItem.price || propertyItem.amount || "Price not available";

  // Check if property has a valid paid amount for display
  const hasValidPaidAmount = propertyItem.paidAmount !== undefined && 
                             propertyItem.paidAmount !== null && 
                             propertyItem.paidAmount !== "" && 
                             Number(propertyItem.paidAmount) > 0;

  // Reset loading states when item changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    
    // Fallback timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setImageLoading(false);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, [item?.pid, item?.img, item?.images?.[0]]);

  if (loading) {
    return (
      <div className="rounded-2xl shadow-lg border bg-white w-full flex flex-col transition-all duration-300 hover:border-orange-200 hover:shadow-xl">
        <div className="relative w-full h-56 overflow-hidden rounded-t-2xl flex items-center justify-center bg-gray-50">
          <Spinner className="h-8 w-8 text-orange-500" />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <div className="h-5 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="flex flex-row gap-2 mt-2">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer relative flex flex-col bg-white w-full max-w-full group hover:border-orange-200"
      onClick={onClick}
    >
  
      <div className="relative w-full h-56 overflow-hidden rounded-t-2xl flex items-center justify-center">
        <>
          {/* Show spinner while loading */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <Spinner className="h-8 w-8 text-orange-500" />
            </div>
          )}
          
          {/* Always show the image but hide it visually while loading */}
          <Image
            src={getImage()}
            alt={propertyItem.name || "property"}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className={`object-cover w-full h-full rounded-t-2xl transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => {
              setImageLoading(false);
            }}
            onLoad={() => {
              // Additional onLoad handler as fallback
              setImageLoading(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
          
          {/* Show error message if image failed to load */}
          {imageError && !imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm">Image not available</span>
            </div>
          )}
          
         
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl"></div>
        </>

      
        {isSold && hasValidPaidAmount && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-3 py-1.5 flex items-center justify-center absolute top-3 right-3 shadow-lg max-w-[80%] z-10">
            <h2 className="text-xs font-bold whitespace-nowrap truncate">
              SOLD for ₦{Number(propertyItem.paidAmount).toLocaleString()}
            </h2>
          </div>
        )}
        
        {/* Property type badge */}
        {propertyItem.type && (
          <div className="bg-orange-500 text-white rounded-lg px-2 py-1 flex items-center justify-center absolute top-3 left-3 shadow z-10">
            <span className="text-xs font-bold">{propertyItem.type}</span>
          </div>
        )}
      </div>

  
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl text-gray-900 truncate group-hover:text-orange-600 transition-colors">
            {propertyItem.name || "Unnamed Property"}
          </h2>
          <p className="font-extrabold text-lg text-orange-600 whitespace-nowrap ml-2">
            {displayPrice}
          </p>
        </div>
        
        <p className="text-base text-gray-600 truncate flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {propertyItem.location || "Unknown Location"}
        </p>

      
        <div className="flex flex-wrap gap-2 pt-1">
          {propertyItem.bedrooms && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {propertyItem.bedrooms} {propertyItem.bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {propertyItem.bathrooms && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {propertyItem.bathrooms} {propertyItem.bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
          )}
          {propertyItem.area && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
              </svg>
              {propertyItem.area} sqft
            </span>
          )}
          {propertyItem.yearBuilt && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {propertyItem.yearBuilt}
            </span>
          )}
        </div>

        {/* Status tags with improved styling */}
        <div className="flex flex-row gap-2 mt-1 flex-wrap">
          {propertyItem.listingStatus && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium truncate max-w-[120px] ${propertyItem.listingStatus.toLowerCase() === 'sold' ? 'bg-green-100 text-green-800' : propertyItem.listingStatus.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
              {propertyItem.listingStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard2;