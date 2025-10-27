import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { propertyId } = req.query;

  if (!propertyId) return res.status(400).json({ status: false, message: "Property ID required" });

  try {
    const guardToken = req.headers["guard-token"] || "";

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/property/sub/add/${propertyId}`,
      req.body,
      {
        headers: {
          "guard-token": guardToken,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("Proxy error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
}
