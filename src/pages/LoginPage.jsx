import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import logo from "@/assets/logo.svg";
import { getErrorMessage } from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import FormField, { inputBase } from "@/components/common/FormField";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Already logged in (or just logged in): leave this page
  if (!loading && user) {
    const target = user.mustChangePassword
      ? "/change-password"
      : location.state?.from?.pathname || "/dashboard";
    return <Navigate to={target} replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password); // the redirect happens above once `user` is set
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app p-4">
      <ThemeToggle className="absolute end-4 top-4" />

      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-xl sm:p-8 dark:shadow-2xl">
        <div className="mb-8 text-center">
          <img src={logo} alt="" className="mx-auto mb-4 h-14 w-14 rounded-xl" />
          <h1 className="text-xl font-bold text-fg">Road Accident Management</h1>
          <p className="mt-1 text-sm text-muted">Kabul, Afghanistan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert>{error}</Alert>}

          <FormField label="Email" htmlFor="email">
            <div className="relative">
              <Mail size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${inputBase} ps-10 pe-3`}
              />
            </div>
          </FormField>

          <FormField label="Password" htmlFor="password">
            <div className="relative">
              <Lock size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                className={`${inputBase} ps-10 pe-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-subtle hover:text-fg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-subtle">
          Accounts are created by the administrator.
        </p>
      </div>
    </div>
  );
}