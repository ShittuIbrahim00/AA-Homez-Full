import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "se65tizp-workapp"); // Your preset
  formData.append("cloud_name", "dh9uut55k"); // Your cloud name

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dh9uut55k/image/upload",
      formData
    );
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};