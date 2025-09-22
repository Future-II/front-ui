import axios from "axios";

const base = "/api";

export const api = axios.create({ baseURL: base });

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
