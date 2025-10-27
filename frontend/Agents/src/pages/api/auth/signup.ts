import { NextApiRequest, NextApiResponse } from "next";

export type SignupProps = {
  email: string;
  fullName: string;
  password: string;
  code?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fullName, email, password, code } = req.body as SignupProps;

  try {
    const payload = {
      fullName,
      email,
      password,
      ...(code ? { code } : {}),
    };

    console.log("Sending to external API:", payload);

    const response = await fetch(
      "https://aa-homez.onrender.com/api/v1/auth/agent/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData.message || errorData);
      return res.status(response.status).json({
        status: false,
        message: errorData.message || "Registration failed",
      });
      console.log("Response:", response);
console.log("Error Data:", errorData);

    }

 

    const data = await response.json();
    const token = data?.data?.token;

    console.log("Received token:", token);
    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}
