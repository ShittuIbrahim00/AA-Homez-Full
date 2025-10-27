import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import type { Referral } from "@/types/user";
import { FaMedal, FaCalendarAlt } from "react-icons/fa";
import Spinner from "@/pages/notifications/Spinner";

interface ReferralCardProps {
  item: Referral;
  onClick: () => void;
  loading?: boolean;
}

// Medal icon mapping
const medalIcons: Record<string, StaticImageData> = {
  Bronze: require("../../../public/icons/Bronze.png"),
  Silver: require("../../../public/icons/Silver.png"),
  Diamond: require("../../../public/icons/Diamond.png"),
  Gold: require("../../../public/icons/Gold.png"),
  Platinum: require("../../../public/icons/Platinum.png"),
};

const ReferralCard: React.FC<ReferralCardProps> = ({ item, onClick, loading }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const date = item?.createdAt?.split("T")?.[0] ?? "N/A";

  const getInitials = (name = ""): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() ?? "?";
  };

  const initials = getInitials(item.fullName);
  const rank = item.rank ?? "Unranked";
  const iconSrc = medalIcons[rank] || medalIcons["Silver"];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 w-full flex items-center justify-center h-24">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 p-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-gray-300 max-w-full min-w-0"
      // onClick={onClick}
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 flex-shrink-0 min-w-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0">
          {item.imgUrl ? (
            <>
              {imageLoading && (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center">
                  <Spinner className="h-4 w-4" />
                </div>
              )}
              <Image
                src={item.imgUrl}
                alt={item.fullName || "Agent"}
                fill
                sizes="48px"
                className={`rounded-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
                onLoadingComplete={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
              {imageError && (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm sm:text-base">
                  {initials}
                </div>
              )}
            </>
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm sm:text-base">
              {initials}
            </div>
          )}
        </div>

        {/* Name & Rank */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-xs">
            {item.fullName || "Unnamed"}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1 min-w-0">
            <span className="flex items-center gap-1 truncate">
              <FaMedal className="text-xs flex-shrink-0" />
              <span className="truncate">{rank}</span>
            </span>
            {rank && (
              <Image
                src={iconSrc}
                alt={`${rank} Medal`}
                width={16}
                height={16}
                className="inline-block flex-shrink-0"
              />
            )}
          </div>
        </div>
      </div>

      {/* Join Date */}
      <div className="text-xs sm:text-sm text-gray-500 text-right whitespace-nowrap flex items-center justify-end gap-1 flex-shrink-0 min-w-0">
        <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
        <div className="truncate min-w-0">
          Joined <br />
          {date}
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;