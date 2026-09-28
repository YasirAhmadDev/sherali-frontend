import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--fg)",
              border: "1px solid var(--line)",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}