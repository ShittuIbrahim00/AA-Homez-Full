import { toast } from "react-toastify";
import scheduleServices from "../services/schedule.services";
import {
  createPropertyVist,
  createSubPropertyVist,
  getSchedulesByAgent,
  GetAllApprovedScheduleHandler,
  GetAllDeclineScheduleHandler,
  GetAllPendingScheduleHandler,
  getSingleSchedule,
} from "@/utils/api";

export const _createSchedule = async (data) => {
  try {
    const res = await createPropertyVist(data);

    if (res.status === true) {
      // console.log({res});
      return res.data;
    } else {
      console.log("error responses: ", res);
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("create-schedule-error")) {
        toast.error(res.message, { toastId: "create-schedule-error" });
      }
      return false;
    }
  } catch (err) {
    console.log("error message: _createSchedule ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("create-schedule-exception")) {
      toast.error(err.message, { toastId: "create-schedule-exception" });
    }
  }
};

export const _createSubSchedule = async (data) => {
  try {
    const res = await createSubPropertyVist(data);

    if (res.status === true) {
      // console.log({res});
      return res.data;
    } else {
      console.log("error responses: ", res);
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("create-sub-schedule-error")) {
        toast.error(res.message, { toastId: "create-sub-schedule-error" });
      }
      return false;
    }
  } catch (err) {
    console.log("error message: _createSubSchedule ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("create-sub-schedule-exception")) {
      toast.error(err.message, { toastId: "create-sub-schedule-exception" });
    }
  }
};

export const _getAllPendingSchedules = async () => {

    console.log("Fetching pending schedules...");
  try {
    const res = await GetSchedulesByStatusHandler("pending");

    if (res.status === true) {
      return res.data;
    } else {
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("pending-schedules-error")) {
        toast.error(res.message, { toastId: "pending-schedules-error" });
      }
      return false;
    }

  } catch (err) {
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("pending-schedules-exception")) {
      toast.error("Network error while fetching pending schedules.", { toastId: "pending-schedules-exception" });
    }
  }
};

export const _getAllApprovedSchedules = async () => {
    console.log("Fetching approved schedules...");
  try {
    const res = await GetSchedulesByStatusHandler("approved");

    if (res.status === true) {
      return res.data;
    } else {
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("approved-schedules-error")) {
        toast.error(res.message, { toastId: "approved-schedules-error" });
      }
      return false;
    }
  } catch (err) {
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("approved-schedules-exception")) {
      toast.error("Network error while fetching approved schedules.", { toastId: "approved-schedules-exception" });
    }
  }
};

export const _getAllDeclinedSchedules = async () => {
  try {
    const res = await GetSchedulesByStatusHandler("declined");

    if (res.status === true) {
      return res.data;
    } else {
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("declined-schedules-error")) {
        toast.error(res.message, { toastId: "declined-schedules-error" });
      }
      return false;
    }
  } catch (err) {
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("declined-schedules-exception")) {
      toast.error("Network error while fetching declined schedules.", { toastId: "declined-schedules-exception" });
    }
  }
};


export const _getSchedule = async (id) => {
  try {
    const res = await getSingleSchedule(id);

    if (res.status === true) {
      // console.log({res});
      return res.data;
    } else {
      console.log("error responses: ", res);
      // Prevent duplicate toasts by checking if we've already shown this error
      if (!toast.isActive("get-schedule-error")) {
        toast.error(res.message, { toastId: "get-schedule-error" });
      }
      return false;
    }
  } catch (err) {
    console.log("error message: _getSchedule ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("get-schedule-exception")) {
      toast.error(err.message, { toastId: "get-schedule-exception" });
    }
  }
};