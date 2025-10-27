// components/PropertyModal.tsx
import React, { useEffect, useState } from "react";
import { getSingleProperty } from "@/utils/api";
import Image from "next/image";
import Spinner from "@/pages/notifications/Spinner";

const PropertyModal = ({ propertyId, onClose }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await getSingleProperty(propertyId);
        console.log(response.data)
        if (response?.data) {
          setProperty(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [propertyId]);

  if (!property || loading) {
    if (loading) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-modal">
          <div className="bg-white p-8 rounded-lg text-center flex flex-col items-center">
            <Spinner className="h-10 w-10 mb-4" />
            <p>Loading property details...</p>
          </div>
        </div>
      );
    }
    if (error || !property) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-modal">
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-red-600 font-semibold mb-2">Failed to load property details.</p>
            <button className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-10"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2">{property?.name ?? "No Name"}</h2>
        <div className="text-xs text-gray-500 mb-4">ID: {property?.pid ?? property?.id ?? "N/A"}</div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {property?.images?.length > 0 ? (
            property.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`property image ${idx + 1}`}
                width={300}
                height={200}
                className="rounded-md object-cover w-full h-[200px]"
              />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-400">No images available.</div>
          )}
        </div>

        <div className="text-sm text-gray-700 mb-2">
          <strong>Location:</strong> {property?.location ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Landmark:</strong> {property?.landMark ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Map Link:</strong> {property?.mapLink ? (
            <a href={property.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Map</a>
          ) : "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Price:</strong> ₦{property?.priceRange ?? property?.price ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Type:</strong> {property?.type ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Status:</strong> {property?.listingStatus ?? (property?.status ? "Available" : "Unavailable")}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Year Built:</strong> {property?.yearBuilt ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Hottest Count:</strong> {property?.hottestCount ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Deficit Amount:</strong> ₦{property?.deficitAmount ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Payment Status:</strong> {property?.paymentStatus ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Paid Amount:</strong> ₦{property?.paidAmount ?? "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Listing User:</strong> {property?.User ? `${property.User.firstName} ${property.User.lastName}` : "N/A"}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Description:</strong>
          <p className="mt-1">{property?.description ?? "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;