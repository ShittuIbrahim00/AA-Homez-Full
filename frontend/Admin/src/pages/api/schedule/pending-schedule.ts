import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = global.guardToken;
    console.log(req.cookies, "", token);
    const response = await fetch(
      `https://aa-homez.onrender.com/api/v1/agency/schedules/pending`,
      {
        method: "GET",
        headers: {
          Accept: "application/json", // Specify JSON response if needed by API
          "guard-token": token as string,
        },
      }
    );

    console.log("Response status:", response.status); // Log status code for debugging

    if (!response.ok) {
      const errorData = await response.text(); // Get text in case it's not JSON
      console.error("Error fetching data:", errorData);
      return res.status(response.status).json({
        status: false,
        message:
          response.status === 404
            ? "Resource not found"
            : "Failed to fetch data",
        data: null,
      });
    }

    const data = await response.json();
    // console.log("Fetched data:", data);
    // const token = req.cookies.token;
    // console.log(token, "ffff");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
}
