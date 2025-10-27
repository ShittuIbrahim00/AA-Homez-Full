import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
export type LoginProps = {
  email: string;
  password: string;
};
console.log(cookie, "hhhhhh");
declare global {
  var guardToken: string | undefined;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body as LoginProps;
  try {
    const response = await fetch(
      "https://aa-homez.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message });
    }
    const data = await response.json();
    if (data) {
      const token = data?.data?.token;
      global.guardToken = token;

      res.setHeader("Guard-Token", token);
      // res.setHeader(
      //   "Set-Cookie",
      //   cookie.serialize("guard-token", token, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === "production",
      //     maxAge: 60 * 60 * 24, // 1 day
      //     path: "/", // Make the cookie available on all routes
      //   })
      // );
      // console.log(token, "tokennnnnnn");
      // res.setHeader("Set-Cookie", `token=${token}`);
      console.log(response.headers, ":Response status"); // Log status code for debugging
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
