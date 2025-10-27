export interface Property {
  pid: number;
  price: string;
  images: string[];
  location: string;
  createdAt: string;
  soldTo: string | null;
}

export interface SubProperty {
  sid: number;
  price: string;
  images: string[];
  name: string;
  location: string;
  createdAt: string;
  soldTo: string | null;
}

export interface Agent {
  aid: number;
  email?: string;
  phone?: string;
  fullName: string;
  imgUrl: string | null;
  referralCode: string;
  referral_count: number;
  sales_earnings: string;
  referral_earnings: string;
  total_earnings: string;
  sales_portfolio: string;
  rank: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  ninVerified: boolean;
  createdAt: string;
  Property: Property[];
  SubProperties?: SubProperty[];
}

export interface AffiliatesAPIResponse {
  data: {
    status: boolean;
    data: Agent[];
  };
  status: number;
  statusText: string;
}