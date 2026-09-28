import api from "@/api/axios";

export const loginRequest = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { token, user }
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data; // { user }
};

export const changePasswordRequest = async (currentPassword, newPassword) => {
  const { data } = await api.post("/auth/change-password", { currentPassword, newPassword });
  return data; // { message, token, user }
};