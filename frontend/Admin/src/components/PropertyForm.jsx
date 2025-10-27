import React from "react";
import { useForm } from "react-hook-form";

const propertyTypes = ["Rent", "Industrial", "Residential", "Commercial"];
const listingStatusOptions = ["available", "sold", "pending"];

export default function PropertyForm({ initialValues = {}, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      location: initialValues.location || "",
      price: initialValues.price || "",
      priceStart: initialValues.priceStart || "",
      priceEnd: initialValues.priceEnd || "",
      yearBuilt: initialValues.yearBuilt || "",
      type: initialValues.type || "",
      listingStatus: initialValues.listingStatus || "",
      mapLink: initialValues.mapLink || "",
      landMark: initialValues.landMark || "",
    },
  });

  return (
  <form onSubmit={handleSubmit(_saveProperty)}>
  <div className={"w-full p-[20px] flex flex-col"}>
    <div className={"w-full flex flex-row items-start justify-between"}>
      <div className={"w-[76%]"}>
        {/* Property Name */}
        <div className={"flex flex-col w-full mb-[15px]"}>
          <h2 className={"font-light text-black text-[13px] my-[8px]"}>
            {isSubProperty ? "Sub-Property name" : "Property name"}
          </h2>
          <Input
            type="default"
            placeholder="Haven Apartment"
            className="w-full bg-main-grey"
            {...register("name", { required: "Property name is required" })}
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
          )}
        </div>

        {/* Price */}
        <div className={"flex flex-row w-full items-center justify-between"}>
          <div className={"flex flex-col w-[40%] mb-[15px]"}>
            <h2 className={"font-light text-black text-[13px] my-[8px]"}>Price</h2>
            <Controller
              control={control}
              name="price"
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <Input
                  type="default"
                  placeholder="250000000"
                  className="w-full bg-main-grey"
                  value={
                    field.value ? Number(field.value).toLocaleString() : ""
                  }
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/,/g, ""))
                  }
                />
              )}
            />
            {errors.price && (
              <span className="text-red-500 text-xs mt-1">{errors.price.message}</span>
            )}
          </div>
        </div>

        {/* Start and End Price */}
        <div className={"flex flex-row w-full items-center justify-between"}>
          <div className={"flex flex-col w-[40%] mb-[15px]"}>
            <h2 className={"font-light text-black text-[13px] my-[8px]"}>
              Price Range Start
            </h2>
            <Input
              type="default"
              placeholder="200000000"
              className="w-full bg-main-grey"
              {...register("priceStart")}
            />
            <h2 className="font-light text-black text-[9px] my-[8px]">
              Least sub-property amount
            </h2>
          </div>

          <div className={"flex flex-col w-[40%] mb-[15px]"}>
            <h2 className={"font-light text-black text-[13px] my-[8px]"}>
              Price Range End
            </h2>
            <Input
              type="default"
              placeholder="280000000"
              className="w-full bg-main-grey"
              {...register("priceEnd")}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <Button
      text="Submit Property"
      type="submit"
      className="mt-5"
    />
  </div>
</form>

  );
}
