import axios from "axios";
import { get } from "@storage/storage";

const API_URL = import.meta.env.VITE_APP_API_URl;
const TIMEOUT = 15000;

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const accessToken = get("ACCESS_TOKEN");

    if (accessToken) {
      config.headers["X-User-Header"] = accessToken;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

let axiosInstance = createAxiosInstance();

export const baseQuery = async ({ url, method = "GET", data, params, config = {} }) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
      params,
      ...config
    });

    return { data: response };
  } catch (error) {
    return {
      error: {
        status: error.response ? error.response.status : "FETCH_ERROR",
        message: error.response ? error.response.data : error.message,
      },
    };
  }
};

export const refreshAxiosInstance = () => {
  axiosInstance = createAxiosInstance();
};

export default axiosInstance;

