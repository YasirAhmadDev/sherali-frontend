import api from "@/api/axios";

// params: { page, limit, role, isActive: "true" | "false", search }
export const getUsers = async (params = {}) => {
  const { data } = await api.get("/users", { params });
  return data; // { data: [...], pagination: { page, limit, total, pages } }
};

export const createUser = async (payload) => {
  const { data } = await api.post("/users", payload);
  return data.user;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data.user;
};

export const resetUserPassword = async (id, newPassword) => {
  const { data } = await api.post(`/users/${id}/reset-password`, { newPassword });
  return data;
};