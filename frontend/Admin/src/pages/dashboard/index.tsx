"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../notifications/Modal";
import { DashboardStats, PropertyCounts, ChartData } from "@/types/dashboard";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { getAllProperties } from "@/hooks/property.hooks";
import { getAllSchedules } from "@/hooks/schedule.hooks";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import Loader from "@/layouts/Loader";
import { useAgents } from "@/hooks/agent.hooks";
import { useTransactionStats } from "@/hooks/transaction.hooks";
import { useScheduler } from "@/context/scheduler";
import SalesChart from "./components/SalesChart";
import PropertyStatusChart from "./components/PropertyStatusChart";
import SubPropertyChart from "./components/SubPropertyChart";
import LoadingSpinner from "@/components/Custom/LoadingSpinner";
import { formatPrice as formatPriceUtil } from "@/utils/priceFormatter";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface Stats {
  totalProperties: number;
  agents: number;
  pendingInspections: number;
  transactions: number;
}

interface Activity {
  message: string;
  time: string;
}

function StatCard({ label, value, onClick }: { label: string; value: string | number; onClick?: () => void }) {
  return (
    <div
      tabIndex={0}
      className={`bg-white shadow p-4 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      aria-label={`${label}: ${value}`}
      onClick={onClick}
      role={onClick ? "button" : "region"}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  );
}

function formatPrice(price: string | number): string {
  // Convert to number if it's a string
  const num = typeof price === "string" ? parseFloat(price) : price;
  
  // Handle NaN or invalid values
  if (isNaN(num) || num === 0) return "₦0";
  
  // Ensure we're working with an integer value
  const intValue = Math.round(num);
  
  // Format with commas and Naira sign
  return `₦${intValue.toLocaleString()}`;
}

export default function Dashboard() {
  const router = useRouter();
  const { pendingCount: schedulerPendingCount, refreshPendingCount } = useScheduler();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    agents: 0,
    pendingInspections: schedulerPendingCount,
    transactions: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(""); // "" = all months
  const [selectedYear, setSelectedYear] = useState<number | "">(""); // "" = all years
  const [filteredSales, setFilteredSales] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProps, setAllProps] = useState<any[]>([]);

  const [propertyCounts, setPropertyCounts] = useState<PropertyCounts>({
    available: 0,
    sold: 0,
    pending: 0,
  });

  const [salesData, setSalesData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [propertyTypeData, setPropertyTypeData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [subPropertyTypeData, setSubPropertyTypeData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [statusLineData, setStatusLineData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const { agents, loading: agentsLoading, error: agentsError } = useAgents();
  const { transactionStats, loading: transactionLoading, error: transactionError } = useTransactionStats(); // Add this line
  const { notifications } = useAdminNotifications(1); 

  // Update stats when transaction stats are loaded
  useEffect(() => {
    if (!transactionLoading && !transactionError && transactionStats) {
      // console.log("Updating stats with transaction data:", transactionStats);
      setStats(prev => ({
        ...prev,
        transactions: transactionStats.totalSales
      }));
    }
  }, [transactionStats, transactionLoading, transactionError]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: any = await getAllProperties();
        const allPropsData: any[] = res || [];

        setAllProps(allPropsData);

        const totalAgents = agents?.length || 0;

        // Count properties by listing status
        const available = allPropsData.filter(
          (p: any) => p.listingStatus === "available"
        ).length;
        const soldProps = allPropsData.filter(
          (p: any) => p.listingStatus === "sold"
        );
        const pending = allPropsData.filter(
          (p: any) => p.listingStatus === "pending"
        ).length;

        // Property Type counts and sub-property counting
        const typeCounts: Record<string, number> = {};
        let totalSubProperties = 0;
        
        allPropsData.forEach((p: any) => {
          // Count main properties by type
          typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
          
          // Count sub-properties by type
          if (p.SubProperties && Array.isArray(p.SubProperties)) {
            totalSubProperties += p.SubProperties.length;
            p.SubProperties.forEach((sub: any) => {
              // Use a prefix to distinguish sub-property types
              const subType = sub.type ? `Sub-${sub.type}` : 'Sub-Unknown';
              typeCounts[subType] = (typeCounts[subType] || 0) + 1;
            });
          }
        });

        setStats(prev => ({
          ...prev,
          totalProperties: allPropsData.length + totalSubProperties,
          agents: totalAgents,
          pendingInspections: schedulerPendingCount, // Use the context value
        }));

        setPropertyCounts({ available, sold: soldProps.length, pending });

        // Build Sales & Revenue chart data by month/year
        const monthlyData: Record<string, number> = {};
        allPropsData.forEach((p: any) => {
          if (!p.createdAt) return;

          const date = new Date(p.createdAt);
          const key = `${date.toLocaleString("default", {
            month: "short",
          })} ${date.getFullYear()}`;

          let price = 0;
          if (p.price) {
            const numeric = p.price.replace(/[^\d.]/g, "");
            price =
              parseFloat(numeric) *
              (p.price.toUpperCase().includes("M") ? 1_000_000 : 1);
          }

          monthlyData[key] = (monthlyData[key] || 0) + price;
        });

        const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
          const [ma, ya] = a.split(" ");
          const [mb, yb] = b.split(" ");
          return (
            new Date(`${ma} 1, ${ya}`).getTime() -
            new Date(`${mb} 1, ${yb}`).getTime()
          );
        });

        setSalesData({
          labels: sortedMonths,
          datasets: [
            {
              label: "Sales & Revenue (₦)",
              data: sortedMonths.map((m) => monthlyData[m]),
              borderColor: "#16a34a",
              backgroundColor: "rgba(22,163,74,0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update total properties stat to include sub-properties
        setStats(prev => ({
          ...prev,
          totalProperties: allPropsData.length + totalSubProperties
        }));

        setPropertyTypeData({
          labels: Object.keys(typeCounts),
          datasets: [
            {
              data: Object.values(typeCounts),
              backgroundColor: ["#3b82f6", "#f97316", "#22c55e", "#eab308", "#8b5cf6", "#ec4899"],
            },
          ],
        });

        // Sub-Property Type counts (separate chart)
        const subPropertyTypeCounts: Record<string, number> = {};
        
        allPropsData.forEach((p: any) => {
          if (p.SubProperties && Array.isArray(p.SubProperties)) {
            p.SubProperties.forEach((sub: any) => {
              subPropertyTypeCounts[sub.type || 'Unknown'] = (subPropertyTypeCounts[sub.type || 'Unknown'] || 0) + 1;
            });
          }
        });

        setSubPropertyTypeData({
          labels: Object.keys(subPropertyTypeCounts),
          datasets: [
            {
              data: Object.values(subPropertyTypeCounts),
              backgroundColor: ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"],
            },
          ],
        });

        // Listing Status trends over time (monthly)
        const statusTrends: Record<
          string,
          { available: number; sold: number; pending: number }
        > = {};

        allPropsData.forEach((p: any) => {
          if (!p.createdAt) return;
          const date = new Date(p.createdAt);
          const key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

          if (!statusTrends[key]) {
            statusTrends[key] = { available: 0, sold: 0, pending: 0 };
          }

          const status = p.listingStatus.toLowerCase();
          if (["available", "sold", "pending"].includes(status)) {
            statusTrends[key][status] = (statusTrends[key][status] || 0) + 1;
          }
        });

        const sortedStatusKeys = Object.keys(statusTrends).sort();

        setStatusLineData({
          labels: sortedStatusKeys,
          datasets: [
            {
              label: "Available",
              data: sortedStatusKeys.map((k) => statusTrends[k].available),
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.2)",
              tension: 0.4,
            },
            {
              label: "Sold",
              data: sortedStatusKeys.map((k) => statusTrends[k].sold),
              borderColor: "#eab308",
              backgroundColor: "rgba(234,179,8,0.2)",
              tension: 0.4,
            },
            {
              label: "Pending",
              data: sortedStatusKeys.map((k) => statusTrends[k].pending),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  },  [agents, schedulerPendingCount]);

  // Update stats when scheduler pending count changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      pendingInspections: schedulerPendingCount
    }));
  }, [schedulerPendingCount]);

  // Add a function to manually refresh pending inspections
  const refreshPendingInspections = async () => {
    try {
      const allSchedules = await getAllSchedules();
      console.log("Dashboard refresh - All schedules fetched:", allSchedules);
      
      const pendingInspections = allSchedules.filter(
        (schedule: any) => schedule.status?.toLowerCase() === "pending"
      );
      
      // console.log("Dashboard refresh - Pending inspections count:", pendingInspections.length);
      setPendingCount(pendingInspections.length);
      // Update the stats with the actual pending count
      setStats(prev => ({
        ...prev,
        pendingInspections: pendingInspections.length
      }));
    } catch (error) {
      console.error("Error refreshing pending inspections:", error);
    }
  };

  useEffect(() => {
    const fetchPendingInspections = async () => {
      try {
        const allSchedules = await getAllSchedules();
        const pendingInspections = allSchedules.filter(
          (schedule: any) => schedule.status?.toLowerCase() === "pending"
        );
        setPendingCount(pendingInspections.length);
        // Update the stats with the actual pending count
        setStats(prev => ({
          ...prev,
          pendingInspections: pendingInspections.length
        }));
      } catch (error) {
        console.error("Error fetching pending inspections:", error);
        // Even in case of error, ensure we're not showing stale data
        setStats(prev => ({
          ...prev,
          pendingInspections: 0
        }));
      }
    };

    fetchPendingInspections();
    
    // Refresh every 30 seconds to ensure counts stay up to date
    const interval = setInterval(() => {
      fetchPendingInspections();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  
  // Also refresh when the dashboard component is focused
  useEffect(() => {
    const handleFocus = () => {
      const fetchPendingInspections = async () => {
        try {
          const allSchedules = await getAllSchedules();
          const pendingInspections = allSchedules.filter(
            (schedule: any) => schedule.status?.toLowerCase() === "pending"
          );
          setStats(prev => ({
            ...prev,
            pendingInspections: pendingInspections.length
          }));
        } catch (error) {
          console.error("Error fetching pending inspections:", error);
        }
      };

      fetchPendingInspections();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Filter sales by selected month/year
  useEffect(() => {
    if (!Array.isArray(allProps) || allProps.length === 0) return;

    const monthlyData: Record<string, number> = {};
    const filtered = allProps.filter((p: any) => {
      if (!p.createdAt) return false;
      const date = new Date(p.createdAt);
      const matchesMonth =
        selectedMonth === "" ||
        date.toLocaleString("default", { month: "long" }) === selectedMonth;
      const matchesYear = selectedYear === "" || date.getFullYear() === selectedYear;
      return matchesMonth && matchesYear;
    });

    const total = filtered.reduce((sum: number, p: any) => {
      if (!p.price) return sum;
      const numeric = p.price.replace(/[^\d.]/g, "");
      const price = parseFloat(numeric) * (p.price.includes("M") ? 1_000_000 : 1);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    setFilteredSales(total);

    filtered.forEach((p: any) => {
      const date = new Date(p.createdAt);
      const key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      let price = 0;
      if (p.price) {
        const numeric = p.price.replace(/[^\d.]/g, "");
        price = parseFloat(numeric) * (p.price.toUpperCase().includes("M") ? 1_000_000 : 1);
      }
      monthlyData[key] = (monthlyData[key] || 0) + price;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [ma, ya] = a.split(" ");
      const [mb, yb] = b.split(" ");
      return new Date(`${ma} 1, ${ya}`).getTime() - new Date(`${mb} 1, ${yb}`).getTime();
    });

    setSalesData({
      labels: sortedMonths,
      datasets: [
        {
          label: "Sales & Revenue (₦)",
          data: sortedMonths.map((m) => monthlyData[m]),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22,163,74,0.2)",
          tension: 0.4,
        },
      ],
    });
  }, [selectedMonth, selectedYear, allProps]);

  //  refresh all dashboard data manually
  const refreshDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // Refresh pending count from context
      await refreshPendingCount();
      
     
      
      // Refresh properties data
      const res: any = await getAllProperties();
      const allPropsData: any[] = res || [];
      setAllProps(allPropsData);
      
      // Recalculate all stats
      const totalAgents = agents?.length || 0;
      
      const available = allPropsData.filter(
        (p: any) => p.listingStatus === "available"
      ).length;
      const soldProps = allPropsData.filter(
        (p: any) => p.listingStatus === "sold"
      );
      const pending = allPropsData.filter(
        (p: any) => p.listingStatus === "pending"
      ).length;
      
      // Calculate sub-properties
      let totalSubProperties = 0;
      allPropsData.forEach((p: any) => {
        if (p.SubProperties && Array.isArray(p.SubProperties)) {
          totalSubProperties += p.SubProperties.length;
        }
      });
      
      // Calculate transactions from transaction stats instead of sold properties
      const transactions = transactionStats?.totalSales || 0;
      
      setStats({
        totalProperties: allPropsData.length + totalSubProperties,
        agents: totalAgents,
        pendingInspections: schedulerPendingCount,
        transactions,
      });
      
      setPropertyCounts({ available, sold: soldProps.length, pending });
    } catch (err: any) {
      console.error("Error refreshing dashboard data:", err);
      setError("Failed to refresh dashboard data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const propertyStatus = {
    labels: ["Available", "Sold", "Pending"],
    datasets: [
      {
        data: [
          propertyCounts.available,
          propertyCounts.sold,
          propertyCounts.pending,
        ],
        backgroundColor: ["#22c55e", "#eab308", "#3b82f6"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fdfcf9]">
        <LoadingSpinner message="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fdfcf9]" role="alert">
        <div className="bg-white shadow p-6 rounded-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refreshDashboardData}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdfcf9]">
      <Head>
        <title>Admin Dashboard | AA Homes</title>
        <meta name="description" content="Admin dashboard for managing properties, agents, schedules, and transactions at AA Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
          <button
            onClick={refreshDashboardData}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            aria-label={isRefreshing ? "Refreshing dashboard data" : "Refresh dashboard data"}
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isRefreshing ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              )}
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard 
            label="Total Properties" 
            value={stats.totalProperties} 
            onClick={() => router.push('/properties')}
          />
          <StatCard 
            label="Agents" 
            value={stats.agents} 
            onClick={() => router.push('/agents')}
          />
          <StatCard 
            label="Pending Inspections" 
            value={stats.pendingInspections} 
            onClick={() => router.push('/schedule')}
          />
          <StatCard
            label="Transactions"
            value={formatPrice(stats.transactions)}
          
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SalesChart
            data={salesData}
            title="Sales & Revenue"
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            allProps={allProps}
            filteredSales={filteredSales}
          />
          
          <PropertyStatusChart
            data={propertyStatus}
            title="Property Status"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TopAgentsSection agents={agents} loading={agentsLoading} error={agentsError} />
          <HighPriorityNotifications />
        </div>
      </main>
    </div>
  );
}

// Top 5 Verified Agents Section Component
function TopAgentsSection({ agents, loading, error }: { agents: any[]; loading: boolean; error: string | null }) {
  const router = useRouter();
  
  // Filter for verified agents and sort by total properties sold (Property + SubProperties), then take top 5
  const topVerifiedAgents = agents
    .filter(agent => agent.ninVerified) // Only verified agents
    .map(agent => ({
      ...agent,
      totalPropertiesSold: (agent.Property?.length || 0) + (agent.SubProperties?.length || 0)
    }))
    .sort((a, b) => b.totalPropertiesSold - a.totalPropertiesSold) // Sort by total properties sold
    .slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Top Verified Agents</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Top Verified Agents</h3>
        </div>
        <div className="text-red-500 text-center py-4">
          Error loading agents: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Verified Agents</h3>
        <button 
          onClick={() => router.push('/agents')}
          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          See More
        </button>
      </div>
      {topVerifiedAgents.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No verified agents found
        </div>
      ) : (
        <div className="space-y-4">
          {topVerifiedAgents.map((agent, index) => (
            <div 
              key={agent.aid} 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => router.push(`/agents/${agent.aid}`)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{agent.fullName}</div>
                  <div className="text-sm text-gray-500">
                    {agent.totalPropertiesSold} properties sold
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add this new component for high-priority notifications
function HighPriorityNotifications() {
  const router = useRouter();
  const { notifications, loading, error, markAsRead } = useAdminNotifications(1); // Get first page and markAsRead function
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  
  // Filter for high priority notifications and take only the 5 most recent unread ones
  const highPriorityNotifications = notifications
    .filter(notification => !notification.isRead && notification.data?.priority === "high")
    .slice(0, 5);
  
  // Function to open notification modal
  const openNotification = (notification: any) => {
    setSelectedNotification(notification);
  };
  
  // Function to close notification modal and mark as read
  const closeNotification = async () => {
    if (selectedNotification) {
      // Mark as read when closing the modal
      await markAsRead(selectedNotification.sid);
    }
    setSelectedNotification(null);
  };
  
  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "commission":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-blue-100 text-blue-800";
      case "profile":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">High Priority Notifications</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">High Priority Notifications</h3>
        </div>
        <div className="text-red-500 text-center py-4">
          Error loading notifications: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow p-6 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">High Priority Notifications</h3>
        <button 
          onClick={() => router.push('/notifications')}
          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          View All
        </button>
      </div>
      {highPriorityNotifications.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No high priority notifications
        </div>
      ) : (
        <div className="space-y-4">
          {highPriorityNotifications.map((notification) => (
            <div 
              key={`${notification.sid}-${notification.createdAt}`} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openNotification(notification)}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Notification Details Modal */}
      <Modal isOpen={!!selectedNotification} onClose={closeNotification}>
        {selectedNotification && (
          <div className="max-h-[80vh] overflow-y-auto px-2 sm:px-4">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedNotification.data.type)}`}>
                  {selectedNotification.data.type}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {selectedNotification.data.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedNotification.data.priority)}`}>
                    Priority: {selectedNotification.data.priority}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 text-base leading-relaxed">{selectedNotification.body}</p>
            </div>

            {/* Details Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedNotification.data.for && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">For</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.for}</span>
                  </div>
                )}
                
                {selectedNotification.data.action && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Action</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.action}</span>
                  </div>
                )}
                
                {selectedNotification.data.propertyName && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.propertyName}</span>
                  </div>
                )}
                
                {selectedNotification.data.propertyId && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property ID</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.propertyId}</span>
                  </div>
                )}
                
                {selectedNotification.data.amount && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</span>
                    <span className="text-sm text-gray-800">${selectedNotification.data.amount.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedNotification.data.soldTo && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sold To</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.soldTo}</span>
                  </div>
                )}
                
                {selectedNotification.data.agentId && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent ID</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.agentId}</span>
                  </div>
                )}
                
                {selectedNotification.data.transactionId && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction ID</span>
                    <span className="text-sm text-gray-800">{selectedNotification.data.transactionId}</span>
                  </div>
                )}
                
                {selectedNotification.data.timestamp && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</span>
                    <span className="text-sm text-gray-800">{new Date(selectedNotification.data.timestamp).toLocaleString()}</span>
                  </div>
                )}
                
                {selectedNotification.data.error && (
                  <div className="col-span-full">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Error</span>
                    <span className="text-sm text-red-600 bg-red-50 p-2 rounded block">{selectedNotification.data.error}</span>
                  </div>
                )}
              </div>
              
              {/* Show only key-value pairs for unknown fields */}
              {Object.entries(selectedNotification.data).map(([key, value]) => {
                const knownKeys = [
                  "for",
                  "type",
                  "action",
                  "priority",
                  "timestamp",
                  "propertyId",
                  "propertyName",
                  "amount",
                  "soldTo",
                  "agentId",
                  "transactionId",
                  "error",
                ];

                if (knownKeys.includes(key)) return null;

                if (value !== null && typeof value === "object" && Object.keys(value).length === 0)
                  return null;

                return (
                  <div key={key} className="flex flex-col mt-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key}</span>
                    <span className="text-sm text-gray-800">{JSON.stringify(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
