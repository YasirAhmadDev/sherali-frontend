import api from "@/api/axios";

// params: { district, isActive: "true" | "false", search }
export const getLocations = async (params = {}) => {
  const { data } = await api.get("/locations", { params });
  return data.data; // [{ _id, name, district, lat, lng, isActive, accidentCount }]
};

export const createLocation = async (payload) => {
  const { data } = await api.post("/locations", payload);
  return data.location;
};

export const updateLocation = async (id, payload) => {
  const { data } = await api.put(`/locations/${id}`, payload);
  return data.location;
};

export const deactivateLocation = async (id) => {
  const { data } = await api.delete(`/locations/${id}`);
  return data.location;
};