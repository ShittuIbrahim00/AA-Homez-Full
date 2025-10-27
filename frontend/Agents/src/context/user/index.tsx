import React, { createContext, useContext, useState } from "react";
import type { UserType } from "@/types/user";

type UserContextType = [UserType, React.Dispatch<React.SetStateAction<UserType>>];

const initialUserState: UserType = {
  agent: null,
  propertiesSold: [],
  subPropertiesSold: [], // Add this line
  commissions: {
    history: [],
    totals: {
      sales: 0,
      referral: 0,
      overall: 0,
    },
  },
  referralNetwork: [],
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserType>(initialUserState);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};




// import React, { createContext, useState, useContext } from "react";
// import type { UserType, Referral, SoldProperty } from "@/types/user";

// // Define context type
// type UserContextType = [UserType, React.Dispatch<React.SetStateAction<UserType>>];

// // Initial state matching full UserType exactly
// const initialUserState: UserType = {
//   agent: null,

//   // Personal info
//   aid: null,
//   email: null,
//   fullName: null,
//   dob: null,
//   gender: null,
//   address: null,
//   phone: null,
//   imgUrl: null,
//   password: null,

//   // Financials
//   salesEarnings: 0,
//   referralEarnings: 0,
//   totalEarnings: 0,

//   // Banking
//   accountNumber: null,
//   accountName: null,
//   bankName: null,
//   bankCode: null,

//   // Misc
//   otp: null,
//   referralCode: null,
//   referredBy: null,
//   rank: null,
//   apiKey: null,
//   token: null,
//   pushToken: null,
//   verified: false,
//   status: 0,
//   ninVerified: false,

//   // Backend-provided collections (fixed property names)
//   referralNetwork: [] as Referral[],
//   propertiesSold: [] as SoldProperty[],

//   commissions: {
//     history: [],
//     totals: {
//       sales: 0,
//       referral: 0,
//       overall: 0,
//     },
//   },

//   referralLink: null,
//   verificationLink: null,
// };

// // Create context
// export const UserContext = createContext<UserContextType | null>(null);

// // Provider
// export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
//   const [user, setUser] = useState<UserType>(initialUserState);

//   return (
//     <UserContext.Provider value={[user, setUser]}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Hook
// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("useUser must be used within a UserProvider");
//   return context;
// };
