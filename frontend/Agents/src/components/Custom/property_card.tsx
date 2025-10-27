import React, { useState } from "react";
import Image from "next/image";
import Spinner from "@/pages/notifications/Spinner";

function PropertyCard(props: any) {
  const { item, details, onClick, loading } = props;
  
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getImage = () => {
    if (!item?.images?.length)
      return require("../../../public/images/high_build2.jpeg");
    return item.images[0];
  };

  const truncate = (str: string, max = 70) =>
    str && str.length > max ? str.substring(0, max) + "..." : str;

  const handleClick = () => {
    onClick?.(item.pid);
  };

  if (loading) {
    return (
      <div className="rounded-xl shadow-lg bg-white flex flex-col overflow-hidden mx-auto w-full max-w-[320px] border border-gray-100 hover:border-orange-200 transition-all duration-300">
        <div className="relative w-full h-48 sm:h-56 md:h-64 flex items-center justify-center bg-gray-50">
          <Spinner className="h-8 w-8 text-orange-500" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          {details && (
            <>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl shadow-lg bg-white cursor-pointer transition-all duration-300 hover:shadow-xl
        flex flex-col overflow-hidden mx-auto 
        ${details ? "w-full max-w-[320px]" : "w-full max-w-[280px]"}
        group border border-gray-100 hover:border-orange-200`}
      onClick={handleClick}
    >
  
      <div className="relative w-full h-48 sm:h-56 md:h-64">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner className="h-8 w-8 text-orange-500" />
          </div>
        )}
        <Image
          src={getImage()}
          alt={item?.name ?? "Property Image"}
          layout="fill"
          objectFit="cover"
          className={`transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          priority
        />
        {imageError && !imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
    
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl"></div>
      </div>

   
      <div className="p-4 flex flex-col flex-grow">
       
        <h3 className="text-xl font-extrabold text-gray-900 mb-1 truncate group-hover:text-orange-600 transition-colors">
          {item.priceRange
            ? `₦${item.priceRange}`
            : item.price
            ? `₦${item.price}`
            : "Price N/A"}
        </h3>

        {/* Name & Location with improved hierarchy */}
        <h4 className="text-lg font-semibold text-gray-700 truncate mb-1 group-hover:text-orange-500 transition-colors">
          {item?.name ?? "Unnamed Property"}
        </h4>
        <p className="text-base text-gray-500 mb-3 truncate flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {item?.location ?? item.landMark ?? "No location provided"}
        </p>

     
        <div className="flex flex-wrap gap-2 mb-3">
          {item.bedrooms && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {item.bedrooms} {item.bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {item.bathrooms && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {item.bathrooms} {item.bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
          )}
          {item.area && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
              </svg>
              {item.area} sqft
            </span>
          )}
        </div>

        {/* Extra info */}
        {details && (
          <>
            {item.yearBuilt && (
              <p className="text-base text-gray-600 mb-2">
                Year Built: <span className="font-semibold">{item.yearBuilt}</span>
              </p>
            )}
            {item.description && (
              <p className="text-base text-gray-600 flex-grow mb-4">
                {truncate(item.description, 100)}
              </p>
            )}
          </>
        )}

     
        {details && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="mt-2 w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            See Details
          </button>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;