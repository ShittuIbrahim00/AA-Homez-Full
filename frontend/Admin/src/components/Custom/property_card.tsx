import React, { useState } from "react";
import Image from "next/image";
import { FaBath, FaBed, FaCar } from "react-icons/fa";

interface PropertyInfo {
  label: string;
  value: string | number;
}

interface PropertyItem {
  images?: string[];
  name?: string;
  price?: string | number;
  listingStatus?: string;
  type?: string;
  location?: string;
  keyInfo?: PropertyInfo[];
}

interface PropertyCardProps {
  item: PropertyItem;
  onClick: () => void;
  details?: boolean;
}

function PropertyCard({ item, onClick, details }: PropertyCardProps) {
  // Handle missing images with a fallback
  const imageUrl = item.images?.[0] || "/images/house5.png";
  
  // Handle missing price with a fallback
  const displayPrice = item.price ? `#${item.price}` : "Price not available";
  
  // Handle missing name with a fallback
  const displayName = item.name || "Unnamed Property";
  
  // Handle missing location with a fallback
  const displayLocation = item.location || "Location not specified";
  
  // Handle missing type with a fallback
  const displayType = item.type || "Type not specified";
  
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden`}
      onClick={() => onClick()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      aria-label={`View details for ${displayName}`}
    >
      {/* Image Section */}
      <div className="relative w-full h-56 md:h-64">
        {/* Skeleton loader */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl z-0"></div>
        )}
        
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          className="object-cover"
          onLoadingComplete={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            setImageError(true);
            // @ts-ignore
            e.target.src = "/images/house5.png";
          }}
        />
        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 bg-green-700 text-white px-3 py-1 rounded-lg font-semibold text-lg">
          {displayPrice}
        </div>
        {/* Status Overlay */}
        {item.listingStatus && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
            {item.listingStatus}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-800 truncate" title={displayName}>
          {displayName}
        </h2>
        <p className="text-gray-600 text-sm">{displayType}</p>
        <p className="text-gray-500 text-sm truncate" title={displayLocation}>
          {displayLocation}
        </p>

        {/* Icons Info */}
        {item.keyInfo && item.keyInfo.length > 0 ? (
          <div className="flex items-center space-x-4 mt-2 text-gray-700">
            {item.keyInfo.map((info: PropertyInfo, idx: number) => (
              <div key={idx} className="flex items-center space-x-1 text-sm">
                {info.label.toLowerCase().includes("bed") && <FaBed />}
                {info.label.toLowerCase().includes("bath") && <FaBath />}
                {info.label.toLowerCase().includes("garage") && <FaCar />}
                <span>{info.value || "N/A"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-4 mt-2 text-gray-700 text-sm">
            <div className="flex items-center space-x-1">
              <FaBed />
              <span>N/A</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaBath />
              <span>N/A</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCar />
              <span>N/A</span>
            </div>
          </div>
        )}

        {/* Details Button */}
        {details && (
          <div
            className="mt-3 w-full py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onClick();
              }
            }}
            aria-label={`See details for ${displayName}`}
          >
            See Details
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;