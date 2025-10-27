// types/user.ts

export interface User {
  totalEarnings: number | null;
  referralLink: string | null;
  verificationLink: string | null;
  aid: number | null;
  email: string | null;
  fullName: string | null;
    firstName?: string;
  lastName?: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  imgUrl: string | null;
  password: string | null;
  salesEarnings: number;
  referralEarnings: number;
  accountNumber: string | null;
  accountName: string | null;
  bankName: string | null;
  bankCode: string | null;
  otp: string | null;
  referralCode: string | null;
  referredBy: string | null;
  rank: string | null;
  apiKey: string | null;
  token: string | null;
  pushToken: string | null;
  verified: boolean;
  status: number;
}
