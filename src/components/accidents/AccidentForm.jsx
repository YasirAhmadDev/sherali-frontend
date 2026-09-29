import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/api/axios";
import PhotoUploader from "@/components/accidents/PhotoUploader";
import SeverityBadge from "@/components/accidents/SeverityBadge";
import VehicleFields from "@/components/accidents/VehicleFields";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField, { inputClass } from "@/components/common/FormField";
import { useOptions } from "@/hooks/useOptions";
import {
  ACCIDENT_CAUSE_VALUES,
  ACCIDENT_TYPE_VALUES,
  DISTRICT_OPTIONS,
} from "@/utils/constants";
import { fromKabulInputValue, nowKabulInputValue, toKabulInputValue } from "@/utils/formatters";

const emptyForm = () => ({
  date: nowKabulInputValue(),
  district: "",
  location: "",
  roadName: "",
  type: "",
  cause: "",
  vehicles: [],
  injured: "0",
  deaths: "0",
  notes: "",
});

// Accident from the API -> form values (inputs always work with strings)
const fromAccident = (a) => ({
  date: toKabulInputValue(a.date),
  district: a.district || "",
  location: a.location?._id || "",
  roadName: a.roadName || "",
  type: a.type || "",
  cause: a.cause || "",
  vehicles: (a.vehicles || []).map((v) => ({ type: v.type, plate: v.plate || "" })),
  injured: String(a.injured ?? 0),
  deaths: String(a.deaths ?? 0),
  notes: a.notes || "",
});

// Same rule as the backend (shown to the officer as a preview)
const previewSeverity = (injured, deaths) => {
  if (Number(deaths) >= 1) return "high";
  if (Number(injured) >= 3) return "medium";
  return "low";
};

// Props:
//   accident   -> pass it to EDIT, leave empty to ADD
//   locations  -> list from GET /locations
//   onSubmit(payload, { newFiles, removedPhotos })  -> must return a promise
//   onCancel
export default function AccidentForm({
  accident,
  locations = [],
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const { t } = useTranslation();
  const accidentTypes = useOptions(ACCIDENT_TYPE_VALUES, "accidentTypes");
  const accidentCauses = useOptions(ACCIDENT_CAUSE_VALUES, "accidentCauses");
  const isEdit = Boolean(accident);
  const resolvedSubmitLabel = submitLabel || t("common.save");

  const [form, setForm] = useState(() => (accident ? fromAccident(accident) : emptyForm()));
  const [existingPhotos, setExistingPhotos] = useState(accident?.photos ?? []);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const handleChange = (e) => setField(e.target.name, e.target.value);

  // Picking a location fills the district automatically. Coordinates are
  // filled in on the server from the location, so the form does not need them.
  const handleLocationChange = (e) => {
    const id = e.target.value;
    const loc = locations.find((l) => l._id === id);
    setForm((f) => ({
      ...f,
      location: id,
      ...(loc && { district: loc.district }),
    }));
    setErrors((prev) => ({ ...prev, location: undefined, place: undefined, district: undefined }));
  };

  const validate = () => {
    const e = {};

    if (!form.date) e.date = "Date and time are required";
    else if (new Date(fromKabulInputValue(form.date)).getTime() > Date.now() + 5 * 60 * 1000) {
      e.date = "Date cannot be in the future";
    }
    if (!form.district) e.district = "Select a district";
    if (!form.type) e.type = "Select the accident type";
    if (!form.cause) e.cause = "Select the cause";

    if (!form.location && !form.roadName.trim()) {
      e.place = "Choose a location, or type the road name";
    }

    for (const field of ["injured", "deaths"]) {
      const n = Number(form[field]);
      if (form[field] === "" || !Number.isInteger(n) || n < 0 || n > 500) {
        e[field] = "Enter a whole number (0 or more)";
      }
    }
    return e;
  };

  const buildPayload = () => {
    const payload = {
      date: fromKabulInputValue(form.date),
      district: form.district,
      type: form.type,
      cause: form.cause,
      injured: Number(form.injured),
      deaths: Number(form.deaths),
      vehicles: form.vehicles.map((v) => {
        const plate = v.plate.trim();
        return plate ? { type: v.type, plate } : { type: v.type };
      }),
    };
    if (form.location) payload.location = form.location;
    // When editing, always send these two so the officer can clear them
    if (isEdit || form.roadName.trim()) payload.roadName = form.roadName.trim();
    if (isEdit || form.notes.trim()) payload.notes = form.notes.trim();
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setFormError("");
    setSaving(true);
    try {
      await onSubmit(buildPayload(), { newFiles, removedPhotos });
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const severity = previewSeverity(form.injured, form.deaths);
  // Once an accident has a location it cannot be removed (only changed)
  const canLeaveLocationEmpty = !accident?.location;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formError && <Alert>{formError}</Alert>}

      {/* When and where */}
      <Card title="When & where">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Date & time" htmlFor="date" required error={errors.date}>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={form.date}
              max={nowKabulInputValue()}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label={t("table.district")} htmlFor="district" required error={errors.district}>
            <select id="district" name="district" value={form.district} onChange={handleChange} className={inputClass}>
              <option value="">Select district</option>
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t("table.location")} htmlFor="location" hint="Known places, managed by the admin">
            <select id="location" name="location" value={form.location} onChange={handleLocationChange} className={inputClass}>
              {canLeaveLocationEmpty && <option value="">No listed location</option>}
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name} ({l.district})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Road / street name" htmlFor="roadName">
            <input
              id="roadName"
              name="roadName"
              value={form.roadName}
              onChange={handleChange}
              maxLength={150}
              placeholder="e.g. Karte Parwan main road"
              className={inputClass}
            />
          </FormField>
        </div>

        {errors.place && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.place}</p>}
      </Card>

      {/* What happened */}
      <Card title="What happened">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("table.type")} htmlFor="type" required error={errors.type}>
            <select id="type" name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="">Select type</option>
              {accidentTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t("table.cause")} htmlFor="cause" required error={errors.cause}>
            <select id="cause" name="cause" value={form.cause} onChange={handleChange} className={inputClass}>
              <option value="">Select cause</option>
              {accidentCauses.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Card>

      {/* Vehicles */}
      <Card title="Vehicles involved">
        <VehicleFields vehicles={form.vehicles} onChange={(vehicles) => setField("vehicles", vehicles)} />
      </Card>

      {/* People */}
      <Card
        title="People affected"
        action={
          <div className="flex items-center gap-2 text-xs text-muted">
            {t("table.severity")} <SeverityBadge severity={severity} />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("table.injured")} htmlFor="injured" error={errors.injured}>
            <input
              id="injured"
              name="injured"
              type="number"
              min="0"
              inputMode="numeric"
              value={form.injured}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <FormField label={t("table.deaths")} htmlFor="deaths" error={errors.deaths}>
            <input
              id="deaths"
              name="deaths"
              type="number"
              min="0"
              inputMode="numeric"
              value={form.deaths}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
        </div>
        <p className="mt-3 text-xs text-subtle">
          Severity is calculated automatically: High = any death, Medium = 3 or more injured, otherwise Low.
        </p>
      </Card>

      {/* Notes */}
      <Card title="Notes">
        <textarea
          name="notes"
          rows={4}
          value={form.notes}
          onChange={handleChange}
          maxLength={1000}
          placeholder="Anything else worth recording (weather, road condition...)"
          className={inputClass}
          aria-label="Notes"
        />
        <p className="mt-1 text-end text-xs text-subtle">{form.notes.length}/1000</p>
      </Card>

      {/* Photos */}
      <Card title="Photos">
        <PhotoUploader
          existing={existingPhotos}
          newFiles={newFiles}
          onAddFiles={(files) => setNewFiles((current) => [...current, ...files])}
          onRemoveNew={(index) => setNewFiles((current) => current.filter((_, i) => i !== index))}
          onRemoveExisting={(filename) => {
            setExistingPhotos((current) => current.filter((f) => f !== filename));
            setRemovedPhotos((current) => [...current, filename]);
          }}
        />
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="lg" onClick={onCancel} disabled={saving}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" size="lg" loading={saving}>
          {resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
}