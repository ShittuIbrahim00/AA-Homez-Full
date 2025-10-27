import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField, CircularProgress } from "@mui/material";

const ScheduleForm = ({
  formData,
  setFormData,
  formError,
  onSubmit,
  properties = [],
  loadingProperties = false,
  buttonLabel = "Book",
}) => {
  const handleSelectProperty = (id) => {
    setFormData({ ...formData, property: id });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Select a Property
        </h3>

        {loadingProperties ? (
          <div className="flex justify-center py-4">
            <CircularProgress />
          </div>
        ) : properties.length === 0 ? (
          <p className="text-sm text-gray-500">No properties available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {properties.map((property) => (
              <div
                key={property._id}
                onClick={() => handleSelectProperty(property._id)}
                className={`border rounded-md p-3 cursor-pointer transition hover:shadow-md ${
                  formData.property === property._id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-md">{property.name}</h4>
                <p className="text-sm text-gray-600">
                  {property.location || "No location"}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  ₦{property.price?.toLocaleString() || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <DateTimePicker
        label="Pick date & time"
        value={formData.date}
        onChange={(date) => setFormData({ ...formData, date })}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField
        label="Note (Optional)"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        fullWidth
      />

      {formError && (
        <div className="text-red-500 text-sm mt-1">{formError}</div>
      )}

      <button
        type="submit"
        className="bg-orange-500 p-2 rounded-md text-white hover:bg-orange-600 transition"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default ScheduleForm;
