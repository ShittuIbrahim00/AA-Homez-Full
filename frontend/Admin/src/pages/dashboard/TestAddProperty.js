import React, { useState } from "react";
import axios from "axios";

const TestAddProperty = () => {
  const [imageFile, setImageFile] = useState(null);

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleAdd = async () => {
    console.log("Add Property button clicked"); // ✅ Button clicked

    const token = localStorage.getItem("guard-token");
    console.log("Guard token:", token); // ✅ Check token

    if (!token) {
      console.warn("No guard token found!");
      return alert("Guard token missing");
    }

    if (!imageFile) {
      console.warn("No image selected");
      return alert("Please select an image");
    }

    try {
      console.log("Converting image to base64...");
      const base64Image = await fileToBase64(imageFile);
      console.log("Base64 conversion done:", base64Image.slice(0, 50), "..."); // show first 50 chars

      const propertyData = {
        name: "Royal Mines Apartment",
        description: "A sleek modern apartment with ocean view.",
        location: "Lekki Phase 1",
        price: 250000000,
        priceStart: "₦250,000,000",
        priceEnd: "₦280,000,000",
        images: [base64Image],
        mapLink: "https://maps.google.com/?q=Lekki+Phase+1",
        landMark: "Close to Lekki Conservation Centre",
        yearBuilt: "2023",
        type: "Industrial",
        listingStatus: "available",
      };

      console.log("Sending property data to backend...", propertyData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/property/add`,
        propertyData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      console.log("Success:", response.data);
      alert("Property added successfully!");
    } catch (error) {
      console.error("Error sending property:", error.response?.data || error.message);
      alert("Failed to add property");
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          console.log("File selected:", e.target.files[0]);
          setImageFile(e.target.files[0]);
        }}
        className="mb-2"
      />
      <br />
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Property
      </button>
    </div>
  );
};

export default TestAddProperty;
