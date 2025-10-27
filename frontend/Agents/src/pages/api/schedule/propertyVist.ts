import { NextApiRequest, NextApiResponse } from "next";
export type ScheduleVistProperty = {
  pid: number;
  date: string;
  time: string;
  title: string;
  clientPhone: string;
  clientName: string;
  start: string;
  end: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { clientName, clientPhone, date, end, pid, start, time, title } =
    req.body as ScheduleVistProperty;
  const token = req.headers["guard-token"];
  try {
    const response = await fetch(
      " https://aa-homez.onrender.com/api/v1/property/schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "guard-token": token as string,
        },
        body: JSON.stringify({
          clientName,
          clientPhone,
          date,
          end,
          pid,
          start,
          time,
          title,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message });
    }
    const data = await response.json();
    if (data) {
      console.log(
        response.headers,
        ":Response statushfdjskjdhbnfjshdbnjwshdbnsjhdbnwjsdnjdnjdnjdnjn"
      ); // Log status code for debugging
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
