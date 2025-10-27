import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

const AddSubPropertyForm = ({ isSubProperty, _saveProperty }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pName: "",
      price: "",
      startPrice: "",
      endPrice: "",
      address: "",
      desc: "",
      mapLink: "",
      landMark: "",
      type: "",
      yearBuilt: "",
      foundation: "",
      keyInfo: [{ label: "", value: "" }],
      bathrooms: [{ type: "", count: "" }],
      appliances: [""],
      interior: [""],
      otherRooms: [""],
      utilities: [""],
      landInfo: [{ label: "", value: "" }],
      bedrooms: 0,
      bathroomsCount: 0,
      kitchens: 0,
      garage: 0,
      tag: "",
      listingStatus: "available", 
    },
  });

  // Field arrays for dynamic fields
  const {
    fields: keyInfoFields,
    append: keyInfoAppend,
    remove: keyInfoRemove,
  } = useFieldArray({ control, name: "keyInfo" });

  const {
    fields: bathroomsFields,
    append: bathroomsAppend,
    remove: bathroomsRemove,
  } = useFieldArray({ control, name: "bathrooms" });

  const {
    fields: appliancesFields,
    append: appliancesAppend,
    remove: appliancesRemove,
  } = useFieldArray({ control, name: "appliances" });

  const {
    fields: interiorFields,
    append: interiorAppend,
    remove: interiorRemove,
  } = useFieldArray({ control, name: "interior" });

  const {
    fields: otherRoomsFields,
    append: otherRoomsAppend,
    remove: otherRoomsRemove,
  } = useFieldArray({ control, name: "otherRooms" });

  const {
    fields: utilitiesFields,
    append: utilitiesAppend,
    remove: utilitiesRemove,
  } = useFieldArray({ control, name: "utilities" });

  const {
    fields: landInfoFields,
    append: landInfoAppend,
    remove: landInfoRemove,
  } = useFieldArray({ control, name: "landInfo" });

  // onSubmit handler - calls your _saveProperty with form data
  const onSubmit = (data) => {
    // console.log("Submitting data:", data);
    _saveProperty(data); // connect your API here
  };

  return (
    <form className="w-full p-5 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {/* Property Name */}
      <div className="mb-4">
        <label className="block text-sm font-light mb-1">
          {isSubProperty ? "Sub-Property name" : "Property name"}
        </label>
        <input
          {...register("pName", { required: "Property name is required" })}
          placeholder="Haven Apartment"
          className={`w-full p-2 bg-main-grey border ${
            errors.pName ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.pName && (
          <p className="text-red-500 text-xs mt-1">{errors.pName.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-4 w-2/5">
        <label className="block text-sm font-light mb-1">Price</label>
        <input
          type="number"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          })}
          placeholder="0"
          className={`w-full p-2 bg-main-grey border ${
            errors.price ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Price Range Start & End */}
      <div className="flex gap-4 mb-4">
        <div className="w-2/5">
          <label className="block text-sm font-light mb-1">Price Range Start</label>
          <input
            type="number"
            {...register("startPrice", {
              min: { value: 0, message: "Must be positive" },
            })}
            placeholder="0"
            className={`w-full p-2 bg-main-grey border ${
              errors.startPrice ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          <p className="text-xs text-gray-600 mt-1">Least sub-property amount</p>
        </div>

        <div className="w-2/5">
          <label className="block text-sm font-light mb-1">Price Range End</label>
          <input
            type="number"
            {...register("endPrice", {
              min: { value: 0, message: "Must be positive" },
              validate: (value) =>
                value === "" ||
                value >= Number(watch("startPrice")) ||
                "End price must be >= start price",
            })}
            placeholder="0"
            className={`w-full p-2 bg-main-grey border ${
              errors.endPrice ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.endPrice && (
            <p className="text-red-500 text-xs mt-1">{errors.endPrice.message}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">Highest sub-property amount</p>
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-light mb-1">Address</label>
        <input
          {...register("address", { required: "Address is required" })}
          placeholder="Congo Valley"
          className={`w-full p-2 bg-main-grey border ${
            errors.address ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-light mb-1">Property description</label>
        <textarea
          {...register("desc")}
          placeholder="Description"
          className="w-full p-2 bg-main-grey border border-gray-300 rounded"
        />
      </div>

      {/* Map Link & Landmark */}
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-light mb-1">Map Link</label>
          <input
            {...register("mapLink")}
            placeholder="https://maps.google.com/..."
            className="w-full p-2 bg-main-grey border border-gray-300 rounded"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-light mb-1">Landmark</label>
          <input
            {...register("landMark")}
            placeholder="Close to Lekki Conservation Centre"
            className="w-full p-2 bg-main-grey border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Types & Year Built & Listing Status */}
      <div className="flex gap-4 mb-4">
        <div className="w-1/3">
          <label className="block text-sm font-light mb-1">Types</label>
          <input
            {...register("type")}
            placeholder="Industrial / Rent / ..."
            className="w-full p-2 bg-main-grey border border-gray-300 rounded"
          />
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-light mb-1">Year Built</label>
          <input
            type="number"
            {...register("yearBuilt", {
              min: { value: 1800, message: "Invalid year" },
              max: { value: new Date().getFullYear(), message: "Invalid year" },
            })}
            placeholder="2023"
            className={`w-full p-2 bg-main-grey border ${
              errors.yearBuilt ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.yearBuilt && (
            <p className="text-red-500 text-xs mt-1">{errors.yearBuilt.message}</p>
          )}
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-light mb-1">Listing Status</label>
          <select
            {...register("listingStatus")}
            className="w-full p-2 bg-main-grey border border-gray-300 rounded"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Sub-property fields */}
      {isSubProperty && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-light mb-1">Foundation</label>
            <input
              {...register("foundation")}
              placeholder="Concrete Slab"
              className="w-full p-2 bg-main-grey border border-gray-300 rounded"
            />
          </div>

          {/* Key Info */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Info</h3>
            {keyInfoFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  {...register(`keyInfo.${index}.label`, { required: true })}
                  placeholder="Label"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <input
                  {...register(`keyInfo.${index}.value`, { required: true })}
                  placeholder="Value"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => keyInfoRemove(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => keyInfoAppend({ label: "", value: "" })}
            >
              + Add Key Info
            </button>
          </div>

          {/* Bathrooms */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Bathrooms</h3>
            {bathroomsFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  {...register(`bathrooms.${index}.type`, { required: true })}
                  placeholder="Type (Full/Half)"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <input
                  {...register(`bathrooms.${index}.count`, {
                    required: true,
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Must be a number",
                    },
                  })}
                  placeholder="Count"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => bathroomsRemove(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => bathroomsAppend({ type: "", count: "" })}
            >
              + Add Bathroom
            </button>
          </div>

          {/* Simple arrays: appliances, interior, otherRooms, utilities */}
          {[
            { label: "Appliances", fields: appliancesFields, append: appliancesAppend, remove: appliancesRemove, name: "appliances" },
            { label: "Interior", fields: interiorFields, append: interiorAppend, remove: interiorRemove, name: "interior" },
            { label: "Other Rooms", fields: otherRoomsFields, append: otherRoomsAppend, remove: otherRoomsRemove, name: "otherRooms" },
            { label: "Utilities", fields: utilitiesFields, append: utilitiesAppend, remove: utilitiesRemove, name: "utilities" },
          ].map(({ label, fields, append, remove, name }) => (
            <div key={name} className="mb-6">
              <h3 className="font-semibold mb-2">{label}</h3>
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <input
                    {...register(`${name}.${index}`, { required: true })}
                    placeholder={label.slice(0, -1)}
                    className="w-full p-2 bg-main-grey border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => append("")}
              >
                + Add {label.slice(0, -1)}
              </button>
            </div>
          ))}

          {/* Land Info */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Land Info</h3>
            {landInfoFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  {...register(`landInfo.${index}.label`, { required: true })}
                  placeholder="Label"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <input
                  {...register(`landInfo.${index}.value`, { required: true })}
                  placeholder="Value"
                  className="w-1/2 p-2 bg-main-grey border border-gray-300 rounded"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => landInfoRemove(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => landInfoAppend({ label: "", value: "" })}
            >
              + Add Land Info
            </button>
          </div>

          {/* Bedrooms, Bathrooms Count, Kitchens, Garage, Tag */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-light mb-1">Bedrooms</label>
              <input
                type="number"
                {...register("bedrooms", {
                  min: 0,
                  max: 50,
                })}
                className="p-2 w-20 bg-main-grey border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-light mb-1">Bathrooms</label>
              <input
                type="number"
                {...register("bathroomsCount", {
                  min: 0,
                  max: 50,
                })}
                className="p-2 w-20 bg-main-grey border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-light mb-1">Kitchens</label>
              <input
                type="number"
                {...register("kitchens", {
                  min: 0,
                  max: 50,
                })}
                className="p-2 w-20 bg-main-grey border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-light mb-1">Garage</label>
              <input
                type="number"
                {...register("garage", {
                  min: 0,
                  max: 50,
                })}
                className="p-2 w-20 bg-main-grey border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-4 w-2/5">
            <label className="block text-sm font-light mb-1">Tag</label>
            <input
              {...register("tag")}
              placeholder="Tag"
              className="w-full p-2 bg-main-grey border border-gray-300 rounded"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Save Property
      </button>
    </form>
  );
};

export default AddSubPropertyForm;
