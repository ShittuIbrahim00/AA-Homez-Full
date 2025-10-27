// utils/api.ts
import axios from "axios";
import { DButils } from "./urls";
import { LoginSchemaType } from "./types";
import { SignupProps } from "@/pages/api/auth/signup";
import { ScheduleVistSubProperty } from "@/pages/api/schedule/subPropertyVisit";
import { ScheduleVistProperty } from "@/pages/api/schedule/propertyVist";
import { uploadToCloudinary } from "./cloudinary";

// Provide a fallback URL if the environment variable is not set
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("$token_key");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const LoginHandler = async (payload: LoginSchemaType) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/login`, payload);
    localStorage.setItem("$token_key", response?.data?.token);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("LoginHandler error:", error.response?.data || error.message);
    return {
      status: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
      data: null,
    };
  }
};

export const SignupHandler = async (formData: SignupProps) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/register`, formData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("SignupHandler error:", error.response?.data || error.message);
    return {
      status: false,
      message: error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
};

export const verifyEmailHandler = async ({ token }) => {
  // Call backend endpoint: POST /api/auth/verify-email
  const res = await fetch(`${API_BASE_URL}/agent/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return await res.json();
};

export const resendVerificationHandler = async ({ email, aid }) => {
  // Call backend endpoint: POST /api/auth/resend-verification
  const res = await fetch(`${API_BASE_URL}/agent/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, aid }),
  });
  return await res.json();
};


// Add these near the bottom of the file

// === FORGOT PASSWORD ===
// export const forgotPasswordHandler = async (email: string) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/agent/forgot-password`, { email });
//     console.log("ForgotPasswordHandler response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("ForgotPasswordHandler error:", error.response?.data || error.message);
//     throw {
//       status: false,
//       message: error.response?.data?.message || "Failed to send password reset email.",
//     };
//   }
// };


export const forgotPasswordHandler = async (email: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/agent/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
console.log(res)
    return await res.json();
  } catch (error) {
    console.error("forgotPasswordHandler error:", error);
    return {
      status: false,
      message: "Something went wrong. Please try again.",
    };
  }
};



// === RESET PASSWORD ===
// utils/api.ts

export const resetPasswordHandler = async ({ token, aid, newPassword }) => {
  try {
    // ✅ Log the data being sent
    console.log("Sending reset password request", { token, aid, newPassword });

    const res = await fetch(`${API_BASE_URL}/agent/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, aid, newPassword }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Reset Password Error:", err);
    return {
      status: false,
      message: "Something went wrong during password reset.",
    };
  }
};




// ========== NIN VERIFICATION ========== 
export const verifyNINHandler = async ({ aid, nin }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/agent/verify-nin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aid, nin }),
    });
    return await res.json();
  } catch (error) {
    return {
      status: false,
      message: error.message || "NIN verification failed.",
    };
  }
};

// ========== USER PROFILE ==========
export const UserProfile = async () => {
  const token = localStorage.getItem("$token_key");
  try {
    const response = await axios.get(`${API_BASE_URL}/agent/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = response.data?.data;
    
    // Log the full response for debugging
    console.log("UserProfile response:", response.data);
    // console.log("Properties sold data:", result?.propertiesSold);

    return {
      status: true,
      data: {
        agent: result.agent,
        propertiesSold: result.propertiesSold,
        subPropertiesSold: result.subPropertiesSold, // Add sub-properties sold
        commissions: result.commissions,
        referralNetwork: result.referralNetwork,
      },
    };
  } catch (error: any) {
    return {
      status: false,
      message:
        error.response?.data?.message || "Unable to retrieve user profile",
    };
  }
};



export const UpdateUserProfile = async (profileData: {
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  imgFile: File | null; // Local image file
}) => {
  try {
    const token = localStorage.getItem("$token_key");

    // If there's an image file, upload it to Cloudinary first
    let imgUrl = null;
    if (profileData.imgFile) {
      try {
        imgUrl = await uploadToCloudinary(profileData.imgFile);
      } catch (uploadError) {
        console.error("Failed to upload image to Cloudinary:", uploadError);
        throw new Error("Failed to upload image");
      }
    }

    // Create the payload with text fields and image URL
    const payload: any = {};
    
    if (profileData.phone && profileData.phone.trim() !== "") 
      payload.phone = profileData.phone.trim();
    if (profileData.address && profileData.address.trim() !== "") 
      payload.address = profileData.address.trim();
    if (profileData.bankName && profileData.bankName.trim() !== "") 
      payload.bankName = profileData.bankName.trim();
    if (profileData.accountNumber && profileData.accountNumber.trim() !== "") 
      payload.accountNumber = profileData.accountNumber.trim();
    if (profileData.accountName && profileData.accountName.trim() !== "") 
      payload.accountName = profileData.accountName.trim();
    
    // Add image URL if available
    if (imgUrl) {
      payload.imgUrl = imgUrl;
    }

    const res = await fetch("https://aa-homez.onrender.com/api/v1/agent/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    const responseText = await res.text();
    
    // Try to parse as JSON, but handle if it's not valid JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      data = {
        status: false,
        message: "Failed to parse server response",
        rawResponse: responseText
      };
    }
    
    return data;
  } catch (err: any) {
    console.error("UpdateUserProfile error:", err);
    return {
      status: false,
      message: err.message || "Something went wrong",
      data: null,
    };
  }
};

export const ChangePasswordHandler = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await axiosInstance.post("/agent/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (err: any) {
    return {
      status: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

export const VerifyAgent = async (payload) => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.verifyuser}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Verification failed. Please check your details and try again.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

// ========== PROPERTY ==========
export const getHotProperty = async () => {
  const token = localStorage.getItem("$token_key");
  try {
    const response = await axios.get(`${API_BASE_URL}/property/hot/list`, {
      headers: {
        "Content-Type": "application/json",
        // "guard-token": token,
        "Authorization": `Bearer ${token}`,
      },
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to fetch hot properties. Try again later.",
      data: null,
    };
  }
};

export const getAllUserProperty = async (page: number) => {
  const token = localStorage.getItem("$token_key");
  try {
    const response = await axios.get(`${API_BASE_URL}/property?limit=1000`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to fetch properties. Please check your connection.",
      data: null,
    };
  }
};

export const getSingleProperty = async (propertyId: string) => {
  const token = localStorage.getItem("$token_key");
  try {
    const response = await axios.get(`${API_BASE_URL}/property/${propertyId}`, {
      headers: {
        "Content-Type": "application/json",
        // "guard-token": token,
        "Authorization": `Bearer ${token}`,
      },

    });
    console.log( "Singlr property detals", response.data)
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Property details could not be retrieved.",
      data: null,
    };
  }
};

export const getSubProperties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/property/all/sub/property`);
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to fetch sub-properties.",
      data: null,
    };
  }
};

export const getSingleSubPropertes = async (subPropertyId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/property/sub/${subPropertyId}`);
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Sub-property details could not be retrieved.",
      data: null,
    };
  }
};

// ========== SCHEDULE ==========
export const getSingleSchedule = async (id: string) => {
  const res = await fetch(`${DButils.getOneSchedule(id)}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Unable to fetch schedule details.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

export const GetAllPendingScheduleHandler = async () => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.pendingSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Could not retrieve pending schedules.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

export const createSubPropertyVist = async (payload: ScheduleVistSubProperty) => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.subPropertyVist}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to schedule sub-property visit.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

export const createPropertyVist = async (payload: ScheduleVistProperty) => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.propertyVist}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Failed to schedule property visit.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

export const GetAllDeclineScheduleHandler = async () => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.declinedSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Could not fetch declined schedules.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};

export const GetAllApprovedScheduleHandler = async () => {
  const token = localStorage.getItem("$token_key");
  const res = await fetch(`${DButils.approvedSchedule}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return {
      status: false,
      message: "Could not fetch approved schedules.",
      data: null,
    };
  }

  const data = await res.json();
  return data;
};



export const GetSchedulesByStatusHandler = async (
  status: "pending" | "approved" | "declined"
) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("$token_key") : null;

  if (!token) {
    console.warn("No token found in localStorage.");
    return {
      status: false,
      message: "No auth token.",
      data: null,
    };
  }

  console.log(`[FETCH] Getting ${status} schedules with token:`, token);

  try {
    const res = await fetch(`${API_BASE_URL}/schedule/status/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log(`[RESPONSE] Status for ${status}:`, res.status);

    const data = await res.json();
    console.log(`[RESPONSE DATA] ${status.toUpperCase()}:`, data);

    return data;
  } catch (error) {
    console.error(`[ERROR] Fetch failed for ${status}:`, error);
    return {
      status: false,
      message: `Fetch error for ${status}`,
      data: null,
    };
  }
};

// src/hooks/schedule.hooks.ts
export const getSchedulesByAgent = async (agentId: number) => {
  try {
    const res = await fetch(`/api/v1/schedule/agent`, {
      method: "POST", // or GET, depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aid: agentId }),
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    return data?.schedules || []; // adjust based on your actual response shape
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

