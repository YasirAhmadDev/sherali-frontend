import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import FormField, { inputClass } from "@/components/common/FormField";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function ChangePasswordPage() {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 8) {
      return setError("New password must be at least 8 characters");
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError("New password and confirmation do not match");
    }

    setSubmitting(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      toast.success("Password changed");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app p-4">
      <ThemeToggle className="absolute end-4 top-4" />

      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-xl sm:p-8 dark:shadow-2xl">
        <h1 className="text-xl font-bold text-fg">Change password</h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          {user?.mustChangePassword
            ? "For security, you must set a new password before you continue."
            : "Choose a new password for your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert>{error}</Alert>}

          <FormField label="Current password" htmlFor="currentPassword" required>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              value={form.currentPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label="New password" htmlFor="newPassword" hint="At least 8 characters" required>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={form.newPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label="Confirm new password" htmlFor="confirmPassword" required>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Save new password
          </Button>
        </form>

        <button
          onClick={logout}
          className="mt-4 w-full text-center text-sm text-subtle hover:text-fg"
        >
          Log out
        </button>
      </div>
    </div>
  );
}