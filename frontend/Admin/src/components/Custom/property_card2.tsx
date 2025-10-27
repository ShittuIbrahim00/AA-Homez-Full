import React, { useState } from 'react';
import Image from "next/image";
import { formatPrice } from "@/utils/priceFormatter";

function PropertyCard2({item, index, onClick, sold}) {
    // Log the item data for debugging
    // console.log("🔍 PropertyCard2 - item:", item);
    // console.log("🔍 PropertyCard2 - item listingStatus:", item?.listingStatus);
    // console.log("🔍 PropertyCard2 - sold prop:", sold);
    
    // Use house5.png as fallback image
    const imageUrl = item?.img ? item.img : item?.images?.[0] || "/images/house5.png";
    
    // Determine listing status - use sold prop or item.listingStatus
    const isSold = sold || item?.listingStatus === "sold";
    const isAvailable = item?.listingStatus === "available";
    
    // console.log("🔍 PropertyCard2 - isSold:", isSold);
    // console.log("🔍 PropertyCard2 - isAvailable:", isAvailable);
    
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    return (
        <div
            className={`w-full rounded-xl shadow-md shadow-main-grey2 border-main-greyShadow hover:shadow-main-greyShadow cursor-pointer relative transition-shadow duration-300`}
            onClick={() => onClick()}
        >
            <div className="relative w-full h-40 md:h-48">
                {/* Skeleton loader */}
                {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl z-0"></div>
                )}
                
                <Image
                    src={imageUrl}
                    alt={"property"}
                    fill
                    className={"object-cover rounded-t-xl"}
                    onLoadingComplete={() => setImageLoading(false)}
                    onError={(e) => {
                        setImageLoading(false);
                        setImageError(true);
                        // @ts-ignore
                        e.target.src = "/images/house5.png";
                    }}
                />
                
                {/* Status tag */}
                {(isSold || isAvailable) && (
                    <div className={`absolute top-2 right-2 rounded-lg px-3 py-1 text-xs font-semibold z-10 ${
                        isSold 
                            ? "bg-red-500 text-white" 
                            : "bg-green-500 text-white"
                    }`}>
                        {isSold ? "Sold" : "Available"}
                    </div>
                )}
            </div>

            <div className={"w-full p-3 md:p-4 flex flex-col"}>
                <h2 className={"font-semibold text-black text-base md:text-lg mb-1 truncate"}>{item?.type}</h2>
                <h2 className={"font-semibold text-black text-sm md:text-base truncate"}>{item?.amount}</h2>
                <p className={"font-light font-kanit text-sm md:text-base truncate mt-1"}>
                    {item?.name}
                </p>
                <p className={"font-light font-kanit text-sm truncate"}>
                    {item?.location}
                </p>
            </div>
        </div>
    );
}

export default PropertyCard2;