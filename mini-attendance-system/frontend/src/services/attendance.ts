import api from "./api";

export const checkIn = async () => {
  const res = await api.post("/attendance/checkin");
  return res.data?.data ?? res.data;
};

export const checkOut = async () => {
  const res = await api.post("/attendance/checkout");
  return res.data?.data ?? res.data;
};

export const fetchReports = async (params?: any) => {
  const res = await api.get("/attendance/reports", { params });
  return res.data?.data ?? res.data;
};
