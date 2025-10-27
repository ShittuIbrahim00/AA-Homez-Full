import axios from "axios";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "se65tizp-workapp"); // Your preset
  formData.append("cloud_name", "dh9uut55k"); // Your cloud name

  try {
    console.log("Uploading file to Cloudinary:", file.name, file.size, file.type);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dh9uut55k/image/upload",
      formData
    );
    console.log("Cloudinary upload response:", res.data);
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};