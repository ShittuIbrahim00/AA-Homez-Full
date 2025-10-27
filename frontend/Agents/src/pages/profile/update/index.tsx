import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
import { UserProfile, UpdateUserProfile } from "@/utils/api";
import { UserContext } from "@/context/user";
import type { UserType } from "@/types/user";

// Icons & images
import profileImgFallback from "../../../../public/images/user.png";
import cameraIcon from "../../../../public/svg/photo_camera.svg";
import backArrow from "../../../../public/svg/arrow_back_black.svg";

const UpdateProfileForm = () => {
  const router = useRouter();
  const { toastSuccess, toastError } = useResponsiveToast();
  const [user, setUser] = useContext(UserContext) as [UserType, React.Dispatch<React.SetStateAction<UserType>>];

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    imgFile: null as File | null,
  });

  const [imgPreview, setImgPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await UserProfile();

      if (res?.status) {
        // Access agent data correctly
        const agent = res.data.agent;

        setFormData({
          phone: agent?.phone || "",
          address: agent?.address || "",
          bankName: agent?.bankName || "",
          accountNumber: agent?.accountNumber || "",
          accountName: agent?.accountName || "",
          imgFile: null,
        });

        setImgPreview(agent?.imgUrl || "");
        // Update user context with the full data
        setUser(res.data);
      } else {
        toastError(res?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to run only once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, imgFile: file }));

    if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById("fileUpload");
    fileInput?.click();
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Add debugging to see what data we're sending
    console.log("FormData being sent to API:", {
      phone: formData.phone,
      address: formData.address,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      imgFile: formData.imgFile,
    });

    const payload = {
      phone: formData.phone,
      address: formData.address,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      imgFile: formData.imgFile,
    };

    // @ts-ignore - UpdateUserProfile expects FormData-ready object
    const res = await UpdateUserProfile(payload);

    setLoading(false);

    // Add debugging to see what the response looks like
    console.log("UpdateUserProfile response:", res);

    if (res?.status) {
      toastSuccess("Profile updated successfully");
      // Update the user context with the new data
      // The response structure has user object directly, not in data.agent
      if (res.user) {
        console.log("Updating user context with:", res.user);
        setUser(prev => ({
          ...prev,
          agent: {
            ...((prev && prev.agent) || {}),
            ...res.user
          }
        }));
      } else {
        // If the response doesn't have the expected structure, fetch the profile again
        console.log("Response doesn't contain expected data structure, fetching profile again");
        const profileRes = await UserProfile();
        if (profileRes?.status) {
          console.log("Fetched profile data:", profileRes.data);
          setUser(profileRes.data);
        }
      }
      
      // Also update the image preview to show the new image immediately
      if (res.user?.imgUrl) {
        setImgPreview(res.user.imgUrl);
      }
    } else {
      toastError(res?.message || "Update failed");
    }
  };

  // Access agent data for display
  const agentData = user?.agent;

  return (
    <div className="w-full px-4   md:pt-28 flex flex-col items-center justify-center text-black">
      {/* Back Button */}
      <div className="w-full flex flex-row">
        <Image
          src={backArrow}
          alt="Back"
          className="w-[90px] h-[90px] p-[25px] cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      {/* Profile Picture */}
      <div className="relative flex flex-col items-center justify-center mt-10 mb-6">
        <Image
          src={imgPreview || agentData?.imgUrl || profileImgFallback}
          alt="Profile"
          className="w-[200px] h-[200px] rounded-full object-cover border-4 border-main-primary p-2"
          width={200}
          height={200}
        />
        <div
          className="w-[30px] h-[30px] bg-main-primary flex items-center justify-center rounded-full absolute bottom-5 right-5 cursor-pointer"
          onClick={handleImageClick}
        >
          <Image src={cameraIcon} alt="Camera" width={14} height={14} />
        </div>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-black mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            placeholder="08123456789"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1">Home Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            placeholder="Access Bank"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            placeholder="1234567890"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-black mb-1">Account Name</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            placeholder="John Doe"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full max-w-3xl flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-main-primary text-white py-3 px-6 rounded hover:bg-main-secondary transition-all duration-200"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfileForm;