import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

const getGuardToken = () => {
  const token = localStorage.getItem("business-token");
  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

// Hook to fetch transaction statistics
export const useTransactionStats = () => {
  const [transactionStats, setTransactionStats] = useState({
    propertySales: 0,
    subPropertySales: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionStats = async () => {
      try {
        setLoading(true);
        const token = getGuardToken();
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `${token}`,
          },
        });
        
        // Log the response for debugging
        // console.log("Transaction API Response:", res.data);
        
        const stats = {
          propertySales: res.data.data.propertySales || 0,
          subPropertySales: res.data.data.subPropertySales || 0,
          totalSales: res.data.data.totalSales || 0
        };
        
        // console.log("Processed transaction stats:", stats);
        
        setTransactionStats(stats);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching transaction stats:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStats();
  }, []);

  return { transactionStats, loading, error };
};