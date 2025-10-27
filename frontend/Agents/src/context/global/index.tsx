"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define a type for your context
interface GlobalContextType {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tab: boolean;
  setTab: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Create the context with the type (or undefined initially)
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// 3. Hook to access the context safely
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// 4. Provider component with typed props
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<boolean>(false);

  return (
    <GlobalContext.Provider value={{ data, setData, loading, setLoading, tab, setTab }}>
      {children}
    </GlobalContext.Provider>
  );
};
