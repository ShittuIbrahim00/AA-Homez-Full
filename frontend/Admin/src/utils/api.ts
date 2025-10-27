import { SignupProps } from "@/pages/api/auth/register";
import { DButils } from "./url";
import { LoginProps } from "@/pages/api/auth/login";
import { CreatePropertyProps } from "@/pages/api/property/create-property";
import { UpdateRequestUser } from "@/pages/api/profile/update-request";

import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aa-homez.onrender.com/api/v1";



export const LoginHandler = async (payload: Record<string, any>) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
// console.log("LOGGED IN RESPONSE", res);
    // ❌ Handle login failure
    if (!res?.data?.status) {
      return {
        status: false,
        message: res.data.message || "Login failed",
        data: null,
      };
    }

    // 🔐 Extract token
    const businessToken = res.data.data.token;

    // Save to localStorage
    localStorage.setItem("business-token", businessToken);

    return {
      status: true,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;

    return {
      status: false,
      message: err.response?.data?.message || err.message || "Unexpected login error",
      data: null,
    };
  }
};

export const SignupHandler = async (payload: SignupProps) => {
  const res = await fetch(`${DButils.register}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("error messssssssss", res);
  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Sign up",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};

// schdeule
export const CreateScheduleHandler = async (payload) => {
  const res = await fetch(`${DButils.createSchedule}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Create Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const CreateSubScheduleHandler = async (payload) => {
  const res = await fetch(`${DButils.createSubSchedule}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Create Sub Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const RescheduleHandler = async (rescheduleId) => {
  const res = await fetch(`${DButils.updateSchedule(rescheduleId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: undefined,
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to reschedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const ApproveScheduleHandler = async (approvedId) => {
  const res = await fetch(`${DButils.patchApprovedSchedule(approvedId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: undefined,
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to approve schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const GetAllPendingScheduleHandler = async () => {
  const res = await fetch(`${DButils.pendingSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get Pending Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const GetAllApprovedScheduleHandler = async () => {
  const res = await fetch(`${DButils.approvedSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get Approved Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const GetSingleScheduleHandler = async (id) => {
  const res = await fetch(`${DButils.singleSchedule(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get Single Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const GetAllDeclineScheduleHandler = async () => {
  const res = await fetch(`${DButils.declineSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get Declined Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};

export const CreateProperty = async (payload: CreatePropertyProps) => {
  const res = await fetch(`${DButils.createProperty}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get Declined Schedule",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};

// agents
export const GetAllAgents = async (page = 1, limit = 10) => {
  const res = await fetch(`${DButils.profileAgents(page, limit)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get agents",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
export const GetCurrentUser = async () => {
  const res = await fetch(`${DButils.profileUser}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to Get current user",
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};

export const ProfileUpdateUserRequest = async (payload: UpdateRequestUser) => {
  const res = await fetch(`${DButils.profileRequest}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "guard-token": `${localStorage.getItem("$token_key")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.log(errorData, "ddikdjdjddkdkdk");
    return {
      status: false,
      message: JSON.stringify(errorData),
      data: null,
    };

    // throw new Error("Failed to log in");
    // return false;
  }
  const data = await res.json();
  return await data;
};
