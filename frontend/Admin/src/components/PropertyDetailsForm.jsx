import React from "react";
import Input from "./Input"; // your input component

const PropertyDetailsForm = ({
  isSubProperty,
  pName,
  setPName,
  price,
  handleInputChange,
  startPrice,
  setStartPrice,
  endPrice,
  setEndPrice,
  address,
  setAddress,
  desc,
  setDesc,
  mapLink,
  setMapLink,
  landMark,
  setLandMark,
  type,
  setTypes,
  yearBuilt,
  setYearBuilt,
  foundation,
  setFoundation,
  keyInfo,
  updateArrayItem,
  removeArrayItem,
  addArrayItem,
  bathroomsArr,
  appliancesArr,
  interiorArr,
  otherRoomsArr,
  utilitiesArr,
  landInfoArr,
}) => {
  return (
    <div className="w-full p-[20px] flex flex-col">
      <div className="w-full flex flex-row items-start justify-between">
        <div className="w-[76%]">
          <div className="flex flex-col w-full mb-[15px]">
            <h2 className="font-light text-black text-[13px] my-[8px]">
              {isSubProperty ? "Sub-Property name" : "Property name"}
            </h2>
            <Input
              type="default"
              placeholder="Haven Apartment"
              className="w-full bg-main-grey"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col w-[40%] mb-[15px]">
              <h2 className="font-light text-black text-[13px] my-[8px]">Price</h2>
              <Input
                type="default"
                placeholder="Congo Valley"
                className="w-full bg-main-grey"
                value={price ? Number(price).toLocaleString() : ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col w-[40%] mb-[15px]">
              <h2 className="font-light text-black text-[13px] my-[8px]">Price Range Start</h2>
              <Input
                type="default"
                placeholder="Congo Valley"
                className="w-full bg-main-grey"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
              />
              <h2 className="font-light text-black text-[9px] my-[8px]">Least sub-property amount</h2>
            </div>

            <div className="flex flex-col w-[40%] mb-[15px]">
              <h2 className="font-light text-black text-[13px] my-[8px]">Price Range End</h2>
              <Input
                type="default"
                placeholder="Congo Valley"
                className="w-full bg-main-grey"
                value={endPrice}
                onChange={(e) => setEndPrice(e.target.value)}
              />
              <h2 className="font-light text-black text-[9px] my-[8px]">Highest sub-property amount</h2>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col w-full mb-[15px]">
            <h2 className="font-light text-black text-[13px] my-[8px]">Address</h2>
            <Input
              type="default"
              placeholder="Congo Valley"
              className="w-full bg-main-grey"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Property description */}
          <div className="flex flex-col w-full mb-[15px]">
            <h2 className="font-light text-black text-[13px] my-[8px]">Property description</h2>
            <Input
              type="default"
              placeholder="Congo Valley"
              className="w-full bg-main-grey"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Map and landmark */}
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col w-[48%] mb-[15px]">
              <h2 className="font-light text-black text-[13px] my-[8px]">Map Link</h2>
              <Input
                type="default"
                placeholder="https://maps.google.com/..."
                className="w-full bg-main-grey"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-[48%] mb-[15px]">
              <h2 className="font-light text-black text-[13px] my-[8px]">Landmark</h2>
              <Input
                type="default"
                placeholder="Close to Lekki Conservation Centre"
                className="w-full bg-main-grey"
                value={landMark}
                onChange={(e) => setLandMark(e.target.value)}
              />
            </div>
          </div>

          {/* Types and Year Built */}
          <div className="flex flex-col w-full mb-[15px]">
            <h2 className="font-light text-black text-[13px] my-[8px]">Types</h2>
            <Input
              type="default"
              placeholder="Industrial / Rent / ..."
              className="w-full bg-main-grey"
              value={type}
              onChange={(e) => setTypes(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full mb-[15px]">
            <h2 className="font-light text-black text-[13px] my-[8px]">Year Built</h2>
            <Input
              type="default"
              placeholder="2023"
              className="w-full bg-main-grey"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
            />
          </div>

          {/* Sub-property extra fields */}
          {isSubProperty && (
            <>
              <div className="flex flex-col w-full mb-[15px]">
                <h2 className="font-light text-black text-[13px] my-[8px]">Foundation</h2>
                <Input
                  type="default"
                  placeholder="Concrete Slab"
                  className="w-full bg-main-grey"
                  value={foundation}
                  onChange={(e) => setFoundation(e.target.value)}
                />
              </div>

              <h2 className="font-bold text-black text-[17px] my-[8px]">
                Additional Details (Sub-property)
              </h2>

              {/* Key Info */}
              <div className="w-full mb-[12px]">
                <h3 className="font-semibold text-[13px] mb-[8px]">Key Info</h3>
                {keyInfo.map((k, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      type="default"
                      placeholder="Label"
                      className="w-1/2 bg-main-grey"
                      value={k.label}
                      onChange={(e) => updateArrayItem("keyInfo", i, "label", e.target.value)}
                    />
                    <Input
                      type="default"
                      placeholder="Value"
                      className="w-1/2 bg-main-grey"
                      value={k.value}
                      onChange={(e) => updateArrayItem("keyInfo", i, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => removeArrayItem("keyInfo", i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => addArrayItem("keyInfo")}
                >
                  + Add Key Info
                </button>
              </div>

              {/* Bathrooms */}
              <div className="w-full mb-[12px]">
                <h3 className="font-semibold text-[13px] mb-[8px]">Bathrooms</h3>
                {bathroomsArr.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      type="default"
                      placeholder="Type (Full/Half)"
                      className="w-1/2 bg-main-grey"
                      value={b.type}
                      onChange={(e) => updateArrayItem("bathrooms", i, "type", e.target.value)}
                    />
                    <Input
                      type="default"
                      placeholder="Count"
                      className="w-1/2 bg-main-grey"
                      value={b.count}
                      onChange={(e) => updateArrayItem("bathrooms", i, "count", e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => removeArrayItem("bathrooms", i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => addArrayItem("bathrooms")}
                >
                  + Add Bathroom
                </button>
              </div>

              {/* Simple arrays: appliances, interior, otherRooms, utilities */}
              {[
                { field: "appliances", arr: appliancesArr, label: "Appliances" },
                { field: "interior", arr: interiorArr, label: "Interior" },
                { field: "otherRooms", arr: otherRoomsArr, label: "Other Rooms" },
                { field: "utilities", arr: utilitiesArr, label: "Utilities" },
              ].map(({ field, arr, label }) => (
                <div key={field} className="w-full mb-[12px]">
                  <h3 className="font-semibold text-[13px] mb-[8px]">{label}</h3>
                  {arr.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        type="default"
                        placeholder={`${label} item`}
                        className="w-full bg-main-grey"
                        value={item}
                        onChange={(e) => updateArrayItem(field, i, null, e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => removeArrayItem(field, i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => addArrayItem(field)}
                  >
                    + Add {label}
                  </button>
                </div>
              ))}

              {/* Land Info */}
              <div className="w-full mb-[12px]">
                <h3 className="font-semibold text-[13px] mb-[8px]">Land Info</h3>
                {landInfoArr.map((l, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      type="default"
                      placeholder="Label"
                      className="w-1/2 bg-main-grey"
                      value={l.label}
                      onChange={(e) => updateArrayItem("landInfo", i, "label", e.target.value)}
                    />
                    <Input
                      type="default"
                      placeholder="Value"
                      className="w-1/2 bg-main-grey"
                      value={l.value}
                      onChange={(e) => updateArrayItem("landInfo", i, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => removeArrayItem("landInfo", i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => addArrayItem("landInfo")}
                >
                  + Add Land Info
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
