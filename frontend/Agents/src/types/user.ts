// import type { AgentType } from "./agent";

// export type CommissionTotals = {
//   sales: number;
//   referral: number;
//   overall: number;
// };

// export type CommissionHistoryItem = {
//   tid: number;
//   amount: string;
//   service: string;
//   createdAt: string;
//   ref: string;
// };

// export type CommissionsType = {
//   totals: CommissionTotals;
//   history: CommissionHistoryItem[];
// };

// export type SoldProperty = {
//   pid: number;
//   name: string;
//   location: string;
//   price: string;
//   images: string[];
//   saleDate: string;
//   transactions: {
//     amount: string;
//     createdAt: string;
//   }[];
// };

// export type Referral = {
//   aid?: string | number | null;
//   fullName?: string;
//   imgUrl?: string | null;
//   rank?: string;
//   createdAt?: string;

//   // Additional from API (optional usage)
//   email?: string;
//   phone?: string;
//   verified?: boolean;
//   referralRewarded?: boolean;
//   referral_earnings?: string;
//   sales_portfolio?: string;
// };

// export interface UserType {
//   agent: AgentType | null;

//   aid: string | null;
//   email: string | null;
//   fullName: string | null;
//   dob: string | null;
//   gender: string | null;
//   address: string | null;
//   phone: string | null;
//   imgUrl: string | null;
//   password: string | null;

//   salesEarnings: number;
//   referralEarnings: number;
//   totalEarnings: number;

//   accountNumber: string | null;
//   accountName: string | null;
//   bankName: string | null;
//   bankCode: string | null;

//   otp: string | null;
//   referralCode: string | null;
//   referredBy: string | null;
//   rank: string | null;
//   apiKey: string | null;
//   token: string | null;
//   pushToken: string | null;

//   verified: boolean;
//   status: number;
//   ninVerified: boolean;

//   referralNetwork: Referral[];
//   propertiesSold: SoldProperty[];
//   commissions: CommissionsType;

//   referralLink: string | null;
//   verificationLink: string | null;
// }

export interface AgentType {
  referralRewarded: boolean;
  referral_count: number;
  aid: number;
  email: string;
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  imgUrl: string | null;
  sales_earnings: string;
  referral_earnings: string;
  total_earnings: string;
  sales_portfolio: string;
  rank: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  verified: boolean;
  status: number;
  idType: string;
  referralCode: string;
  referred_by: string | null;
  verification_token_revoked_at: string | null;
  ninVerified: boolean;
  termStatus: boolean;
  verification_date: string;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  passwordChangedAt: string | null;
  verified_first_name: string;
  verified_last_name: string;
  verified_photo: string | null;
  verified_dob: string;
  verified_gender: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  referredBy: string | null;
}

export type Referral = {
  aid?: string | number | null;
  fullName?: string;
  imgUrl?: string | null;
  rank?: string;
  createdAt?: string;
  email?: string;
  phone?: string;
  verified?: boolean;
  referralRewarded?: boolean;
  referral_earnings?: string;
  sales_portfolio?: string;
};

export type SoldProperty = {
  pid: number;
  name: string;
  location: string;
  price: string;
  images: string[];
  saleDate: string;
  transactions: {
    amount: string;
    createdAt: string;
  }[];
};

// Add type for sub-properties sold
export type SubPropertySold = {
  name: string;
  location: string;
  price: string;
  images: string[];
  saleDate: string;
};

export type CommissionHistoryItem = {
  tid: number;
  amount: string;
  service: string;
  createdAt: string;
  ref: string;
};

export type UserType = {
  agent: AgentType | null;
  propertiesSold: SoldProperty[];
  subPropertiesSold?: SubPropertySold[]; // Add sub-properties sold
  commissions: {
    history: CommissionHistoryItem[];
    totals: {
      sales: number;
      referral: number;
      overall: number;
    };
  };
  referralNetwork: Referral[];
};