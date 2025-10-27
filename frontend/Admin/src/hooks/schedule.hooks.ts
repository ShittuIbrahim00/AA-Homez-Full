import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/schedule/`;

// 🔐 Get Guard Token
const getGuardToken = (): string => {
  const token = localStorage.getItem("business-token");

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

// Define types for schedule data
interface Schedule {
  scid: number;
  uid: number;
  aid: number;
  sid: number | null;
  pid: number | null;
  clientName: string;
  clientPhone: string;
  title: string;
  date: string;
  time: string;
  start: string;
  end: string;
  status: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Agent?: { fullName?: string; phone?: string; rank?: string; avatar?: string };
  Property?: { name?: string; image?: string; mapLink?: string };
  SubProperty?: { name?: string; mapLink?: string };
}

// ✅ Get all schedules (raw backend structure)
export const getAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `${token}` },
    });
    // console.log("✅ Get all schedules response:", res);

    const rawData = res.data?.data || [];
    // console.log("✅ Get all schedules response:", rawData);
    return rawData;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to fetch schedules";
    console.error(
      "❌ Get all schedules error:",
      errorMsg
    );
    toast.error(errorMsg);
    return [];
  }
};

// ✅ Approve/Decline schedule
export const updateScheduleStatus = async (id: number, status: string): Promise<{ success: boolean; data?: any }> => {
  try {
    const token = getGuardToken();
    const url =
      status.toLowerCase() === "approved"
        ? `${API_URL}approve/${id}`
        : `${API_URL}decline/${id}`;
    const res = await axios.patch(
      url,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    // console.log("✅ Schedule status updated:", res.data);
    return { success: true, data: res.data };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || `Failed to ${status} schedule`;
    console.error(
      `❌ ${status} schedule error:`,
      errorMsg
    );
    toast.error(errorMsg);
    return { success: false };
  }
};

export const rescheduleSchedule = async (id: number, date: string, time: string): Promise<{ success: boolean; data?: any }> => {
  try {
    const token = getGuardToken();
    const res = await axios.patch(
      `${API_URL}${id}`,
      { date, time },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log("✅ Schedule rescheduled:", res.data);
    return { success: true, data: res.data };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to reschedule";
    console.error("❌ Reschedule error:", errorMsg);
    toast.error(errorMsg);
    return { success: false };
  }
};

// ✅ Get single schedule by id
export async function getScheduleById(id: number): Promise<Schedule | null> {
  try {
    const response = await fetch(`${API_URL}${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch schedule");
    const resJson = await response.json();
    // console.log("API response for single schedule:", resJson);
    return resJson.data; // Make sure this is the actual schedule object
  } catch (err: any) {
    const errorMsg = err.message || `Failed to fetch schedule ${id}`;
    console.error(`❌ Get schedule ${id} error:`, errorMsg);
    toast.error(errorMsg);
    return null;
  }
};

// ✅ Get approved schedules
export const _getAllApprovedSchedules = async (): Promise<Schedule[]> => {
  try {
    const allSchedules = await getAllSchedules();
    return allSchedules.filter(
      (schedule) => schedule.status?.toLowerCase() === "approved"
    );
  } catch (err: any) {
    const errorMsg = err.message || "Failed to fetch approved schedules";
    console.error("❌ Get approved schedules error:", errorMsg);
    toast.error(errorMsg);
    return [];
  }
};

// ✅ Get pending schedules
export const _getAllPendingSchedules = async (): Promise<Schedule[]> => {
  try {
    const allSchedules = await getAllSchedules();
    return allSchedules.filter(
      (schedule) => schedule.status?.toLowerCase() === "pending"
    );
  } catch (err: any) {
    const errorMsg = err.message || "Failed to fetch pending schedules";
    console.error("❌ Get pending schedules error:", errorMsg);
    toast.error(errorMsg);
    return [];
  }
};

// ✅ Get single schedule by id
export const _getSchedule = async (id: number): Promise<Schedule | null> => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_URL}${id}`, {
      headers: { Authorization: `${token}` },
    });
    // console.log(`✅ Get schedule ${id} response:`, res.data);
    return res.data?.data; // Adjust based on your API response shape
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || `Failed to fetch schedule ${id}`;
    console.error(
      `❌ Get schedule ${id} error:`,
      errorMsg
    );
    toast.error(errorMsg);
    return null;
  }
};

// ✅ Approve schedule
export const _approveSchedule = async (id: number): Promise<any> => {
  try {
    const { success, data } = await updateScheduleStatus(id, "approved");
    return success ? data : false;
  } catch (err: any) {
    const errorMsg = err.message || "Failed to approve schedule";
    console.error("❌ Approve schedule error:", errorMsg);
    toast.error(errorMsg);
    return false;
  }
};

// ✅ Update/Reschedule schedule
export const _updateSchedule = async (id: number, date: string, time: string): Promise<any> => {
  try {
    const { success, data } = await rescheduleSchedule(id, date, time);
    return success ? data : false;
  } catch (err: any) {
    const errorMsg = err.message || "Failed to update schedule";
    console.error("❌ Update schedule error:", errorMsg);
    toast.error(errorMsg);
    return false;
  }
};

// ✅ Create schedule
export const _createSchedule = async (payload: any): Promise<any> => {
  try {
    const token = getGuardToken();
    const res = await axios.post(`${API_URL}add`, payload, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    // console.log("✅ Create schedule response:", res.data);
    return res.data?.status ? res.data : false;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to create schedule";
    console.error(
      "❌ Create schedule error:",
      errorMsg
    );
    toast.error(errorMsg);
    return false;
  }
};