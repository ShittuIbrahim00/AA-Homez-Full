import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers["guard-token"], "fghvshjbdhjsbhjdvbshgvdhgvd");
  const token = req.headers["guard-token"];
  try {
    const response = await fetch(
      " https://aa-homez.onrender.com/api/v1/agent",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "guard-token": token as string,
        },
      }
    );

    console.log("Response status:", req.headers, response.headers, req.cookies); // Log status code for debugging

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
