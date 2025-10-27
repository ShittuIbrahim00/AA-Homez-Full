import axios from "axios";

const PropertyImages = ({ form = {}, setForm }) => {
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [...(form.images || [])];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "se65tizp-workapp");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dh9uut55k/image/upload",
        formData
      );

      uploadedUrls.push(res.data.secure_url);
    }

    setForm((p) => ({ ...p, images: uploadedUrls }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Images</h2>

      <input
        type="file"
        multiple
        onChange={handleImageUpload}
        className="block w-full border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(form.images || []).map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Property"
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;