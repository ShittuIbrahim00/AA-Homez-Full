// import React, { useState } from "react";
// import axios from "axios";

// const API_URL = "https://aa-homez.onrender.com/api/v1";

// interface ApiResponse {
//   status?: boolean;
//   message?: string;
//   data?: any;
// }

// export default function TestAddSub() {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<ApiResponse | null>(null);

//   // Handle image input
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!imageFile) {
//       alert("Please select an image file");
//       return;
//     }

//     try {
//       setLoading(true);

//       const guardToken = localStorage.getItem("business-token");
//       if (!guardToken) {
//         alert("No guard-token found in localStorage!");
//         return;
//       }

//       // Build FormData
//       const formData = new FormData();

//       // Append required fields (hard-coded)
//       formData.append("name", "Luxury Villa Unit B");
//       formData.append("description", "3-bedroom luxury villa with panoramic ocean views");
//       formData.append("location", "Malibu, California");
//       formData.append("price", "2500000");
//       formData.append("bedrooms", "3");
//       formData.append("mapLink", "https://maps.google.com/maps?q=34.025922,-118.779757");
//       formData.append("landMark", "Near Pepperdine University");
//       formData.append("yearBuilt", "2020");
//       formData.append("foundation", "Concrete Slab");
//       formData.append("type", "Rent");

//       // ✅ Arrays & objects as repeated keys (not just JSON)
//       const keyInfo = [
//         { label: "Square Feet", value: "3200" },
//         { label: "Garage", value: "2 cars" },
//       ];
//       keyInfo.forEach((item, i) => {
//         formData.append(`keyInfo[${i}][label]`, item.label);
//         formData.append(`keyInfo[${i}][value]`, item.value);
//       });

//       const bathrooms = [
//         { type: "Full", count: 2 },
//         { type: "Half", count: 1 },
//       ];
//       bathrooms.forEach((b, i) => {
//         formData.append(`bathrooms[${i}][type]`, b.type);
//         formData.append(`bathrooms[${i}][count]`, b.count.toString());
//       });

//       ["Smart Fridge", "Wine Cooler", "Induction Cooktop"].forEach((a, i) => {
//         formData.append(`appliances[${i}]`, a);
//       });

//       ["Hardwood Floors", "Smart Home System", "Walk-in Closets"].forEach((f, i) => {
//         formData.append(`interior[${i}]`, f);
//       });

//       ["Home Theater", "Wine Cellar", "Gym"].forEach((r, i) => {
//         formData.append(`otherRooms[${i}]`, r);
//       });

//       const landInfo = [
//         { label: "Lot Size", value: "0.5 acres" },
//         { label: "View", value: "Ocean View" },
//       ];
//       landInfo.forEach((item, i) => {
//         formData.append(`landInfo[${i}][label]`, item.label);
//         formData.append(`landInfo[${i}][value]`, item.value);
//       });

//       ["Solar Panels", "Tankless Water Heater", "EV Charging"].forEach((u, i) => {
//         formData.append(`utilities[${i}]`, u);
//       });

//       // Image (file)
//       formData.append("images", imageFile);

//       // Debug log
//       for (const [key, value] of formData.entries()) {
//         console.log("📦", key, value);
//       }

//       // Send request
//       const propertyId = 25;
//       const res = await axios.post<ApiResponse>(
//         `${API_URL}/property/sub/add/${propertyId}`,
//         formData,
//         {
//           headers: {
//             Authorization: guardToken,
//           },
//         }
//       );

//       console.log("✅ Response:", res.data);
//       setResult(res.data);
//     } catch (err: any) {
//       console.error("❌ Error:", err.response?.data || err.message);
//       setResult(err.response?.data || { message: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg">
//       <h1 className="text-xl font-bold mb-4">Test Add Sub-Property</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Submitting..." : "Submit Sub-Property"}
//         </button>
//       </form>

//       {result && (
//         <pre className="mt-4 p-3 bg-gray-100 text-sm overflow-auto rounded">
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }


import React from 'react'

const Testadd = () => {
  return (
    <div>
      
    </div>
  )
}

export default Testadd
