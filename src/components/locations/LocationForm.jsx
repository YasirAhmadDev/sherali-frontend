import { useState } from "react";

import { getErrorMessage } from "@/api/axios";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import FormField, { inputClass } from "@/components/common/FormField";
import { DISTRICT_OPTIONS, KABUL_BOUNDS } from "@/utils/constants";

// Props: location (pass it to EDIT), onSubmit(payload) -> promise, onCancel
export default function LocationForm({ location, onSubmit, onCancel }) {
  const isEdit = Boolean(location);

  const [form, setForm] = useState({
    name: location?.name ?? "",
    district: location?.district ?? "",
    lat: location ? String(location.lat) : "",
    lng: location ? String(location.lng) : "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e = {};
    const { minLat, maxLat, minLng, maxLng } = KABUL_BOUNDS;

    if (form.name.trim().length < 2) e.name = "Enter the location name";
    if (!form.district) e.district = "Select a district";

    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (form.lat === "" || Number.isNaN(lat) || lat < minLat || lat > maxLat) {
      e.lat = `Latitude must be between ${minLat} and ${maxLat}`;
    }
    if (form.lng === "" || Number.isNaN(lng) || lng < minLng || lng > maxLng) {
      e.lng = `Longitude must be between ${minLng} and ${maxLng}`;
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setFormError("");
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        district: form.district,
        lat: Number(form.lat),
        lng: Number(form.lng),
      });
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && <Alert>{formError}</Alert>}

      <FormField label="Location name" htmlFor="name" required error={errors.name}>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={120}
          placeholder="e.g. Karte Parwan"
          className={inputClass}
        />
      </FormField>

      <FormField label="District" htmlFor="district" required error={errors.district}>
        <select id="district" name="district" value={form.district} onChange={handleChange} className={inputClass}>
          <option value="">Select district</option>
          {DISTRICT_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Latitude" htmlFor="lat" required error={errors.lat}>
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            inputMode="decimal"
            value={form.lat}
            onChange={handleChange}
            placeholder="34.5553"
            className={inputClass}
          />
        </FormField>

        <FormField label="Longitude" htmlFor="lng" required error={errors.lng}>
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            inputMode="decimal"
            value={form.lng}
            onChange={handleChange}
            placeholder="69.2075"
            className={inputClass}
          />
        </FormField>
      </div>
      <p className="text-xs text-subtle">
        Tip: in Google Maps, right-click the spot and click the numbers at the top of the menu to copy
        them (first number = latitude, second = longitude).
      </p>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? "Save changes" : "Add location"}
        </Button>
      </div>
    </form>
  );
}