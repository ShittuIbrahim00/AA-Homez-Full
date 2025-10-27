import { NextApiRequest, NextApiResponse } from "next";
export type SignupProps = {
  email: string;
  fullName: string;
  password: string;
  imgUrl?: string;
  role: "business";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    email,
    password,
    role = "business",
    fullName,
  } = req.body as SignupProps;
  try {
    const response = await fetch(
      "https://aa-homez.onrender.com/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
          fullName,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData, "errrrrrrrr");
      return res.status(response.status).json({ error: errorData.message });
    }
    const data = await response.json();
    if (data) {
      const token = data?.data?.token;
      console.log(token, "tokennnnnnn");
      res.setHeader("Set-Cookie", `token=${token}`);
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
