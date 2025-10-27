import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/schedule/`;

// 🔐 Get Guard Token
const getGuardToken = () => {
  const token = localStorage.getItem("business-token");

  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

// ✅ Get all schedules (raw backend structure)
export const getAllSchedules = async () => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `${token}` },
    });
    // console.log("✅ Get all schedules response:", res);

    const rawData = res.data?.data || [];
    // console.log("✅ Get all schedules response:", rawData);
    return rawData;
  } catch (err) {
    console.error(
      "❌ Get all schedules error:",
      err.response?.data || err.message
    );
    return [];
  }
};

// ✅ Approve/Decline schedule
export const updateScheduleStatus = async (id, status) => {
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
    console.log("✅ Schedule status updated:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error(
      `❌ ${status} schedule error:`,
      err.response?.data || err.message
    );
    return { success: false };
  }
};

export const rescheduleSchedule = async (id, date, time) => {
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
  } catch (err) {
    console.error("❌ Reschedule error:", err.response?.data || err.message);
    return { success: false };
  }
};

// ✅ Get single schedule by id
// export const getScheduleById = async (id) => {
//   try {
//     const token = getGuardToken();
//     const res = await axios.get(`${API_URL}${id}`, {
//       // headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(`✅ Get schedule ${id} response:`, res.data);
//     return res.data?.data; // Adjust based on your API response shape
//   } catch (err) {
//     console.error(`❌ Get schedule ${id} error:`, err.response?.data || err.message);
//     return null;
//   }
// };

export async function getScheduleById(id) {
  const response = await fetch(`${API_URL}${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch schedule");
  const resJson = await response.json();
  console.log("API response for single schedule:", resJson);
  return resJson.data; // Make sure this is the actual schedule object
}

// ✅ Get approved schedules
export const _getAllApprovedSchedules = async () => {
  try {
    const allSchedules = await getAllSchedules();
    return allSchedules.filter(
      (schedule) => schedule.status?.toLowerCase() === "approved"
    );
  } catch (err) {
    console.error("❌ Get approved schedules error:", err);
    return [];
  }
};

// ✅ Get pending schedules
export const _getAllPendingSchedules = async () => {
  try {
    const allSchedules = await getAllSchedules();
    return allSchedules.filter(
      (schedule) => schedule.status?.toLowerCase() === "pending"
    );
  } catch (err) {
    console.error("❌ Get pending schedules error:", err);
    return [];
  }
};

// ✅ Get single schedule by id
export const _getSchedule = async (id) => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_URL}${id}`, {
      headers: { Authorization: `${token}` },
    });
    console.log(`✅ Get schedule ${id} response:`, res.data);
    return res.data?.data; // Adjust based on your API response shape
  } catch (err) {
    console.error(
      `❌ Get schedule ${id} error:`,
      err.response?.data || err.message
    );
    return false;
  }
};

// ✅ Approve schedule
export const _approveSchedule = async (id) => {
  try {
    const { success, data } = await updateScheduleStatus(id, "approved");
    return success ? data : false;
  } catch (err) {
    console.error("❌ Approve schedule error:", err);
    return false;
  }
};

// ✅ Update/Reschedule schedule
export const _updateSchedule = async (id, date, time) => {
  try {
    const { success, data } = await rescheduleSchedule(id, date, time);
    return success ? data : false;
  } catch (err) {
    console.error("❌ Update schedule error:", err);
    return false;
  }
};

// ✅ Create schedule
export const _createSchedule = async (payload) => {
  try {
    const token = getGuardToken();
    const res = await axios.post(`${API_URL}add`, payload, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Create schedule response:", res.data);
    return res.data?.status ? res.data : false;
  } catch (err) {
    console.error(
      "❌ Create schedule error:",
      err.response?.data || err.message
    );
    return false;
  }
};
