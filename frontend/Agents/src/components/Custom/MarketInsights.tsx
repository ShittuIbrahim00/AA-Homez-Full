import React from "react";
import { FaChartLine, FaHome, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

interface MarketInsightsProps {
  location?: string;
  avgPrice?: string;
  priceTrend?: {
    value: number;
    direction: "up" | "down";
  };
  daysOnMarket?: number;
  propertiesListed?: number;
  avgPricePerSqft?: string;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({
  location = "Lagos",
  avgPrice = "₦12.5M",
  priceTrend = { value: 5.2, direction: "up" },
  daysOnMarket = 24,
  propertiesListed = 1248,
  avgPricePerSqft = "₦15,000/sqft"
}) => {
  // Calculate days on market if not provided and we have a createdAt date
  const calculateDaysOnMarket = (createdAt?: string) => {
    if (!createdAt) return daysOnMarket;
    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return daysOnMarket;
    }
  };

  const insights = [
    {
      title: "Average Property Price",
      value: avgPrice,
      change: priceTrend,
      icon: <FaChartLine className="text-blue-500" />,
      description: `Avg. price in ${location}`
    },
    {
      title: "Properties Listed",
      value: propertiesListed.toLocaleString(),
      change: { value: 12.8, direction: "up" },
      icon: <FaHome className="text-green-500" />,
      description: "Active listings"
    },
    {
      title: "Avg. Days on Market",
      value: `${calculateDaysOnMarket()} days`,
      change: { value: 3, direction: "down" },
      icon: <FaCalendarAlt className="text-purple-500" />,
      description: "Time to sell"
    },
    {
      title: "Price per sqft",
      value: avgPricePerSqft,
      change: { value: 2.1, direction: "up" },
      icon: <FaMapMarkerAlt className="text-orange-500" />,
      description: "Avg. price per sqft"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Market Insights for {location}
          </h2>
          <p className="text-gray-600 mt-1">Updated weekly based on market data</p>
        </div>
        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
          View Detailed Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-50">
                {insight.icon}
              </div>
              <div className={`flex items-center text-sm font-semibold ${
                insight.change.direction === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {insight.change.direction === "up" ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
                {insight.change.value}%
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{insight.title}</h3>
            <p className="text-2xl font-extrabold text-gray-900 mb-2">{insight.value}</p>
            <p className="text-sm text-gray-500">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Market Trend Chart */}
      <div className="mt-8 bg-white rounded-xl p-5 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Price Trends (Last 12 Months)</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium">1Y</button>
            <button className="px-3 py-1.5 text-sm bg-white text-gray-600 rounded-lg font-medium border border-gray-200 hover:bg-gray-50">6M</button>
            <button className="px-3 py-1.5 text-sm bg-white text-gray-600 rounded-lg font-medium border border-gray-200 hover:bg-gray-50">3M</button>
          </div>
        </div>
        
        {/* Simplified chart visualization */}
        <div className="h-64 flex items-end gap-2 md:gap-4">
          {[65, 70, 75, 80, 85, 90, 95, 100, 95, 90, 85, 90].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Average Price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;