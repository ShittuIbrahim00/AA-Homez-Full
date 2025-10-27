import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = global.guardToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property/sub/schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "guard-token": token as string,
        },
        body: JSON.stringify(req.body),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message });
    }
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
