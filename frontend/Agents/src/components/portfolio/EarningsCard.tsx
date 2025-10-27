import React, { useContext } from "react";
import { UserContext } from "@/context/user";
import { FaChartLine, FaHome, FaUsers } from "react-icons/fa";

interface EarningsCardProps {
  styles?: string;
  gotoEarnings?: (value: string) => void;
  loading?: boolean;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ styles = "", gotoEarnings, loading }) => {
  // @ts-ignore
  const [user] = useContext(UserContext);

  // Safely access earnings from user.agent
  const total = parseFloat(user?.agent?.total_earnings || "0");
  const sales = parseFloat(user?.agent?.sales_earnings || "0");
  const referral = parseFloat(user?.agent?.referral_earnings || "0");
  // Get properties and sub-properties sold counts
  const propertiesSold = user?.propertiesSold?.length || 0;
  const subPropertiesSold = user?.subPropertiesSold?.length || 0;
  const totalPropertiesSold = propertiesSold + subPropertiesSold;

  if (loading) {
    return (
      <div className={`w-full rounded-2xl bg-gradient-to-r from-main-primary to-main-secondary p-6 text-white shadow-md ${styles}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-white/30 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 w-6 bg-white/30 rounded-full animate-pulse"></div>
        </div>
        
        <div className="mb-6">
          <div className="h-4 bg-white/30 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-8 bg-white/30 rounded w-1/2 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-white/30">
            <div className="bg-white/20 p-2 rounded-full mb-2">
              <div className="h-5 w-5 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            <div className="h-6 bg-white/30 rounded w-3/4 mb-1 animate-pulse"></div>
            <div className="h-4 bg-white/30 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-white/30">
            <div className="bg-white/20 p-2 rounded-full mb-2">
              <div className="h-5 w-5 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            <div className="h-6 bg-white/30 rounded w-3/4 mb-1 animate-pulse"></div>
            <div className="h-4 bg-white/30 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r from-main-primary to-main-secondary p-6 text-white shadow-md transition-all hover:shadow-lg ${styles} max-w-full min-w-0`}
    >
      <div className="flex items-center justify-between mb-6 min-w-0">
        <h2 className="text-xl font-bold truncate">Earnings Overview</h2>
        <FaChartLine className="text-white/80 text-xl flex-shrink-0" />
      </div>
      
      <div className="mb-6 min-w-0">
        <p className="text-sm font-light mb-1">Total Earnings</p>
        <h3 className="text-3xl font-bold truncate">₦{total.toLocaleString()}</h3>
        {totalPropertiesSold > 0 && (
          <p className="text-xs text-white/80 mt-1 flex flex-wrap gap-1">
            <span>From {totalPropertiesSold} properties sold</span>
            <span className="hidden sm:inline">•</span>
            <span className="sm:hidden">•</span>
            <span>{propertiesSold} properties, {subPropertiesSold} sub-properties</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
        <div
          onClick={() => gotoEarnings?.("sales-earn")}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/30 cursor-pointer transition-all border border-white/30 min-w-0 group"
        >
          <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:bg-white/30 transition-colors">
            <FaHome className="text-white text-lg" />
          </div>
          <h3 className="text-xl font-bold mb-1 truncate">₦{sales.toLocaleString()}</h3>
          <p className="text-sm font-light text-center truncate">Sales Earnings</p>
        </div>

        <div
          onClick={() => gotoEarnings?.("sales-referral")}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/30 cursor-pointer transition-all border border-white/30 min-w-0 group"
        >
          <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:bg-white/30 transition-colors">
            <FaUsers className="text-white text-lg" />
          </div>
          <h3 className="text-xl font-bold mb-1 truncate">₦{referral.toLocaleString()}</h3>
          <p className="text-sm font-light text-center truncate">Referral Earnings</p>
        </div>
      </div>
      
  
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80">Performance</span>
          <span className="font-semibold">Top 15% of agents</span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full" 
            style={{ width: '85%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCard;