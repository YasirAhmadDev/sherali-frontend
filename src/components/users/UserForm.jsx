import { useState } from "react";

import { getErrorMessage } from "@/api/axios";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import FormField, { inputClass } from "@/components/common/FormField";
import TempPasswordField from "@/components/users/TempPasswordField";
import { DISTRICT_OPTIONS, ROLE_OPTIONS } from "@/utils/constants";

// Props:
//   user      -> pass it to EDIT, leave empty to CREATE
//   isSelf    -> true when the admin edits their own account (role cannot be changed)
//   onSubmit(payload) -> promise
export default function UserForm({ user, isSelf = false, onSubmit, onCancel }) {
  const isEdit = Boolean(user);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "officer",
    district: user?.district ?? "",
    badgeNumber: user?.badgeNumber ?? "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter the full name";
    if (!isEdit) {
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email";
      if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    }
    return e;
  };

  const buildPayload = () => {
    if (isEdit) {
      return {
        name: form.name.trim(),
        role: form.role,
        district: form.district || null, // null clears it
        badgeNumber: form.badgeNumber.trim() || null,
      };
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    };
    if (form.district) payload.district = form.district;
    if (form.badgeNumber.trim()) payload.badgeNumber = form.badgeNumber.trim();
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setFormError("");
    setSaving(true);
    try {
      await onSubmit(buildPayload());
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && <Alert>{formError}</Alert>}

      <FormField label="Full name" htmlFor="name" required error={errors.name}>
        <input id="name" name="name" value={form.name} onChange={handleChange} maxLength={80} className={inputClass} />
      </FormField>

      <FormField label="Email" htmlFor="email" required={!isEdit} error={errors.email} hint={isEdit ? "The email cannot be changed" : undefined}>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={isEdit}
          autoComplete="off"
          className={inputClass}
        />
      </FormField>

      {!isEdit && (
        <TempPasswordField value={form.password} onChange={(v) => setField("password", v)} error={errors.password} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Role"
          htmlFor="role"
          required
          hint={isSelf ? "You cannot change your own role" : "Officers add records. Viewers only see statistics."}
        >
          <select id="role" name="role" value={form.role} onChange={handleChange} disabled={isSelf} className={inputClass}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="District" htmlFor="district">
          <select id="district" name="district" value={form.district} onChange={handleChange} className={inputClass}>
            <option value="">No district</option>
            {DISTRICT_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Badge number" htmlFor="badgeNumber">
        <input
          id="badgeNumber"
          name="badgeNumber"
          value={form.badgeNumber}
          onChange={handleChange}
          maxLength={30}
          placeholder="Optional"
          className={inputClass}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? "Save changes" : "Create user"}
        </Button>
      </div>
    </form>
  );
}