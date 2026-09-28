import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-fg ${className}`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}