import axios from "axios";

export const TOKEN_KEY = "accident_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Send the login token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;
    const isLoginCall = error.config?.url?.includes("/auth/login");

    // Token expired or account disabled
    if (status === 401 && !isLoginCall) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    // First login: the backend blocks everything until the password is changed
    if (status === 403 && errorCode === "PASSWORD_CHANGE_REQUIRED") {
      window.location.href = "/change-password";
    }
    return Promise.reject(error);
  }
);

// Turns any axios error into a readable message for toasts and forms
export const getErrorMessage = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  error.message ||
  "Something went wrong";

export default api;
