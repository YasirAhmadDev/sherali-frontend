import api from "@/api/axios";

export const getSummary = async (params = {}) => {
  const { data } = await api.get("/reports/summary", { params });
  return data; // { totals: { accidents, injured, deaths }, byDistrict: [...] }
};

// Returns a Blob (the CSV file). Needs the login token, so a plain link would not work.
export const downloadAccidentsCsv = async (params = {}) => {
  const response = await api.get("/reports/accidents.csv", { params, responseType: "blob" });
  return response.data;
};