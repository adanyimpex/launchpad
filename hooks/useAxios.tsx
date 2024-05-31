import axios, { type AxiosInstance } from "axios";

let api: AxiosInstance;

function _instance() {
  api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return api;
}

export function useAxios() {
  if (!api) {
    _instance();
  }

  return api;
}
