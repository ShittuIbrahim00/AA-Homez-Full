// hooks/referral.hooks.ts
import axios from "axios";
import { Referral } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";


export const _getReferrals = async (): Promise<Referral[]> => {
  const token = localStorage.getItem("$token_key");
  if (!token) throw new Error("Auth token missing.");

  const res = await axios.get(
    `${API_BASE}/agent/all/referrals?page=1&limit=20&sortBy=createdAt&sortOrder=ASC`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log("API response:", res.data);

  // Fix this line:
  const referrals = res.data?.data?.referrals;

  console.log("Parsed referrals:", referrals);

  return Array.isArray(referrals) ? referrals : [];
};