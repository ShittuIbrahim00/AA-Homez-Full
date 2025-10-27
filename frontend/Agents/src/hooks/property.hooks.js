import { toast } from "react-toastify";
import {
  getAllUserProperty,
  getHotProperty,
  getSingleProperty,
  getSingleSubPropertes,
  getSubProperties,
} from "@/utils/api";
import axios from "axios";


const API_URL = "https://aa-homez.onrender.com/api/v1";
const API_BASE = `${API_URL}/property`;

// console.log("API_BASE is:", API_BASE)
export const _getAllHotProperty = async () => {
  try {
    const res = await getHotProperty();
    if (res.success === true) {
      // console.log(res.data);
      return res.data;
    }
  } catch (err) {
    // console.log("error message: _getAllHotProperty ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("hot-property-error")) {
      toast.error(err.message, { toastId: "hot-property-error" });
    }
  }
};

export const _getProperty = async (id) => {
  try {
    const res = await getSingleProperty(id);
    // const res = await propertyServices.getProperty(id);

    if (res.success === true) {
      // console.log(res.data);
      return res.data;
    }
  } catch (err) {
    // console.log("error message: _getProperty ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("property-error")) {
      toast.error(err.message, { toastId: "property-error" });
    }
  }
};

export const _getProperties = async (page = 1) => {
  try {
    const res = await getAllUserProperty(page);

    if (res.success === true) {
      console.log(res);
      return res.data;
    }
  } catch (err) {
    // console.log("error message: _getProperty ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("properties-error")) {
      toast.error(err.message, { toastId: "properties-error" });
    }
  }
};

export const _getAllSubProperties = async () => {
  try {
    const res = await getSubProperties();
    if (res.success === true) {
      // console.log(res.data);
      return res.data;
    }
  } catch (err) {
    console.log("error message: _getAllSubProperties ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("sub-properties-error")) {
      toast.error(err.message, { toastId: "sub-properties-error" });
    }
  }
};

export const _getSubProperty = async (id) => {
  try {
    const res = await getSingleSubPropertes(id);
    if (res.success === true) {
      // console.log(res.data);
      return res.data;
    }
  } catch (err) {
    console.log("error message: _getSubProperty ", err);
    // Prevent duplicate toasts by checking if we've already shown this error
    if (!toast.isActive("sub-property-error")) {
      toast.error(err.message, { toastId: "sub-property-error" });
    }
  }
};


export const fetchSubProperty = async (propertyId, subPropertyId) => {
  try {
    const token = localStorage.getItem("$token_key");

    if (!token) throw new Error("Missing auth token");

    const url = `${API_BASE}/${propertyId}`;
    // console.log("🔗 Fetching:", url);

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sub = res.data.data.SubProperties?.find(
      (s) => s.sid?.toString() === subPropertyId.toString()
    );

    // console.log("✅ Sub-property found:", sub);
    return sub || null;
  } catch (err) {
    console.error("❌ Fetch sub-property error:", err.response?.data || err.message);
    return null;
  }
};