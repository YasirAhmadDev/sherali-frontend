import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

// Usage: const { isDark, toggleTheme } = useTheme();
export const useTheme = () => useContext(ThemeContext);