const PropertyBasicInfo = ({ form = {}, setForm }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

      {/* Property Name */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Name</label>
        <input
          type="text"
          value={form.name || ""}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          placeholder="Enter property name"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Description</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          placeholder="Describe the property..."
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Type</label>
        <select
          value={form.type || ""}
          onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="">Select type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Land">Land</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Location</label>
        <input
          type="text"
          value={form.location || ""}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          placeholder="Enter property location"
        />
      </div>

      {/* Map Link */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Map Link</label>
        <input
          type="url"
          value={form.mapLink || ""}
          onChange={(e) => setForm((p) => ({ ...p, mapLink: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          placeholder="https://maps.google.com/..."
        />
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Landmark</label>
        <input
          type="text"
          value={form.landMark || ""}
          onChange={(e) => setForm((p) => ({ ...p, landMark: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          placeholder="Nearby landmark"
        />
      </div>
    </div>
  );
};

export default PropertyBasicInfo;