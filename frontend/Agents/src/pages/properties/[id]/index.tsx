import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCar, FaTimes, FaCalendarAlt } from "react-icons/fa";
import Loader from "@/layouts/Loader";
import dynamic from "next/dynamic";
import BackHeader from "@/components/Custom/BackHeader";

// Import Leaflet CSS in the parent components
import "leaflet/dist/leaflet.css";

const PropertyMapInner = dynamic(() => import("./PropertyMapInner"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});


  const embedUrl = "https://www.google.com/maps?q=9.0898844,7.4094&output=embed";

const AgentPropertyDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

  // Function to get default image when no images are available
  const getDefaultImage = () => {
    return "/images/high_build2.jpeg";
  };

  const parsePriceString = (priceStr) => {
    if (!priceStr) return 0;
    let num = parseFloat(priceStr.replace(/,/g, ""));
    if (priceStr.toUpperCase().includes("K")) num *= 1_000;
    else if (priceStr.toUpperCase().includes("M")) num *= 1_000_000;
    return num;
  };

  const formatPrice = (price) => {
    const num = typeof price === "number" ? price : parsePriceString(price);
    if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `₦${(num / 1_000).toFixed(1)}K`;
    return `₦${num.toLocaleString()}`;
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://aa-homez.onrender.com/api/v1/property/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token") || ""}`,
            },
          }
        );
        console.log("Property data:", res.data.data); // Debug log
     
        setProperty(res.data.data);
        // Set featured image to either the first property image or default image
        if (res.data.data.images?.length > 0) {
          setFeaturedImage(res.data.data.images[0]);
        } else {
          setFeaturedImage(getDefaultImage());
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  // Navigation for image gallery
  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    if (property?.images?.length) {
      setFeaturedImage(property.images[currentImageIndex]);
    }
  }, [currentImageIndex, property?.images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
        <Loader />
      </div>
    );
  }
  if (!property || typeof property !== 'object')
    return <p className="p-6 text-center text-gray-600">Property not found.</p>;



  return (
   <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="max-w-7xl mx-auto mb-4 px-4 md:px-0">
        <BackHeader text="Back " />
        
        {/* Breadcrumb Navigation - Responsive */}
        <nav className="text-sm text-gray-500 mt-4 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
          <div className="flex items-center min-w-max">
            <Link href="/home" className="text-blue-600 hover:underline">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Property Details</span>
          </div>
        </nav>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      
        <div className="relative">
          <div className="relative w-full h-[300px] md:h-[500px]">
            <img
              src={featuredImage || getDefaultImage()}
              alt={property.name || "Property Image"}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
              onClick={() => setPreviewImage(featuredImage)}
            />
            
            {/* Navigation arrows - only show if there are multiple images */}
            {property?.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                  aria-label="Next image"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </>
            )}
            
            {/* Image counter - only show if there are multiple images */}
            {property?.images?.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                {currentImageIndex + 1} of {property.images?.length || 1}
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery - only show if there are multiple images */}
          <div className="hidden md:grid grid-cols-4 gap-3 p-4 bg-gray-50">
            {property?.images?.length > 1 ? (
              property.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative h-24 cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-300 ${currentImageIndex === idx ? 'border-orange-500 shadow-lg' : 'border-transparent hover:border-orange-300'}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Property Info */}
            <div className="lg:w-2/3">
          
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                      {property.name}
                    </h1>

                   


                    
                    <p className="flex items-center text-gray-600 text-lg">
                      <FaMapMarkerAlt className="mr-2 text-orange-500 text-xl" />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-green-700">
                    {formatPrice(property.price)}
                  </div>
                </div>

           
                <div className="flex flex-wrap gap-3 mt-6">
                  {property.bedrooms && (
                    <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                      <FaBed className="text-orange-500 mr-2 text-lg" />
                      <span className="font-semibold text-lg">
                        {typeof property.bedrooms === 'number' 
                          ? `${property.bedrooms} ${property.bedrooms === 1 ? 'Bed' : 'Beds'}` 
                          : Array.isArray(property.bedrooms) && property.bedrooms.length > 0
                          ? property.bedrooms.map((b: any) => `${b.count} ${b.type}`).join(', ')
                          : typeof property.bedrooms === 'string' 
                          ? property.bedrooms 
                          : 'Bedrooms'}
                      </span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                      <FaBath className="text-blue-500 mr-2 text-lg" />
                      <span className="font-semibold text-lg">
                        {typeof property.bathrooms === 'number' 
                          ? `${property.bathrooms} ${property.bathrooms === 1 ? 'Bath' : 'Baths'}` 
                          : Array.isArray(property.bathrooms) && property.bathrooms.length > 0
                          ? property.bathrooms.map((b: any) => `${b.count} ${b.type}`).join(', ')
                          : typeof property.bathrooms === 'string' 
                          ? property.bathrooms 
                          : 'Bathrooms'}
                      </span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                      <FaRulerCombined className="text-green-500 mr-2 text-lg" />
                      <span className="font-semibold text-lg">{property.area} sqft</span>
                    </div>
                  )}
                  {property.type && (
                    <div className="bg-purple-50 px-4 py-2 rounded-lg">
                      <span className="font-semibold text-lg text-purple-700">
                        {property.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

        
             
            </div>

           
            <div className="lg:w-1/3 ">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sticky top-">
                {/* Schedule Visit Button - Changed to Link */}
                <Link
                  href={{
                    pathname: "/schedule/visit",
                    query: {
                      aid: property?.User?.uid?.toString() || localStorage.getItem("aid"),
                      pid: property?.pid?.toString(),
                      propertyname: property?.name,
                      propertylocation: property?.location
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg text-center"
                >
                  <FaCalendarAlt className="text-xl" /> 
                  <span className="whitespace-nowrap">Schedule Visit</span>
                </Link>
              </div>
              
             



             
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Market Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="text-gray-700">Avg. Price in Area</span>
                    <span className="font-semibold">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-100">
                    <span className="text-gray-700">Price Trend</span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                      +5.2%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Days on Market</span>
                    <span className="font-semibold">
                      {property.createdAt 
                        ? Math.ceil((new Date().getTime() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
                        : 'N/A'} days
                    </span>
                  </div>
                </div>
              </div>



 <div className="my-8 w-full">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Property Details
                  </h3>
                  <div className="space-y-3">
                    {property.yearBuilt && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Year Built</span>
                        <span className="font-semibold">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.foundation && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Foundation</span>
                        <span className="font-semibold">{property.foundation}</span>
                      </div>
                    )}
                    {property.listingStatus && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Listing Status</span>
                        <span className="font-semibold capitalize">{property.listingStatus}</span>
                      </div>
                    )}

                         {property.priceStart && property.priceEnd && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Price Range</span>
                        <span className="font-semibold">
                          {formatPrice(property.priceStart)} - {formatPrice(property.priceEnd)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

               
              </div>


            </div>

            
          </div>

     
        </div>
      </div>

      {property.SubProperties && property.SubProperties.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Sub-Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.SubProperties && Array.isArray(property.SubProperties) ? 
              property.SubProperties
                .filter((sub) => sub.listingStatus?.toLowerCase() !== "sold") // Filter out sold sub-properties
                .map((sub) => (
              <Link
                key={sub.sid}
                href={`/properties/${id}/sub/${sub.sid}`}
                className="group block rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
               
                <div className="relative h-48">
                  {sub.images && sub.images.length > 0 ? (
                    <img
                      src={sub.images[0]}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={getDefaultImage()}
                      alt={sub.name || "Sub-property"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow">
                    {formatPrice(sub.price)}
                  </div>
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl"></div>
                </div>

               
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {sub.description}
                  </p>

                 
                  <div className="flex flex-wrap gap-2">
                    {sub.bedrooms && (
                      <div className="flex items-center text-sm bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                        <FaBed className="mr-1 text-orange-500" />
                        <span>
                          {typeof sub.bedrooms === 'number' 
                            ? `${sub.bedrooms} bed${sub.bedrooms !== 1 ? 's' : ''}` 
                            : Array.isArray(sub.bedrooms) 
                            ? sub.bedrooms.map(b => `${b.count} ${b.type}`).join(', ')
                            : 'Bedrooms'}
                        </span>
                      </div>
                    )}
                    {sub.bathrooms && (
                      <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                        <FaBath className="mr-1 text-blue-500" />
                        <span>
                          {typeof sub.bathrooms === 'number' 
                            ? `${sub.bathrooms} bath${sub.bathrooms !== 1 ? 's' : ''}` 
                            : Array.isArray(sub.bathrooms) 
                            ? sub.bathrooms.map(b => `${b.count} ${b.type}`).join(', ')
                            : 'Bathrooms'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )) : (
              <p className="text-gray-500 col-span-full text-center py-8">No sub-properties available.</p>
            )}
            {property.SubProperties && Array.isArray(property.SubProperties) && 
             property.SubProperties.filter((sub) => sub.listingStatus?.toLowerCase() !== "sold").length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">No available sub-properties.</p>
            )}
          </div>
        </div>
      )}



 {/* <iframe
      src={embedUrl}
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe> */}






         {/* Property Location Map */}
      <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
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
        
        <div className="w-full h-[400px] rounded-lg overflow-hidden ">
          {property?.finalMapLink ? (
            <PropertyMapInner finalMapLink={property.finalMapLink} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
              <div className="text-lg font-semibold mb-2">Location Unavailable</div>
              <div className="text-sm">
                Property location data is not available
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Image Preview Modal */}
      {previewImage && typeof previewImage === 'string' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-modal p-4"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
        >
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full hover:bg-white/10 transition z-10"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              alt="Preview"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentPropertyDetails;