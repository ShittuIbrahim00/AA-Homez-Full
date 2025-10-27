import React from "react";
import type { SubPropertySold } from "@/types/user";
import { FaHome, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

// Function to convert abbreviated currency strings to full numbers
const convertAbbreviatedCurrency = (value: string): string => {
  if (!value) return "N/A";
  
  // Remove any whitespace and convert to lowercase for processing
  const cleanValue = value.trim().toLowerCase();
  
  // Check if the value ends with 'k', 'm', or 'b'
  if (cleanValue.endsWith('k')) {
    const number = parseFloat(cleanValue.slice(0, -1));
    if (!isNaN(number)) {
      return `₦${(number * 1000).toLocaleString()}`;
    }
  } else if (cleanValue.endsWith('m')) {
    const number = parseFloat(cleanValue.slice(0, -1));
    if (!isNaN(number)) {
      return `₦${(number * 1000000).toLocaleString()}`;
    }
  } else if (cleanValue.endsWith('b')) {
    const number = parseFloat(cleanValue.slice(0, -1));
    if (!isNaN(number)) {
      return `₦${(number * 1000000000).toLocaleString()}`;
    }
  }
  
  // If no abbreviation found, return the value as is (with naira sign)
  return `₦${cleanValue.replace(/₦/g, '').replace(/^0+/, '') || '0'}`;
};

interface SubPropertiesSoldListProps {
  properties: SubPropertySold[];
  onPropertyClick?: (property: SubPropertySold) => void;
  loading?: boolean;
}

const SubPropertiesSoldList: React.FC<SubPropertiesSoldListProps> = ({ 
  properties, 
  onPropertyClick,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border animate-pulse">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 md:hidden"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <FaHome className="text-gray-400 text-2xl" />
          </div>
        </div>
        <p className="text-lg font-medium">No sub-properties sold yet</p>
        <p className="text-sm mt-1">Your sold sub-properties will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border w-full max-w-full min-w-0">
      <div className="overflow-x-auto w-full min-w-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                <div className="flex items-center gap-2">
                  <FaHome className="text-gray-400 flex-shrink-0 text-sm" />
                  <span className="truncate text-xs">Sub-Property</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell min-w-0">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400 flex-shrink-0 text-sm" />
                  <span className="truncate text-xs">Location</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-400 flex-shrink-0 text-sm" />
                  <span className="truncate text-xs">Price</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell min-w-0">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400 flex-shrink-0 text-sm" />
                  <span className="truncate text-xs">Sale Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property, index) => {
              // Convert abbreviated price to full value
              const propertyPrice = convertAbbreviatedCurrency(property.price);
              
              return (
                <tr 
                  key={`${property.name}-${index}`} 
                  className="hover:bg-orange-50 cursor-pointer transition-all duration-200"
                  onClick={() => onPropertyClick?.(property)}
                >
                  <td className="px-4 py-4 whitespace-nowrap min-w-[150px]">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <FaHome className="text-orange-600 text-sm" />
                      </div>
                      <div className="ml-3 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{property.name}</div>
                        {/* Show location on mobile */}
                        <div className="text-xs text-gray-500 md:hidden truncate">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs flex-shrink-0" />
                            <span className="truncate">{property.location || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell min-w-0">
                    <div className="flex items-center gap-1 text-sm text-gray-900 min-w-0">
                      <FaMapMarkerAlt className="text-gray-400 text-xs flex-shrink-0" />
                      <span className="truncate">{property.location || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap min-w-0">
                    <div className="text-sm font-bold text-green-700 truncate">{propertyPrice}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell min-w-0">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400 text-xs flex-shrink-0" />
                      <span className="truncate">{property.saleDate ? new Date(property.saleDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
  
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold">{properties.length}</span> sold sub-properties
          </p>
          {/* <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Total Value:</span>
            <span className="font-bold text-green-700">
              ₦{properties.reduce((total, property) => {
                // Extract numeric value from price string
                const priceValue = property.price.replace(/[^0-9.]/g, '');
                const price = parseFloat(priceValue) || 0;
                return total + price;
              }, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SubPropertiesSoldList;