import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface PropertyInfoProps {
  propertyname?: string | string[];
  propertylocation?: string | string[];
  subpropertyname?: string | string[];
  subpropertylocation?: string | string[];
  agencySettings?: {
    scheduleDays?: number[];
  };
  dayNumberToName: (dayNumber: number) => string;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({
  propertyname,
  propertylocation,
  subpropertyname,
  subpropertylocation,
  agencySettings,
  dayNumberToName
}) => {
  return (
    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
      {subpropertyname ? (
        // Sub-property scheduling
        <>
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Sub-Property Visit
            </span>
          </div>
          <h2 className="font-semibold text-blue-900 text-lg uppercase">
            <span className="font-medium text-gray-700">Sub-Property:</span> {Array.isArray(subpropertyname) ? subpropertyname[0] : subpropertyname}
          </h2>
          <p className="text-sm uppercase text-blue-700">
            <span className="font-medium text-gray-700">Location:</span> {Array.isArray(subpropertylocation) ? subpropertylocation[0] : (subpropertylocation || "Location not specified")}
          </p>
        </>
      ) : (
        // Property scheduling
        <>
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Property Visit
            </span>
          </div>
          <h2 className="font-semibold text-blue-900 text-lg">
            <span className="font-medium text-gray-700">Property:</span> {Array.isArray(propertyname) ? propertyname[0] : (propertyname || "Property")}
          </h2>
          <p className="text-sm text-blue-700">
            <span className="font-medium text-gray-700">Location:</span> {Array.isArray(propertylocation) ? propertylocation[0] : (propertylocation || "Location not specified")}
          </p>
        </>
      )}
      
      {agencySettings && (
        <>
          <div className="mt-3 pt-3 border-t border-blue-100">
            {agencySettings.scheduleDays && (
              <p className="text-sm text-blue-700 mt-1">
                <span className="font-medium text-gray-700">Available Days:</span> {agencySettings.scheduleDays.map(dayNumberToName).join(", ")}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyInfo;