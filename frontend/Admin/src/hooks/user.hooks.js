import { toastError } from "@/utils/toastMsg"; // Updated import
import userServices from "../services/user.services";
import { GetCurrentUser } from "@/utils/api";

// hooks/user.hooks.ts
export const _getUser = async () => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
};

/**
 *
 * @param {{}} payload
 * @return {Promise<*|boolean>}
 * @private
 */
export const _updateUser = async (payload) => {
  try {
    const res = await userServices.updateUser(payload);

    if (res.status === true) {
      console.log({ res });
      return res.data;
    } else {
      console.log("error responses: ", res);
      toastError(res.message);
      return false;
    }
  } catch (err) {
    console.log("error message: _updateUser ", err);
    toastError(err.message);
  }
};