// import { API_URL } from '@env';

/**
 * Object Request Header
 */
export const requestHeader = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 *
 * @param {string} url
 * @param {string, [GET, POST, PATCH, PUT...]} method
 * @param {payload} payload
 * @param {boolean} token
 * @param {boolean} text
 * @param {boolean} form
 * @returns Response Data;
 */
export async function request(url, method, payload, token, text, form) {
  // Use environment variable with fallback to default API URL
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aa-homez.onrender.com/api/v1";

  const xtoken = localStorage.getItem("$token_key");

  console.log({ xtoken });

  if (token && xtoken) {
    requestHeader["Authorization"] = `Bearer ${xtoken}`;
  } else {
    delete requestHeader["Authorization"];
  }

  requestHeader["Content-Type"] =
    form === true ? "multipart/form-data" : "application/json";

  if (method === "GET") {
    return fetch(API_URL + url, {
      method,
      headers: Object.assign({}, requestHeader),
    })
      .then((res) => {
        if (text === true) {
          return res.text();
        } else if (res) {
          return res.json();
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.error(`Request Error ${url}: `, err);
        throw new Error(err);
        // return err;
      });
  } else {
    return fetch(API_URL + url, {
      method,
      headers: Object.assign({}, requestHeader),
      body: form === true ? payload : JSON.stringify(payload),
    })
      .then((res) => {
        if (text === true) {
          return res.text();
        } else if (res) {
          return res.json();
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.error(`Request Error ${url}: `, err);
        throw new Error(err);
      });
  }
}