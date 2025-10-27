"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@/layouts/Loader";
import Link from "next/link";
import { toastError, toastSuccess } from "@/utils/toastMsg";
import { fetchSubProperty, updateSubProperty, deleteSubProperty } from "@/hooks/property.hooks";
import EditSubPropertyModal from "./EditSubPropertyModal";
import DeleteSubPropertyModal from "./DeleteSubPropertyModal";
import SubPropertySummary from "./components/SubPropertySummary";
import SubPropertyDescription from "./components/SubPropertyDescription";
import SubPropertyFeatures from "./components/SubPropertyFeatures";
import { MapDisplay } from "@/components/Custom";

const SubPropertyDetailsAdmin = () => {
  const router = useRouter();
  const { id: propertyId, subId: subPropertyId } = router.query;

  const [subProperty, setSubProperty] = useState<any | null>(null);
  const [parentProperty, setParentProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!propertyId || !subPropertyId) return;
    const getData = async () => {
      try {
        setLoading(true);
        // Fetch parent property to get both sub-property and parent listing status
        const token = localStorage.getItem("business-token") || 
                     localStorage.getItem("authToken") || 
                     localStorage.getItem("guard-token");
        
        if (!token) {
          console.error("Auth token missing");
          return;
        }
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${propertyId}`, {
          headers: { Authorization: token },
        });
        console.log("🔍 Sub-property page - Full property response:", res);
        const data = await res.json();
        console.log("🔍 Sub-property page - Property data:", data);
        const parentProp = data.data;
        console.log("🔍 Sub-property page - Parent property:", parentProp);
        console.log("🔍 Sub-property page - Parent property SubProperties:", parentProp.SubProperties);
        
        // Find the specific sub-property
        const sub = parentProp.SubProperties?.find(
          (s: any) => s.sid.toString() === (subPropertyId as string)
        );
        
        console.log("🔍 Sub-property page - Found sub-property:", sub);
        console.log("🔍 Sub-property page - Sub-property listingStatus:", sub?.listingStatus);
        
        setParentProperty(parentProp);
        setSubProperty(sub);
      } catch (err) {
        console.error("Error fetching sub-property:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [propertyId, subPropertyId]);

const handleUpdate = async (formData: FormData) => {
  try {
    const res = await updateSubProperty(subProperty.sid, formData);
    setSubProperty(res.data);
    setEditOpen(false);
    toastSuccess("Sub-property updated successfully!"); 
  } catch (err) {
    console.error(err);
    toastError("Failed to update sub-property."); 
  }
};

const handleDelete = async () => {
  try {
    await deleteSubProperty(subProperty.sid);
    setDeleteOpen(false);
    toastSuccess("Sub-property deleted successfully!"); // ✅ Success toast
    router.push(`/properties/${propertyId}`);
  } catch (err) {
    console.error(err);
    toastError("Failed to delete sub-property."); // ❌ Error toast
  }
};

  // Compute the correct parent listing status
  const computeParentListingStatus = () => {
    if (!parentProperty) return undefined;
    
    // If parent property is explicitly marked as sold, keep it sold
    if (parentProperty.listingStatus === "sold") {
      return "sold";
    }
    
    // If there are sub-properties, check if all of them are sold
    if (parentProperty.SubProperties && parentProperty.SubProperties.length > 0) {
      const allSubPropertiesSold = parentProperty.SubProperties.every(
        (sub: any) => sub.listingStatus === "sold"
      );
      
      // If all sub-properties are sold, mark the property as sold
      if (allSubPropertiesSold) {
        return "sold";
      }
    }
    
    // Otherwise, use the parent property's own listing status
    return parentProperty.listingStatus;
  };

  const toggleSection = (section: string) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  if (loading) return <div className="p-6 flex justify-center items-center"><Loader /></div>;
  if (!subProperty) return <div className="p-6 text-center text-red-600">Sub-property not found.</div>;

  // Log the sub-property data to see the map link
  console.log('SubPropertyParams - Sub-property data:', subProperty);
  console.log('SubPropertyParams - Sub-property mapLink:', subProperty.mapLink);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Breadcrumb */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              >
                ← Back to Property
              </button>
            </div>
            <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
              <div className="flex items-center">
                <Link href="/properties" className="text-blue-600 hover:underline">Properties</Link>
                <span className="mx-2">/</span>
                <Link href={`/properties/${propertyId}`} className="text-blue-600 hover:underline">Property Details</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">Sub-Property Details</span>
              </div>
            </nav>
          </div>
        </div>

        <div className="space-y-8">
          <SubPropertySummary subProperty={subProperty} />

          <SubPropertyDescription
            subProperty={subProperty}
            setModalImage={setModalImage}
            propertyId={propertyId as string}
            subPropertyId={subPropertyId as string}
            setEditOpen={setEditOpen}
            setDeleteOpen={setDeleteOpen}
            successMessage={successMessage}
            parentListingStatus={computeParentListingStatus()} // Use computed status
          />

          <SubPropertyFeatures
            subProperty={subProperty}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
             <div className="flex flex-col p-3 md:flex-row justify-between md:items-center">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Property Location
          </h2>
          {subProperty?.mapLink && (
            <a
              href={subProperty.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              View on Google Maps
            </a>
          )}
        </div>
            <div className="w-full h-96">
              <MapDisplay finalMapLink={subProperty.finalMapLink} />
            </div>
          </div>
        </div>
        
        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-6xl max-h-full">
              <img
                src={modalImage}
                alt="Property Image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {deleteOpen && (
          <DeleteSubPropertyModal
            isOpen={deleteOpen}
            subPropertyName={subProperty.name}
            onCancel={() => setDeleteOpen(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SubPropertyDetailsAdmin;