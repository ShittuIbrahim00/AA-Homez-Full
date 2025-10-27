import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/layouts/Loader";
import { deleteProperty } from "@/hooks/property.hooks";
import { useFetchProperty } from "@/hooks/useFetchProperty";
import { toastError, toastSuccess } from "@/utils/toastMsg";

// Components
import BackButton from "../components/PropertyDetails/BackButton";
import PropertyImagesSection from "../components/PropertyDetails/PropertyImagesSection";
import PropertyInfo from "../components/PropertyDetails/PropertyInfo";
import SubPropertiesSection from "../components/PropertyDetails/SubPropertiesSection";
import DeleteConfirmationModal from "../components/PropertyDetails/DeleteConfirmationModal";
import ImagePreviewModal from "../components/PropertyDetails/ImagePreviewModal";
import { MapDisplay } from "@/components/Custom";

// Types
import { Property } from "@/types/property";

const PropertyDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  // Fetch property data
  const { property, loading, error, refetch } = useFetchProperty(id || "");

  // UI states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [computedListingStatus, setComputedListingStatus] = useState<string | undefined>(undefined);

  // Set the first image as featured when property loads
  useEffect(() => {
    if (property && property.images && property.images.length > 0 && !featuredImage) {
      setFeaturedImage(property.images[0]);
    }
  }, [property, featuredImage]);

  // Compute the correct listing status based on sub-properties
  useEffect(() => {
    if (property) {
      // If property is explicitly marked as sold, keep it sold
      if (property.listingStatus === "sold") {
        setComputedListingStatus("sold");
        return;
      }
      
      // If there are sub-properties, check if all of them are sold
      if (property.SubProperties && property.SubProperties.length > 0) {
        const allSubPropertiesSold = property.SubProperties.every(
          sub => sub.listingStatus === "sold"
        );
        
        // If all sub-properties are sold, mark the property as sold
        if (allSubPropertiesSold) {
          setComputedListingStatus("sold");
          return;
        }
      }
      
      // Otherwise, use the property's own listing status
      setComputedListingStatus(property.listingStatus);
    }
  }, [property]);

  // Handle delete property
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProperty(Number(id));
      if (result.success) {
        toastSuccess("Property deleted successfully");
        router.push("/properties");
      } else {
        toastError(result.message || "Failed to delete property");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toastError("Failed to delete property");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    // Refresh property data to show updated payment status
    refetch();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Back 
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Back 
          </button>
        </div>s
      </div>
    );
  }

  // Log the property data to see the map link
  // console.log('PropertyParams - Property data:', property);
  // console.log('PropertyParams - Property mapLink:', property.mapLink);

  return (
    <div className="p-4 sm:p-6">
      <BackButton onClick={() => router.push("/properties")} />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <PropertyImagesSection 
            images={property.images || []} 
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            pid={property.pid}
            onPay={() => router.push(`/properties/${id}/pay`)} // Navigate to payment page
            listingStatus={computedListingStatus} // Use computed status instead of raw property status
            name={property.name}
            description={property.description}
            price={property.price}
            priceStart={property.priceStart}
            priceEnd={property.priceEnd}
            type={property.type}
          />
        </div>
        
        {/* Right Column - Property Info */}
        <div className="lg:col-span-1">
          <PropertyInfo 
            name={property.name}
            description={property.description}
            location={property.location}
            price={property.price}
            priceStart={property.priceStart}
            priceEnd={property.priceEnd}
            listingStatus={computedListingStatus} // Use computed status instead of raw property status
            paymentStatus={property.paymentStatus}
            soldTo={property.soldTo}
            propertyUser={property.User}
            yearBuilt={property.yearBuilt}
            type={property.type}
            landMark={property.landMark}
            mapLink={property.mapLink}
            hottestCount={property.hottestCount}
            paidAmount={property.paidAmount}
            deficitAmount={property.deficitAmount}
          />
        </div>
      </div>
      
      {/* Sub-Properties Section */}
      <div className="mt-8">
        <SubPropertiesSection 
          propertyId={property.pid} 
          subProperties={property.SubProperties || []} 
          onPreviewImage={setSelectedImage}
          parentListingStatus={computedListingStatus} // Use computed status instead of raw property status
        />
      </div>
        
      {/* Map Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col p-3 md:flex-row justify-between md:items-center">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Property Location
          </h2>
          {property?.mapLink && (
            <a
              href={property.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              View on Google Maps
            </a>
          )}
        </div>
        <MapDisplay finalMapLink={property.finalMapLink} />
      </div>

    

      {/* Modals */}
      {/* Removed PayForPropertyModal since we're using a dedicated page now */}
      
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        propertyName={property.name || "Property"}
      />
      
      <ImagePreviewModal
        imageUrl={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default PropertyDetails;