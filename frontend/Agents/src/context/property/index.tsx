import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

// Define the shape of your context state
interface PropertyContextType {
  hotProperties: any[]; // Replace `any` with your actual property type if you have it
  setHotProperties: Dispatch<SetStateAction<any[]>>;
  subProperty: any[];
  setSubProperty: Dispatch<SetStateAction<any[]>>;
  fullProperties: any[];
  setFullProperties: Dispatch<SetStateAction<any[]>>;
  tempProp: any | null;
  setTempProp: Dispatch<SetStateAction<any | null>>;
}

// Context as a tuple matching the provider value array
type PropertyContextTuple = [
  any[], Dispatch<SetStateAction<any[]>>,
  any[], Dispatch<SetStateAction<any[]>>,
  any[], Dispatch<SetStateAction<any[]>>,
  any | null, Dispatch<SetStateAction<any | null>>
];

// Create context with initial null, will check in consumer
export const PropertyContext = createContext<PropertyContextTuple | null>(null);

// Provider component
interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [hotProperties, setHotProperties] = useState<any[]>([]);
  const [subProperty, setSubProperty] = useState<any[]>([]);
  const [fullProperties, setFullProperties] = useState<any[]>([]);
  const [tempProp, setTempProp] = useState<any | null>(null);

  return (
    <PropertyContext.Provider
      value={[
        hotProperties, setHotProperties,
        subProperty, setSubProperty,
        fullProperties, setFullProperties,
        tempProp, setTempProp,
      ]}
    >
      {children}
    </PropertyContext.Provider>
  );
};
