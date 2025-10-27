// // pages/properties/[id]/view.jsx
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { getPropertyById, getSubProperties } from "@/hooks/property.hooks";
// import { PropertyCard } from "@/components/Custom";
// import Link from "next/link";

// export default function ViewProperty() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [property, setProperty] = useState(null);
//   const [subProperties, setSubProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (id) fetchData(id);
//   }, [id]);

//   const fetchData = async (propertyId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const propData = await getPropertyById(propertyId);
//       if (!propData) throw new Error("Property not found");
//       setProperty(propData);

//       const subs = await getSubProperties(propertyId);
//       setSubProperties(subs);
//     } catch (err) {
//       console.error("Error loading property:", err);
//       setError(err.message || "Failed to load property");
//       setProperty(null);
//       setSubProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <p>Loading property details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center">
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => router.push("/properties")}
//           className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="p-6 text-center">
//         <p>No property found.</p>
//         <button
//           onClick={() => router.push("/properties")}
//           className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 text-black">

// <Link href={`/properties/${id}/Sub-Property/add`}>
//   <button className="bg-green-600 text-white px-4 py-2 rounded">
//     Add Sub-Property
//   </button>
// </Link>

// {/* Sub-properties */}
// <div>
//   <h2 className="text-2xl font-bold mb-4">Sub Properties</h2>
//   {subProperties.length === 0 ? (
//     <p className="text-gray-500">No subproperties found.</p>
//   ) : (
//     <div className="flex flex-wrap gap-4">
//       {subProperties.map((sub, index) => (
//         <PropertyCard
//           key={sub._id || index}
//           item={sub}
//           index={index}
//           details={false}
//           visitation={false}
//           onClick={() => router.push(`/properties/${sub._id}/view`)}
//         />
//       ))}
//     </div>
//   )}
// </div>

//     </div>
//   );
// }


// Example placeholder page
export default function Placeholder() {
  return <div>Page under construction 🚧</div>;
}
