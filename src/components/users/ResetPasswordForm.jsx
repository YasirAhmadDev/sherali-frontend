import { useState } from "react";

import { getErrorMessage } from "@/api/axios";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import TempPasswordField from "@/components/users/TempPasswordField";

// Props: user, onSubmit(newPassword) -> promise, onCancel
export default function ResetPasswordForm({ user, onSubmit, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setError("");
    setFormError("");
    setSaving(true);
    try {
      await onSubmit(password);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-muted">
        Set a new temporary password for <b className="text-fg">{user.name}</b>. Give it to them in person or
        by phone. They will be asked to change it at their next login.
      </p>

      {formError && <Alert>{formError}</Alert>}

      <TempPasswordField
        id="newPassword"
        label="New temporary password"
        value={password}
        onChange={(v) => {
          setPassword(v);
          setError("");
        }}
        error={error}
      />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Reset password
        </Button>
      </div>
    </form>
  );
}