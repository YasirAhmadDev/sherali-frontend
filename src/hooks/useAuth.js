import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
