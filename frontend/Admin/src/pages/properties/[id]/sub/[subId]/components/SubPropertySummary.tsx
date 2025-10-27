import { FaBed, FaBath } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { formatPrice } from "@/utils/priceFormatter";

const SubPropertySummary = ({ subProperty }: { subProperty: any }) => {
  console.log("🔍 SubPropertySummary - subProperty:", subProperty);
  console.log("🔍 SubPropertySummary - subProperty listingStatus:", subProperty?.listingStatus);

  const totalBaths =
    Array.isArray(subProperty?.bathrooms)
      ? subProperty.bathrooms.reduce((sum: number, b: any) => sum + Number(b.count), 0)
      : typeof subProperty?.bathrooms === "number"
      ? subProperty.bathrooms
      : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Desktop/Tablet Layout - Horizontal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">
              {/* Fixed TypeScript error by providing a default value when subProperty.price is undefined */}
              {formatPrice(subProperty?.price || "0")}
            </div>
            {subProperty?.bedrooms && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <FaBed className="text-orange-600 w-5 h-5" />
                <span className="font-medium">
                  {typeof subProperty.bedrooms === "number"
                    ? `${subProperty.bedrooms} Bedroom${subProperty.bedrooms > 1 ? "s" : ""}`
                    : Array.isArray(subProperty.bedrooms)
                    ? subProperty.bedrooms.map((b: any) => `${b.count} ${b.type}`).join(", ")
                    : ""}
                </span>
              </div>
            )}
            {totalBaths > 0 && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <FaBath className="text-blue-600 w-5 h-5" />
                <span className="font-medium">{totalBaths} Bath{totalBaths > 1 ? "s" : ""}</span>
              </div>
            )}
            {subProperty?.yearBuilt && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <BiBuildingHouse className="text-blue-600 w-5 h-5" />
                <span className="font-medium">Year Built: {subProperty.yearBuilt}</span>
              </div>
            )}
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default SubPropertySummary;