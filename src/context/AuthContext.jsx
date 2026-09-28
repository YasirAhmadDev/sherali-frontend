import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { TOKEN_KEY } from "@/api/axios";
import { loginRequest, getMe, changePasswordRequest } from "@/api/auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token exists we must check it with the server before showing any page
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const { token, user } = await changePasswordRequest(currentPassword, newPassword);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout, changePassword }),
    [user, loading, login, logout, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}