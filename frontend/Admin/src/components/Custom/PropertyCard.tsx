import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/priceFormatter";

interface PropertyCardProps {
  property: {
    pid: number;
    name?: string;
    price?: string;
    location?: string;
    images?: string[];
    listingStatus?: string;
  };
}

const PropertyCard = memo(function PropertyCard({ property }: PropertyCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      key={property.pid}
      className="relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="w-full h-48 relative">
        {/* Skeleton loader */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg z-0"></div>
        )}
        
        <Image
          src={property.images?.[0] || "/images/house5.png"}
          alt={property.name || "Property"}
          layout="fill"
          objectFit="cover"
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        
        {/* Status tag - moved after image and given z-index to ensure it's always visible */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full z-10 ${
            property.listingStatus === "sold"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {property.listingStatus === "sold" ? "Sold" : "Available"}
        </div>
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{property.name}</h3>
        {/* Fixed TypeScript error by providing a default value when property.price is undefined */}
        <p className="text-orange-500 font-bold mt-1">{formatPrice(property.price || "0")}</p>
        <p className="text-gray-500 text-sm mt-1 truncate">{property.location}</p>
      </div>
    </div>
  );
});

export default PropertyCard;