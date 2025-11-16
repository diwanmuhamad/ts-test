import axios from "axios";

const authBase = import.meta.env.VITE_AUTH_BASE || "http://localhost:4001";

export async function login(email: string, password: string) {
  const res = await axios.post(`${authBase}/auth/login`, { email, password });
  // backend may return { success: true, data: { token } } or plain { token }
  const payload = res.data?.data ?? res.data;
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  // payload could be { token } or { data: { token } }
  return payload.token ?? payload?.data?.token ?? null;
}

export async function register(payload: any) {
  const res = await axios.post(`${authBase}/auth/register`, payload);
  return res.data?.data ?? res.data;
}
