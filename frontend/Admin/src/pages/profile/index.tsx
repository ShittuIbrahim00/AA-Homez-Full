import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/Custom";
import { UserContext } from "@/context/user";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import DelConsentModal from "@/components/Custom/delete_consent_modal";
import { _updateUser } from "@/hooks/user.hooks";

const profileImg = require("../../../public/images/user.png");

function Profile() {
  // @ts-ignore
  const [user, setUser] = useContext(UserContext);

  const imgInputRef = useRef<HTMLInputElement | null>(null);

  // states
  const [fname, setFname] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /** 🔹 Cloudinary Image Upload */
  const handleImgChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setImgLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        setImgLoading(false);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        setImgLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dh9uut55k/image/upload`,
            {
              file: reader.result,
              upload_preset: "se65tizp-workapp",
            }
          );

          if (response?.data?.secure_url) {
            setImage(response.data.secure_url);
            await updateProfile({ imgUrl: response.data.secure_url });
          }
        } catch (err) {
          console.error("Image upload error:", err);
          toast.error("Image upload failed. Try again.");
        } finally {
          setImgLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Failed to process image.");
      setImgLoading(false);
    }
  };

  /** 🔹 Update Profile API + Sync LocalStorage + Context */
  const updateProfile = async (data: any) => {
    try {
      setLoading(true);
      const updatedUser = await _updateUser(data);

      if (updatedUser) {
        setUser(updatedUser);

        // update local states
        setFname(updatedUser?.fullName || "");
        setImage(updatedUser?.imgUrl || null);
        setRole(updatedUser?.role || "");
        setEmail(updatedUser?.email || "");
        setPhone(updatedUser?.phone || "");

        // 🔹 persist in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profile updated successfully ✅");
        return true;
      } else {
        toast.error("Failed to update profile.");
        return false;
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Delete Profile Picture */
  const deleteImage = async () => {
    try {
      setImgLoading(true);
      const success = await updateProfile({ imgUrl: "" });
      if (success) {
        setImage(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete profile picture.");
    } finally {
      setImgLoading(false);
      setShowDelete(false);
    }
  };

  /** 🔹 Save / Toggle Edit Mode */
  const toggleEdit = async () => {
    if (edit) {
      // Validate required fields
      if (!fname.trim()) {
        toast.error("Full name is required.");
        return;
      }
      
      if (!phone.trim()) {
        toast.error("Phone number is required.");
        return;
      }
      
      const success = await updateProfile({ fullName: fname, phone, role });
      if (!success) {
        return; // Don't toggle edit mode if update failed
      }
    }
    setEdit(!edit);
  };

  /** 🔹 Load User Data from localStorage first */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setFname(userData.fullName || "");
        setImage(userData.imgUrl || null);
        setRole(userData.role || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Failed to load profile data.");
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 text-black p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-black text-xl md:text-2xl font-bold">My Profile</h1>
      </div>

      {/* Body */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start items-center lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Profile Image */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            {imgLoading ? (
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center rounded-full bg-gray-200">
                <CircularProgress size={55} />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={image || profileImg}
                  alt="Profile"
                  width={220}
                  height={220}
                  className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}

            <div className="flex flex-col mt-6 w-full max-w-[220px]">
              <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-3 my-2 rounded-lg border border-orange-600 transition-colors"
                onClick={() => imgInputRef.current?.click()}
                disabled={imgLoading}
              >
                <p className="text-white text-sm font-semibold">
                  Change Picture
                </p>
              </button>

              <input
                type="file"
                accept="image/*"
                ref={imgInputRef}
                onChange={handleImgChange}
                style={{ display: "none" }}
                disabled={imgLoading}
              />

              {(image || user?.imgUrl) && (
                <button
                  className="bg-white hover:bg-gray-100 px-4 py-3 my-2 rounded-lg border border-gray-300 transition-colors"
                  onClick={() => setShowDelete(true)}
                  disabled={imgLoading}
                >
                  <p className="text-gray-700 text-sm font-semibold">
                    Delete Picture
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Info + Actions */}
          <div className="flex-1 w-full bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-2">Full name</label>
                <Input
                  type="default"
                  placeholder="John Doe"
                  className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors
                    ${edit 
                      ? "bg-white border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                      : "bg-gray-100 border-gray-200"}
                  `}
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  isDisabled={!edit}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-2">Role</label>
                <Input
                  type="default"
                  placeholder="Agent"
                  className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors
                    ${edit 
                      ? "bg-white border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                      : "bg-gray-100 border-gray-200"}
                  `}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  isDisabled={!edit}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-2">Email address</label>
                <Input
                  type="default"
                  placeholder="john.d@gmail.com"
                  className="w-full border rounded-lg px-4 py-3 text-sm bg-gray-100 border-gray-200"
                  value={email}
                  isDisabled
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 mb-2">Phone number</label>
                <Input
                  type="default"
                  placeholder="+234 708 345 1288"
                  className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors
                    ${edit 
                      ? "bg-white border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                      : "bg-gray-100 border-gray-200"}
                  `}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isDisabled={!edit}
                />
              </div>
            </div>

            {/* Save / Edit Button */}
            <div className="mt-8">
              <button
                className={`${
                  edit
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-white hover:bg-gray-50 text-orange-600"
                } w-full md:w-64 px-6 py-3 rounded-lg border transition-colors flex items-center justify-center`}
                onClick={toggleEdit}
                disabled={loading || imgLoading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <CircularProgress size={20} className="mr-2" />
                    <span className="text-sm font-semibold">Saving...</span>
                  </div>
                ) : edit ? (
                  <p className="text-sm font-semibold">Save Profile</p>
                ) : (
                  <p className="text-sm font-semibold">Edit Profile</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <DelConsentModal
          onClose={() => setShowDelete(false)}
          onSubmit={deleteImage}
          isOpen={showDelete}
          text="Are you sure you want to delete your profile picture?"
        />
      )}
    </div>
  );
}

export default Profile;