import { createContext, useState, useEffect, useContext } from "react";
import { getAllSchedules } from "@/hooks/schedule.hooks";

// Define the context type
interface SchedulerContextType {
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

// @ts-ignore
export const SchedulerContext = createContext<SchedulerContextType>({
  pendingCount: 0,
  refreshPendingCount: async () => {},
});

export const SchedulerProvider = (props: { children: React.ReactNode }) => {
  const [pendingCount, setPendingCount] = useState<number>(0);

  const refreshPendingCount = async () => {
    try {
      // Check if we have a token before making the request
      const token = localStorage.getItem("business-token") ||
                    localStorage.getItem("authToken") ||
                    localStorage.getItem("guard-token");
      
      // Only fetch if we have a token
      if (token) {
        const allSchedules = await getAllSchedules();
        const pendingSchedules = allSchedules.filter(
          (schedule: any) => schedule.status?.toLowerCase() === "pending"
        );
        setPendingCount(pendingSchedules.length);
      }
    } catch (error) {
      // Only log error if it's not the expected "Auth token missing" error
      if (error instanceof Error && !error.message.includes("Auth token missing")) {
        console.error("Error refreshing pending count:", error);
      }
      setPendingCount(0);
    }
  };

  // Refresh pending count on mount and set up interval
  useEffect(() => {
    refreshPendingCount();
    
    const interval = setInterval(() => {
      refreshPendingCount();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SchedulerContext.Provider
      value={{
        pendingCount,
        refreshPendingCount,
      }}
    >
      {props.children}
    </SchedulerContext.Provider>
  );
};

// Custom hook to use the scheduler context
export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used within a SchedulerProvider");
  }
  return context;
};