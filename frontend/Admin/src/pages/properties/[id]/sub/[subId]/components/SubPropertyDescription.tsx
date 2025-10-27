import Link from "next/link";
import { useRouter } from "next/router";
// Import React Icons
import { 
  FaMapMarkerAlt, 
  FaMountain, 
  FaHome, 
  FaEdit, 
  FaTrash, 
  FaCreditCard 
} from "react-icons/fa";

const SubPropertyDescription = ({
  subProperty,
  setModalImage,
  propertyId,
  subPropertyId,
  setEditOpen,
  setDeleteOpen,
  successMessage,
  parentListingStatus,
}: {
  subProperty: any;
  setModalImage: (img: string | null) => void;
  propertyId: string;
  subPropertyId: string;
  setEditOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  successMessage: string;
  parentListingStatus?: string;
}) => {
  const router = useRouter();
  
  // Check if buttons should be hidden based on business logic
  const isSubPropertySold = subProperty.listingStatus === "sold";
  const isParentPropertySold = parentListingStatus === "sold";
  const shouldHideButtons = isSubPropertySold || isParentPropertySold;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {subProperty.name}
          </h1>
          <p className="text-gray-700 text-base leading-relaxed">
            {subProperty.description}
          </p>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {subProperty.location && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <FaMapMarkerAlt /> Location
              </p>
              <p className="text-gray-700">{subProperty.location}</p>
            </div>
          )}
          {subProperty.landMark && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <FaMountain /> Landmark
              </p>
              <p className="text-gray-700">{subProperty.landMark}</p>
            </div>
          )}
          {subProperty.type && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <FaHome /> Type
              </p>
              <p className="text-gray-700">{subProperty.type}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {!shouldHideButtons && (
            <Link href={`/properties/${propertyId}/sub/${subPropertyId}/update`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-sm flex items-center gap-2">
                <FaEdit />
                <span>Edit Sub-Property</span>
              </button>
            </Link>
          )}

          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <FaTrash />
            <span>Delete Sub-Property</span>
          </button>

          {!shouldHideButtons && (
            <button
              onClick={() => router.push(`/properties/${propertyId}/sub/${subPropertyId}/pay`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <FaCreditCard />
              <span>Pay for Sub-Property</span>
            </button>
          )}
        </div>

        {/* Status Message - Show only when buttons are hidden */}
        {shouldHideButtons && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            {isParentPropertySold 
              ? "🏠 Parent property is sold - Management options disabled" 
              : "🔒 Sub-property is sold - Management options disabled"
            }
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Image Gallery */}
        {subProperty.images && subProperty.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {subProperty.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden cursor-pointer h-32"
                  onClick={() => setModalImage(img)}
                >
                  <img
                    src={img}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-schedule.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubPropertyDescription;