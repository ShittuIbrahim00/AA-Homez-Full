export default function PropertyMapAndStatus({ formData, setFormData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <input
        type="text"
        placeholder="Map Link"
        value={formData.mapLink}
        onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Landmark"
        value={formData.landMark}
        onChange={(e) => setFormData({ ...formData, landMark: e.target.value })}
        className="border rounded p-2"
      />
      <select
        value={formData.listingStatus}
        onChange={(e) => setFormData({ ...formData, listingStatus: e.target.value })}
        className="border rounded p-2 md:col-span-2"
      >
        <option value="">Select Listing Status</option>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}