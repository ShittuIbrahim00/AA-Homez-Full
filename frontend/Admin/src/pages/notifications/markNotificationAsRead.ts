// utils/markNotificationAsRead.ts
import axios from "axios";

export const markNotificationAsRead = async (sid: number) => {
  const token =
    localStorage.getItem("business-token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("guard-token");

  if (!token) throw new Error("Auth token missing");

  return axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${sid}/read`,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

// Add default export to prevent Next.js page error
export default markNotificationAsRead;
