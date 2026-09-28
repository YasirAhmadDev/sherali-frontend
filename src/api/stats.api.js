import api from "@/api/axios";

export const getDashboardStats = async (year) => {
  const { data } = await api.get("/stats/dashboard", { params: year ? { year } : {} });
  return data; // { year, cards, perMonth, byDistrict, byCause, byType, bySeverity, topLocations, recent }
};

export const getMapPoints = async (params = {}) => {
  const { data } = await api.get("/stats/map", { params });
  return data.data; // [{ _id, date, coordinates, type, severity, ... }]
};