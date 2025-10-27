// components/PropertyDetails/PropertyInfo.tsx
import React from "react";
import { User } from "@/types/property";
import moment from "moment";
import { formatPrice, formatPriceRange, parsePriceString } from "@/utils/priceFormatter";
// Import React Icons
import { 
  FaMapMarkerAlt, 
  FaMountain, 
  FaHome, 
  FaCalendarAlt, 
  FaFire, 
  FaMap, 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaTag, 
  FaUser, 
  FaUserTie, 
  FaBuilding, 
  FaMapPin, 
  FaStickyNote 
} from "react-icons/fa";

interface Props {
  name: string;
  description: string;
  location: string;
  price: string | number;
  priceStart?: string;
  priceEnd?: string;
  listingStatus?: string;
  paymentStatus?: string;
  soldTo?: string;
  propertyUser?: User;
  yearBuilt?: string;
  type?: string;
  landMark?: string;
  mapLink?: string;
  hottestCount?: number;
  paidAmount?: string;
  deficitAmount?: number;
}

// Remove the old parsePriceString and formatPrice functions since we're importing them

const PropertyInfo: React.FC<Props> = ({
  name,
  description,
  location,
  price,
  priceStart,
  priceEnd,
  listingStatus,
  paymentStatus,
  soldTo,
  propertyUser,
  yearBuilt,
  type,
  landMark,
  mapLink,
  hottestCount,
  paidAmount,
  deficitAmount,
}) => {
  // State to toggle between full price and abbreviated price
  const [showFullPrice, setShowFullPrice] = React.useState(false);
  
  // Toggle price display
  const togglePriceDisplay = () => {
    setShowFullPrice(!showFullPrice);
  };

  return (
    <div className="space-y-6">
      {/* Property Details - Removed title and status since they're now in PropertyImagesSection */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-xl text-gray-900 mb-4 pb-2 border-b border-gray-100">Property Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="font-medium text-gray-500 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-gray-700">{location}</p>
            </div>
          </div>
          
          {landMark && (
            <div className="flex items-start gap-3">
              <FaMountain className="font-medium text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Landmark</p>
                <p className="text-gray-700">{landMark}</p>
              </div>
            </div>
          )}
          
          {type && (
            <div className="flex items-start gap-3">
              <FaHome className="font-medium text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Type</p>
                <p className="text-gray-700">{type}</p>
              </div>
            </div>
          )}
          
          {yearBuilt && (
            <div className="flex items-start gap-3">
              <FaCalendarAlt className="font-medium text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Year Built</p>
                <p className="text-gray-700">{yearBuilt}</p>
              </div>
            </div>
          )}
          
          {hottestCount !== undefined && (
            <div className="flex items-start gap-3">
              <FaFire className="font-medium text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Views</p>
                <p className="text-gray-700">{hottestCount} views</p>
              </div>
            </div>
          )}
          
          {mapLink && (
            <div className="flex items-start gap-3">
              <FaMap className="font-medium text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Map</p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Information */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-xl text-gray-900 mb-4 pb-2 border-b border-green-100">
          <FaMoneyBillWave className="inline mr-2" /> Pricing
        </h3>
        <div className="space-y-3">
          <div 
            className="flex justify-between items-center cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors"
            onClick={togglePriceDisplay}
          >
            <p className="font-medium text-gray-700">Price:</p>
            <p className="font-bold text-xl md:text-2xl text-green-700">
              {formatPrice(price, showFullPrice)}
            </p>
          </div>
          
          {priceStart && priceEnd && (
            <div 
              className="flex justify-between items-center cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors"
              onClick={togglePriceDisplay}
            >
              <p className="font-medium text-gray-700">Range:</p>
              <p className="font-medium text-green-600">
                {formatPriceRange(priceStart, priceEnd, showFullPrice)}
              </p>
            </div>
          )}
          
          {paidAmount && (
            <div 
              className="flex justify-between items-center cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors"
              onClick={togglePriceDisplay}
            >
              <p className="font-medium text-gray-700">Paid Amount:</p>
              <p className="font-medium text-green-600">
                {formatPrice(paidAmount, showFullPrice)}
              </p>
            </div>
          )}
          
          {deficitAmount !== undefined && (
            <div className="flex justify-between items-center pt-3 border-t border-green-100">
              <p className="font-medium text-gray-700">
                {deficitAmount > 0 ? "Balance:" : "Status:"}
              </p>
              <p className={`font-bold text-lg ${
                deficitAmount > 0 ? "text-red-600" : "text-green-600"
              }`}>
                {deficitAmount > 0 ? formatPrice(deficitAmount, showFullPrice) : "Fully Paid"}
                {deficitAmount <= 0 && <span className="ml-2">✅</span>}
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Click on prices to toggle between full and abbreviated views
        </p>
      </div>

    

      {/* Sold Information */}
      {listingStatus === "sold" && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-xl text-gray-900 mb-4 pb-2 border-b border-red-100">
            <FaTag className="inline mr-2" /> Sale Information
          </h3>
          <div className="space-y-4">
            {soldTo && (
              <div className="flex items-start gap-3">
                <FaUser className="font-medium text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Sold to</p>
                  <p className="text-gray-700 font-bold">{soldTo}</p>
                </div>
              </div>
            )}
          
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyInfo;