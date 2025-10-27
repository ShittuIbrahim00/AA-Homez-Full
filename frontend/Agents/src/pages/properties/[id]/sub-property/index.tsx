// import React, { useState, useEffect, useContext } from "react";
// import { useRouter } from "next/router";
// import { FaArrowLeft, FaTimes } from "react-icons/fa";
// import { Map, PropertyCard2, PropertyHeader } from "@/components/Custom";
// import { ShareModal } from "@/components/modal";
// import { getSingleProperty } from "@/utils/api";
// import { SchedulerContext } from "@/context/scheduler";

// const AgentPropertyDashboard = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [, setTemp] = useContext(SchedulerContext);
//   const [property, setProperty] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [featured, setFeatured] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [shareOpen, setShareOpen] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (!id) return;
//       setLoading(true);
//       const res = await getSingleProperty(Array.isArray(id) ? id[0] : id);
//       if (res.success) {
//         setProperty(res.data);
//         setFeatured(res.data.images[0] ?? null);
//       }
//       setLoading(false);
//     })();
//   }, [id]);

//   if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
//   if (!property) return <div className="h-screen flex items-center justify-center">Property not found.</div>;

//   const formatPrice = (val: string | number) => {
//     const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
//     if (num >= 1e6) return `₦${(num / 1e6).toFixed(1)}M`;
//     if (num >= 1e3) return `₦${(num / 1e3).toFixed(1)}K`;
//     return `₦${num.toLocaleString()}`;
//   };

//   const go = (path, q?) => router.push({ pathname: path, query: q }, undefined, { shallow: true });

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto text-gray-800">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-sm bg-orange-100 text-orange-800 px-3 py-2 rounded-lg hover:bg-orange-200 transition">
//           <FaArrowLeft /> Back
//         </button>
//         <button onClick={() => setShareOpen(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
//           Share
//         </button>
//       </div>

//       {/* Gallery */}
//       <div className="space-y-4 mb-8">
//         {featured && (
//           <img
//             src={featured}
//             alt={property.name}
//             className="w-full h-80 sm:h-96 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition"
//             onClick={() => setPreview(featured)}
//           />
//         )}
//         <div className="flex space-x-3 overflow-x-auto">
//           {property.images?.map((img: string, idx: number) => (
//             <img
//               key={idx}
//               src={img}
//               alt={`Gallery ${idx + 1}`}
//               className={`w-24 h-24 object-cover rounded-md cursor-pointer transition ${featured === img ? "ring-4 ring-orange-500" : ""}`}
//               onClick={() => setFeatured(img)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Overview */}
//       <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
//         <h1 className="text-3xl font-bold mb-1 text-orange-800">{property.name}</h1>
//         <p className="text-gray-600 mb-4 text-lg">{property.location}</p>
//         <p className="text-2xl font-semibold text-orange-600 mb-1">
//           {property.priceRange ? `Range: ${property.priceRange}` : formatPrice(property.price)}
//         </p>
//         <p className="text-sm text-gray-500 mb-4">Year Built: {property.yearBuilt}</p>
//         <button
//           onClick={() => { setTemp(property); go("/schedule/create", { sub: property.sid }); }}
//           className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"
//         >
//           Schedule Visit
//         </button>
//       </div>

//       {/* Description & Map */}
//       <div className=" mb-8">
//         <div className="flex-1 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-3 text-orange-700">Description</h2>
//           <p className="text-gray-700 leading-relaxed">{property.description}</p>
//         </div>
//         <div className="flex-1 bg-white p-6 rounded-lg shadow mt-6 lg:mt-0">
//           <h2 className="text-xl font-semibold mb-3 text-orange-700">Location</h2>
//           <Map />
//         </div>
//       </div>

//       {/* Insights & Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-3 text-orange-700">Property Details</h2>
//           <ul className="space-y-2 text-sm">
//             <li><strong>Type:</strong> {property.type}</li>
//             <li><strong>Landmark:</strong> {property.landMark}</li>
//             {property.mapLink && (
//               <li>
//                 <strong>Map:</strong>{" "}
//                 <a href={property.mapLink} target="_blank" rel="noopener" className="text-orange-600 underline">
//                   Open Map
//                 </a>
//               </li>
//             )}
//             <li><strong>Listing Status:</strong> {property.listingStatus}</li>
//           </ul>
//         </div>
//       </div>

//       {/* Sub-Properties */}
//       <div className="bg-white p-6 rounded-lg shadow mb-8">
//         <PropertyHeader text="Sub-Properties" noExternal />
//         {property.SubProperties?.length ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//             {property.SubProperties.map((sub: any, i: number) => (
//               <PropertyCard2
//                 key={i}
//                 item={sub}
//                 onClick={() => go(`/properties/${sub.sid}/view`)}
//                 index={i}
//                 sold={false}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 mt-4">No sub-properties found.</p>
//         )}
//       </div>

//       {/* Modals */}
//       <ShareModal modalOpen={shareOpen} setModalOpen={setShareOpen} />
//       {preview && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreview(null)}
//         >
//           <div className="relative">
//             <button
//               onClick={() => setPreview(null)}
//               className="absolute top-2 right-2 text-white text-3xl p-2"
//               aria-label="Close preview"
//             >
//               <FaTimes />
//             </button>
//             <img src={preview} alt="Preview" className="max-h-[80vh] w-auto rounded" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AgentPropertyDashboard;





import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaBed, FaBath, FaArrowLeft, FaTimes, FaCalendarAlt } from "react-icons/fa";

const AgentPropertyDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

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
          { headers: { Authorization: `${localStorage.getItem("token") || ""}` } }
        );
        setProperty(res.data.data);
        if (res.data.data.images?.length > 0) setFeaturedImage(res.data.data.images[0]);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!property) return <p className="p-6 text-center">Property not found.</p>;

  const handleScheduleClick = () => {
    // Example: navigate to scheduling page or open modal
    router.push(`/properties/${id}/schedule`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto text-black">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="md:px-4  p-2 items-center gap-2 md:py-2 bg-gray-200 rounded hover:bg-gray-300 transition text-xs flex flex-row mb-4"
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      {/* Property Details Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Featured Image */}
        <div className="lg:w-2/3">
          {featuredImage && (
            <img
              src={featuredImage}
              alt={property.name}
              className="w-full h-80 sm:h-96 md:h-[32rem] object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition"
              onClick={() => setPreviewImage(featuredImage)}
            />
          )}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {property.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-20 sm:h-24 object-cover rounded cursor-pointer hover:opacity-90 transition"
                onClick={() => setFeaturedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="lg:w-1/3 flex flex-col justify-start">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-gray-700 mb-2 line-clamp-3">{property.description}</p>
          <p className="font-medium mb-1">📍 {property.location}</p>
          <p className="font-semibold text-green-700 mb-1">
            Price: {formatPrice(property.price)}
          </p>
          {property.priceStart && property.priceEnd && (
            <p className="font-semibold text-green-700 mb-1">
              Range: {formatPrice(property.priceStart)} - {formatPrice(property.priceEnd)}
            </p>
          )}
        </div>
      </div>

      {/* Sub-properties Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">Sub-Properties</h2>
          <button
            onClick={handleScheduleClick}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaCalendarAlt /> Schedule Visit
          </button>
        </div>

        {!property.SubProperties || property.SubProperties.length === 0 ? (
          <p className="text-gray-500">No sub-properties available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {property.SubProperties.map((sub) => (
              <Link key={sub.sid} href={`/properties/${id}/sub/${sub.sid}`}>
                <div className="relative group bg-gray-50 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition">
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    {formatPrice(sub.price)}
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col">
                    <h3 className="font-semibold text-lg mb-1 text-black">{sub.name}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-3">{sub.description}</p>
                    {sub.bedrooms && (
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1 bg-red-100 rounded px-2 py-1">
                        <FaBed />
                        <span>
                          {typeof sub.bedrooms === "number"
                            ? `${sub.bedrooms} Bedroom${sub.bedrooms > 1 ? "s" : ""}`
                            : Array.isArray(sub.bedrooms) && sub.bedrooms.length > 0
                            ? sub.bedrooms.map((b) => `${b.count} ${b.type}`).join(", ")
                            : ""}
                        </span>
                      </div>
                    )}
                    {sub.bathrooms && (
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1 bg-blue-100 rounded px-2 py-1">
                        <FaBath />
                        <span>
                          {typeof sub.bathrooms === "number"
                            ? `${sub.bathrooms} Bathroom${sub.bathrooms > 1 ? "s" : ""}`
                            : Array.isArray(sub.bathrooms) && sub.bathrooms.length > 0
                            ? sub.bathrooms.map((b) => `${b.count} ${b.type}`).join(", ")
                            : ""}
                        </span>
                      </div>
                    )}
                    {sub.keyInfo && sub.keyInfo.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {sub.keyInfo.map((info, idx) => (
                          <span
                            key={idx}
                            className="text-sm bg-gray-200 rounded-full px-3 py-1"
                          >
                            {info.label}: {info.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {sub.images && sub.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {sub.images.slice(0, 2).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={sub.name}
                            className="w-full h-24 sm:h-28 object-cover rounded hover:opacity-90 transition"
                            onClick={(e) => {
                              e.preventDefault();
                              setPreviewImage(img);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full">
            <button
              className="absolute top-2 right-2 text-white text-2xl p-1 hover:text-gray-300"
              onClick={() => setPreviewImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              className="max-h-[80vh] w-full sm:w-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPropertyDetails;
