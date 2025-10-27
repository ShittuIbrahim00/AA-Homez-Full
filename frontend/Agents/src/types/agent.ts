// types/agent.ts

export type AgentType = {
  aid: number;
  email: string;
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  imgUrl: string | null;
  password: string;
  sales_earnings: string;
  referral_earnings: string;
  total_earnings: string;
  sales_portfolio: string;
  rank: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string | null;
  verified: boolean;
  status: number;
  referralRewarded: boolean;
  referral_count: number;
  referralCode: string;
  referred_by: number | null;
  termStatus: boolean;
  ninVerified: boolean;
  verification_date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Optional & extra verified details
  verified_first_name?: string;
  verified_last_name?: string;
  verified_dob?: string;
  verified_gender?: string;
  verified_photo?: string | null;

  // Optional encrypted fields
  encrypted_nin?: any;
  encrypted_bank_account?: any;

  // Optional tokens
  token?: string | null;
  otp?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  passwordChangedAt?: string | null;

  // Backend relations
  referredBy?: any; // Can refine later
};
