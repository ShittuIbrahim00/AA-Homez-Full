import React from "react";
import Image from "next/image";
import { useUser } from "@/context/user";
import { rankImage } from "@/utils/core";
import { FaTrophy, FaHome, FaUsers } from "react-icons/fa";

interface PortfolioCardProps {
  styles?: string;
  loading?: boolean;
}

// Optional: handles background and border color per rank
const getRankColor = (rank?: string): string => {
  switch (rank?.toLowerCase()) {
    case "gold":
      return "bg-yellow-50 border-yellow-300";
    case "platinum":
      return "bg-blue-50 border-blue-300";
    case "diamond":
      return "bg-purple-50 border-purple-300";
    case "silver":
      return "bg-gray-50 border-gray-300";
    case "bronze":
      return "bg-orange-50 border-orange-300";
    default:
      return "bg-white border-gray-200";
  }
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ styles = "", loading }) => {
  const [user] = useUser();

  const fullName = user?.agent?.fullName || "Unknown Agent";
  const rank = user?.agent?.rank || "Unranked";
  const referrals = user?.agent?.referral_count || 0;
  const totalSales = user?.commissions?.totals?.sales || 0;
  // Get properties and sub-properties sold counts
  const propertiesSold = user?.propertiesSold?.length || 0;
  const subPropertiesSold = user?.subPropertiesSold?.length || 0;
  const totalPropertiesSold = propertiesSold + subPropertiesSold;

  const rankColor = getRankColor(rank);

  if (loading) {
    return (
      <div className={`w-full rounded-2xl p-6 border bg-white shadow-sm ${styles}`}>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Agent Info */}
        <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg border animate-pulse">
          <div className="mr-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Sales */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border animate-pulse">
            <div className="bg-gray-200 p-2 rounded-full mb-2">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Referrals */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border animate-pulse">
            <div className="bg-gray-200 p-2 rounded-full mb-2">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-2xl p-6 border ${rankColor} shadow-sm transition-all hover:shadow-md ${styles} max-w-full min-w-0`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6 min-w-0">
        <h2 className="text-xl font-bold text-gray-800 truncate">Portfolio Summary</h2>
        <FaTrophy className="text-gray-400 text-xl flex-shrink-0" />
      </div>
      
      {/* Agent Info */}
      <div className="flex items-center mb-6 p-3 bg-white rounded-lg border min-w-0">
        <div className="mr-3 flex-shrink-0">
          <Image
            src={rankImage(rank)}
            alt={`${rank} Rank Icon`}
            width={32}
            height={32}
            className="inline-block"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{fullName}</h3>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-1 truncate">
            <span className="truncate">{rank} Rank</span>
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 min-w-0">
        {/* Total Sales */}
        <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow transition cursor-default border min-w-0 group">
          <div className="bg-blue-100 p-2 rounded-full mb-2 group-hover:bg-blue-200 transition-colors">
            <FaHome className="text-blue-600 text-lg" />
          </div>
          <h3 className="text-[14px] font-bold text-gray-900 flex items-center truncate">
           ₦{totalSales.toLocaleString()}
          </h3>
          <p className="text-[14px] text-gray-600 text-center font-medium truncate">
            Completed Sales
          </p>
          {totalPropertiesSold > 0 && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {propertiesSold} props, {subPropertiesSold} sub-props
            </p>
          )}
        </div>

        {/* Referrals */}
        <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow transition cursor-default border min-w-0 group">
          <div className="bg-purple-100 p-2 rounded-full mb-2 group-hover:bg-purple-200 transition-colors">
            <FaUsers className="text-purple-600 text-lg" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {referrals.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 text-center font-medium truncate">
            Referrals
          </p>
        </div>
      </div>
      
    
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Performance</span>
          <span className="font-semibold text-gray-800">Top 15% of agents</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" 
            style={{ width: '85%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;