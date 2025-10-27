// types/property.ts

export interface Bathroom {
  type: string;
  count: string | number; // API returns string but you might handle number too
}

export interface KeyInfo {
  label: string;
  value: string;
}

export interface SubProperty {
  sid: number;
  pid: number;
  uid: number;
  name: string;
  description: string;
  location?: string;
  price: string;
  bedrooms?: number;
  bathrooms?: Bathroom[];
  keyInfo?: KeyInfo[];
  images?: string[];
  mapLink?: string;
  finalMapLink?: string;
  landMark?: string;
  yearBuilt?: string;
  foundation?: string;
  type?: string;
  listingStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  status?: boolean;
  interior?: string[];
  appliances?: string[];
  otherRooms?: string[];
  landInfo?: KeyInfo[];
  utilities?: string[];
  paidAmount?: string;
  deficitAmount?: number;
}

export interface UserSettings {
  sid: number;
  uid: number;
  name: string;
  description: string;
  location: string;
  type: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: string[];
  scheduleDays: number[];
  scheduleTime: number[];
}

export interface User {
  uid: number;
  firstName: string;
  lastName: string;
  Settings: UserSettings;
}

export interface Property {
  pid: number;
  uid: number;
  aid: number | null; // Added aid, can be null
  name: string;
  description: string;
  location: string;
  price: string;
  priceRange?: string;
  priceStart?: string;
  priceEnd?: string;
  paidAmount?: string;
  deficitAmount?: number;
  mapLink?: string;
  finalMapLink?: string;
  landMark?: string;
  yearBuilt?: string;
  type?: string;
  hottestCount?: number;
  listingStatus?: string;
  paymentStatus?: string;
  status?: boolean;
  soldTo?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  images: string[];
  SubProperties: SubProperty[];
  User?: User;
  isFeatured?: boolean;
  isHot?: boolean;
}