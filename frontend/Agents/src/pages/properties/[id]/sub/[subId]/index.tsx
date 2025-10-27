"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { 
  FaArrowLeft, 
  FaBath, 
  FaBed, 
  FaCar, 
  FaChevronDown, 
  FaChevronUp, 
  FaCalendarAlt,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import dynamic from "next/dynamic";
import Loader from "@/layouts/Loader";
import { fetchSubProperty } from "@/hooks/property.hooks";
import Link from "next/link";
import BackHeader from "@/components/Custom/BackHeader";

// Import Leaflet CSS in the parent component
import "leaflet/dist/leaflet.css";

const SubPropertyMapInner = dynamic(() => import("./SubPropertyMapInner"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const AgentSubPropertyDetails = () => {
  const router = useRouter();
  const { id: propertyId, subId: subPropertyId } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState(null);

  const [subProperty, setSubProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    appliances: false,
    interior: false,
    otherRooms: false,
    utilities: false
  });

  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    const storedAid = localStorage.getItem("aid");
    if (storedAid) {
      setAgentId(storedAid);
    }
  }, []);

  useEffect(() => {
    console.log("SubProperty object:", subProperty);
    console.log("Property ID from router:", propertyId);
    console.log("Agent ID from localStorage:", agentId);
  }, [subProperty, propertyId, agentId]);

  useEffect(() => {
    if (!propertyId || !subPropertyId) return;

    const getData = async () => {
      try {
        setLoading(true);
        const sub = await fetchSubProperty(propertyId as string, subPropertyId as string);
        setSubProperty(sub);
      } catch (err) {
        console.error("Error fetching sub-property:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [propertyId, subPropertyId]);

  // Navigation for image gallery
  const nextImage = () => {
    if (subProperty?.images?.length) {
      setCurrentImageIndex((prev) => 
        prev === subProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (subProperty?.images?.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? subProperty.images.length - 1 : prev - 1
      );
    }
  };

  const totalBaths =
    Array.isArray(subProperty?.bathrooms)
      ? subProperty.bathrooms.reduce((sum: number, b: any) => sum + Number(b.count), 0)
      : typeof subProperty?.bathrooms === "number"
      ? subProperty.bathrooms
      : 0;

  const toggleSection = (section: string) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  if (loading) return <div className="p-6 flex justify-center items-center"><Loader /></div>;
  if (!subProperty) return <div className="p-6 text-center text-red-600">Sub-property not found.</div>;

  return (
     <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 mb-6">
        <BackHeader text="Back " />
        
        {/* Breadcrumb Navigation - Responsive */}
        <nav className="text-sm text-gray-500 mt-4 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
          <div className="flex items-center min-w-max">
            <Link href="/home" className="text-blue-600 hover:underline">Properties</Link>
            <span className="mx-2">/</span>
            <Link href={`/properties/${propertyId}`} className="text-blue-600 hover:underline">Property Details</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Sub-Property Details</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image Gallery Section */}
        <div className="relative">
          {subProperty.images?.length > 0 && (
            <div className="relative w-full h-[300px] md:h-[500px]">
              <img
                src={subProperty.images[currentImageIndex]}
                alt={subProperty.name}
                className="w-full h-full object-cover"
                onClick={() => setModalImage(subProperty.images[currentImageIndex])}
              />
              
              {/* Navigation Arrows */}
              {subProperty.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition"
                    aria-label="Next image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} of {subProperty.images?.length || 1}
              </div>
            </div>
          )}
          
          {/* Thumbnail Gallery */}
          <div className="hidden md:grid grid-cols-4 gap-2 p-4 bg-gray-100">
            {subProperty.images?.map((img: string, idx: number) => (
              <div 
                key={idx} 
                className={`relative h-20 cursor-pointer rounded-lg overflow-hidden border-2 ${currentImageIndex === idx ? 'border-orange-500' : 'border-transparent'}`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Property Info */}
            <div className="lg:w-2/3">
              {/* Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {subProperty.name}
                    </h1>
                    <p className="flex items-center text-gray-600 mt-1">
                      <FaMapMarkerAlt className="mr-2 text-orange-500" />
                      {subProperty.location}
                    </p>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-green-700">
                    ₦{subProperty.price}
                  </div>
                </div>

                {/* Property Facts */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {subProperty.bedrooms && (
                    <div className="flex items-center">
                      <FaBed className="text-orange-500 mr-2" />
                      <span className="font-medium">
                        {typeof subProperty.bedrooms === "number"
                          ? `${subProperty.bedrooms} ${subProperty.bedrooms === 1 ? 'Bed' : 'Beds'}`
                          : Array.isArray(subProperty.bedrooms)
                          ? subProperty.bedrooms.map((b: any) => `${b.count} ${b.type}`).join(", ")
                          : "Bedrooms"}
                      </span>
                    </div>
                  )}
                  {totalBaths > 0 && (
                    <div className="flex items-center">
                      <FaBath className="text-orange-500 mr-2" />
                      <span className="font-medium">
                        {totalBaths} {totalBaths === 1 ? 'Bath' : 'Baths'}
                      </span>
                    </div>
                  )}
                  {subProperty.area && (
                    <div className="flex items-center">
                      <FaRulerCombined className="text-orange-500 mr-2" />
                      <span className="font-medium">{subProperty.area} sqft</span>
                    </div>
                  )}
                  {subProperty.type && (
                    <div className="font-medium text-gray-600">
                      {subProperty.type}
                    </div>
                  )}
                  {subProperty.yearBuilt && (
                    <div className="flex items-center">
                      <BiBuildingHouse className="text-orange-500 mr-2" />
                      <span className="font-medium">Built {subProperty.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {subProperty.description}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Property Details</h3>
                  <div className="space-y-2">
                    {subProperty.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year Built</span>
                        <span className="font-medium">{subProperty.yearBuilt}</span>
                      </div>
                    )}
                    {subProperty.foundation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Foundation</span>
                        <span className="font-medium">{subProperty.foundation}</span>
                      </div>
                    )}
                 
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Key Information</h3>
                  <div className="space-y-2">
                    {subProperty.keyInfo?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              

              {/* Land Info */}
              {subProperty.landInfo?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                  <button
                    className="flex justify-between w-full font-semibold p-5 text-left hover:bg-gray-50"
                    onClick={() => toggleSection('landInfo')}
                  >
                    <span className="text-lg font-semibold">Land Information</span>
                    {collapsedSections['landInfo'] ? <FaChevronDown /> : <FaChevronUp />}
                  </button>
                  {!collapsedSections['landInfo'] && (
                    <div className="p-5 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {subProperty.landInfo.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

             
            </div>

            {/* Right Column - Actions */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
               

                {/* Schedule Visit - Changed to Link */}
                <Link
                  href={{
                    pathname: "/schedule/visit",
                    query: {
                      aid: subProperty?.uid?.toString() || agentId,
                      pid: subProperty?.pid?.toString(),
                      sid: subProperty?.sid?.toString(),
                      propertyname: subProperty?.propertyName || propertyId, // Use propertyName if available, otherwise use propertyId
                      propertylocation: subProperty?.propertyLocation || "Property Location",
                      subpropertyname: subProperty?.name,
                      subpropertylocation: subProperty?.location
                    }
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 mb-4 text-center"
                >
                  <FaCalendarAlt className="text-lg" /> Schedule Visit
                </Link>

                {/* Additional Info */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Property Information</h3>
                  <div className="space-y-3">
                  
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium capitalize">{subProperty.type}</span>
                    </div>
              
                  </div>
                </div>
              </div>



              {/* Features Sections */}
              <div className="space-y-6 ">
                {["appliances", "interior", "otherRooms", "utilities"].map(
                  (field) =>
                    subProperty[field]?.length > 0 && (
                      <div key={field} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                          className="flex justify-between w-full font-semibold p-5 text-left hover:bg-gray-50"
                          onClick={() => toggleSection(field)}
                        >
                          <span className="capitalize text-lg font-semibold">{field}</span>
                          {collapsedSections[field] ? <FaChevronDown /> : <FaChevronUp />}
                        </button>
                        {!collapsedSections[field] && (
                          <div className="p-5 pt-0">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {subProperty[field].map((item: string | any, idx: number) => (
                                <li key={idx} className="flex items-center p-3 bg-gray-50 rounded">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                  <span>
                                    {typeof item === 'string' ? item : item.name || item.label || 'N/A'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

 {/* Map */}
              <div className="mt-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
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
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                  {subProperty?.finalMapLink ? (
                    <SubPropertyMapInner finalMapLink={subProperty.finalMapLink} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
                      <div className="text-lg font-semibold mb-2">Location Unavailable</div>
                      <div className="text-sm">
                        Sub-property location data is not available
                      </div>
                    </div>
                  )}
                </div>
              </div>
      {/* Image Preview Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
        >
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full hover:bg-white/10 transition z-10"
              onClick={() => setModalImage(null)}
              aria-label="Close image preview"
            >
              <FaTimes />
            </button>
            <img
              src={modalImage}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              alt="Preview"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentSubPropertyDetails;