import axios from "axios";
import { getToken } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4002",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
