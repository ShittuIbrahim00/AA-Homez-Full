// utils/markNotificationAsRead.ts
import axios from "axios";

export const markNotificationAsRead = async (sid: number) => {
  const token = localStorage.getItem("$token_key");

  if (!token) throw new Error("Auth token missing");

  return axios.patch(
    `https://aa-homez.onrender.com/api/v1/notifications/${sid}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};