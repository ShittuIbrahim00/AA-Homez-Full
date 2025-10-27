import { NextApiRequest, NextApiResponse } from "next";

export type UpdateRequestUser = {
  aid: number;
  status: "rejected" | "approved";
  reason: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers["guard-token"], "fghvshjbdhjsbhjdvbshgvdhgvd");
  const token = req.headers["guard-token"];
  const { aid, reason, status } = req.body as UpdateRequestUser;
  try {
    const response = await fetch(
      "https://aa-homez.onrender.com/api/v1/agency/agents/update-request",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "guard-token": token as string,
        },
        body: JSON.stringify({
          aid,
          reason,
          status,
        }),
      }
    );

    console.log("Response status:", req.headers, response.headers, req.cookies); // Log status code for debugging

    if (!response.ok) {
      const errorData = await response.text(); // Get text in case it's not JSON
      console.error("Error fetching data:", errorData);
      return res.status(response.status).json({
        status: false,
        message: errorData,
        data: null,
      });
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  } finally {
    // const token = req.cookies;
    // console.log(token, "ffff");
  }
}
