import { toast } from "react-toastify";
import userServices from "../services/user.services";
import { UserProfile, VerifyAgent } from "@/utils/api";

export const _getUser = async () => {
  try {
    const res = await UserProfile();
    if (res.status === true) { // <-- changed from res.success
      return res.data;
    } else {
      console.log("error responses: ", res);
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("user-profile-error")) {
        toast.error(res.message, { toastId: "user-profile-error" });
      }
      return false;
    }
  } catch (err) {
    console.log("error message: _getUser ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("user-profile-exception")) {
      toast.error(err.message, { toastId: "user-profile-exception" });
    }
    return false;
  }
};

export const _verifyAgent = async (payload) => {
  try {
    const res = await VerifyAgent(payload);

    if (res.status === true) {
      // console.log({ res });
      return res.data;
    } else {
      console.log("error responses: ", res);
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("verify-agent-error")) {
        toast.error(res.message, { toastId: "verify-agent-error" });
      }
      return false;
    }
  } catch (err) {
    console.log("error message: _verifyAgent ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("verify-agent-exception")) {
      toast.error(err.message, { toastId: "verify-agent-exception" });
    }
  }
};