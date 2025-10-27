const PropertyPricing = ({ form = {}, setForm }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Pricing</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">Price</label>
        <input
          type="number"
          value={form.price || ""}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter property price"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Price Start</label>
        <input
          type="text"
          value={form.priceStart || ""}
          onChange={(e) => setForm((p) => ({ ...p, priceStart: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="₦250,000,000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Price End</label>
        <input
          type="text"
          value={form.priceEnd || ""}
          onChange={(e) => setForm((p) => ({ ...p, priceEnd: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="₦280,000,000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Year Built</label>
        <input
          type="text"
          value={form.yearBuilt || ""}
          onChange={(e) => setForm((p) => ({ ...p, yearBuilt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="2023"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Listing Status</label>
        <select
          value={form.listingStatus || ""}
          onChange={(e) => setForm((p) => ({ ...p, listingStatus: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyPricing;