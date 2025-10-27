import React, { useState } from "react";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaShare } from "react-icons/fa";

interface Property {
  pid?: string;
  name?: string;
  location?: string;
  price?: string | number;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  yearBuilt?: string;
  type?: string;
  description?: string;
  [key: string]: any;
}

interface PropertyComparisonProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ 
  properties = [],
  onPropertySelect
}) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  const togglePropertySelection = (property: Property) => {
    if (selectedProperties.some(p => p.pid === property.pid)) {
      // Remove property if already selected
      setSelectedProperties(selectedProperties.filter(p => p.pid !== property.pid));
    } else if (selectedProperties.length < 3) {
      // Add property if less than 3 are selected
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const formatPrice = (price: string | number) => {
    if (!price) return "N/A";
    const num = typeof price === "number" ? price : parseFloat(price.toString().replace(/[^0-9.]/g, ""));
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₦${(num / 1000).toFixed(1)}K`;
    return `₦${num.toLocaleString()}`;
  };

  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return require("../../../public/images/high_build2.jpeg");
  };

  // Features to compare
  const features = [
    { key: "bedrooms", label: "Bedrooms", icon: <FaBed className="text-orange-500" /> },
    { key: "bathrooms", label: "Bathrooms", icon: <FaBath className="text-blue-500" /> },
    { key: "area", label: "Area", icon: <FaRulerCombined className="text-green-500" /> },
    { key: "yearBuilt", label: "Year Built", icon: <span className="text-purple-500 font-bold">Y</span> },
    { key: "type", label: "Property Type", icon: <span className="text-indigo-500 font-bold">T</span> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compare Properties</h2>
          <p className="text-gray-600 mt-1">Select up to 3 properties to compare side-by-side</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {selectedProperties.length}/3 selected
          </span>
          {selectedProperties.length > 0 && (
            <button 
              onClick={() => setSelectedProperties([])}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Property Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => {
          const isSelected = selectedProperties.some(p => p.pid === property.pid);
          return (
            <div 
              key={property.pid}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? "border-orange-500 ring-2 ring-orange-200 shadow-lg" 
                  : "border-gray-200 hover:border-orange-300 hover:shadow-md"
              }`}
              onClick={() => togglePropertySelection(property)}
            >
              <div className="relative">
                <img 
                  src={getPropertyImage(property)} 
                  alt={property.name || "Property"} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-orange-500" : "bg-white/80"
                  }`}>
                    {isSelected ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {formatPrice(property.price)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 truncate">{property.name || "Unnamed Property"}</h3>
                <p className="text-gray-600 text-sm flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                  <span className="truncate">{property.location || "Unknown Location"}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {property.bedrooms && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <FaBed className="mr-1" />
                      {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaBath className="mr-1" />
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                    </span>
                  )}
                  {property.area && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaRulerCombined className="mr-1" />
                      {property.area} sqft
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {selectedProperties.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Property Comparison</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  {selectedProperties.map((property, index) => (
                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col items-center">
                        <img 
                          src={getPropertyImage(property)} 
                          alt={property.name || "Property"} 
                          className="w-16 h-16 object-cover rounded-lg mb-2"
                        />
                        <span className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
                          {property.name || "Property"}
                        </span>
                        <span className="text-green-700 font-bold text-sm">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className={featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">{feature.icon}</span>
                        {feature.label}
                      </div>
                    </td>
                    {selectedProperties.map((property, propertyIndex) => (
                      <td key={propertyIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {property[feature.key] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                        </svg>
                      </span>
                      Description
                    </div>
                  </td>
                  {selectedProperties.map((property, propertyIndex) => (
                    <td key={propertyIndex} className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-[200px] truncate" title={property.description || "No description"}>
                        {property.description ? property.description.substring(0, 80) + (property.description.length > 80 ? "..." : "") : "No description"}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              onClick={() => setSelectedProperties([])}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparison;