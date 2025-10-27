import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBed, FaBath, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { SubProperty } from "@/types/property";
import { formatPrice } from "@/utils/priceFormatter";

interface Props {
  subProperties: SubProperty[];
  propertyId: number;
  onPreviewImage: (img: string) => void;
  parentListingStatus?: string; // Add parent property listing status
}

const SubPropertiesSection: React.FC<Props> = ({
  subProperties,
  propertyId,
  onPreviewImage,
  parentListingStatus,
}) => {

  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 sub-properties per page
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Handle image loading errors
  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
  };
  
  // Calculate pagination
  const totalItems = subProperties?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubProperties = subProperties?.slice(startIndex, endIndex) || [];
  
  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };
  
  const prevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };
  
  // Remove the old formatPrice function since we're importing it

  return (
    <div id="sub-properties-section">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sub-Properties</h2>
          {totalItems > 0 && (
            <p className="text-gray-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} sub-properties
            </p>
          )}
        </div>
        {parentListingStatus !== "sold" && (
          <Link href={`/properties/${propertyId}/add-sub`}>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-sm transition-colors">
              + Add Sub-Property
            </button>
          </Link>
        )}
      </div>

      {!subProperties.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No sub-properties available.</p>
          {parentListingStatus !== "sold" && (
            <Link href={`/properties/${propertyId}/add-sub`}>
              <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                + Add Your First Sub-Property
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentSubProperties.map((sub) => (
              <Link key={sub.sid} href={`/properties/${propertyId}/sub/${sub.sid}`}>
                <div className="relative group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden">
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-md">
                    {formatPrice(sub.price || "0")}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-1">{sub.name}</h3>
                  
                    <div className="space-y-2 mb-4">
                      {typeof sub.bedrooms === "number" && (
                        <div className="flex items-center gap-2 text-sm bg-red-50 text-red-700 rounded-lg px-3 py-1.5">
                          <FaBed className="text-red-500" />
                          <span>{sub.bedrooms} Bedroom{sub.bedrooms > 1 ? "s" : ""}</span>
                        </div>
                      )}

                      {sub.bathrooms?.length ? (
                        <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5">
                          <FaBath className="text-blue-500" />
                          <span>
                            {sub.bathrooms.map((b) => `${b.count} ${b.type}`).join(", ")}
                          </span>
                        </div>
                      ) : null}

                      {sub.keyInfo?.length ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sub.keyInfo.slice(0, 2).map((info, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                              {info.label}: {info.value}
                            </span>
                          ))}
                          {sub.keyInfo.length > 2 && (
                            <span className="text-xs text-gray-500">+{sub.keyInfo.length - 2} more</span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Always show 2 images regardless of sold status */}
                    {sub.images?.length ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {sub.images.slice(0, 2).map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative rounded-lg overflow-hidden h-20"
                            onClick={(e) => {
                              e.preventDefault();
                              onPreviewImage(img);
                            }}
                          >
                            {imageErrors[img] ? (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                <div className="text-center">
                                  <div className="text-lg">📷</div>
                                  <p>Not available</p>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={img}
                                alt={`Image ${idx + 1}`}
                                layout="fill"
                                objectFit="cover"
                                onError={() => handleImageError(img)}
                                unoptimized={true}
                                className="cursor-pointer hover:opacity-90 transition"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Show sold status indicator */}
                    {(parentListingStatus === "sold" || sub.listingStatus === "sold") && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 inline-flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          {parentListingStatus === "sold" ? "Parent Property Sold" : "Sub-Property Sold"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
              
              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <FaChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page and pages around current
                    const showPage = page === 1 || page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-3 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                  <FaChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubPropertiesSection;