// These values mirror the backend (server/src/utils/constants.js).
// Options are { value, label } so they plug straight into <select> dropdowns.

export const ROLES = { ADMIN: "admin", OFFICER: "officer", VIEWER: "viewer" };
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.OFFICER];

// Kabul police districts PD1 ... PD22
export const DISTRICTS = Array.from({ length: 22 }, (_, i) => `PD${i + 1}`);
export const DISTRICT_OPTIONS = DISTRICTS.map((d) => ({ value: d, label: d }));

export const MAX_PHOTOS = 5;

// Map defaults (centre of Kabul)
export const KABUL_CENTER = [34.5553, 69.2075];
export const DEFAULT_MAP_ZOOM = 12;

// Same limits as the backend uses to reject coordinates outside Kabul
export const KABUL_BOUNDS = { minLat: 34.35, maxLat: 34.7, minLng: 68.95, maxLng: 69.45 };

export const PAGE_SIZE = 15;

// ---- Translated dropdown options ----
// Value lists (fixed, sent to the backend as-is)
export const ROLE_VALUES = ["admin", "officer", "viewer"];
export const ACCIDENT_TYPE_VALUES = ["collision", "pedestrian", "rollover", "hit_and_run", "other"];
export const ACCIDENT_CAUSE_VALUES = ["speeding", "wrong_way", "mechanical", "distracted", "other"];
export const VEHICLE_TYPE_VALUES = ["car", "motorcycle", "rickshaw", "bus", "truck", "van", "bicycle", "other"];
export const SEVERITY_VALUES = ["low", "medium", "high"];

// Builds [{ value, label }] using the current language.
// Usage inside a component:  const roleOptions = useOptions(ROLE_VALUES, "roles");
export const buildOptions = (values, namespace, t) =>
  values.map((value) => ({ value, label: t(`${namespace}.${value}`) }));

// ---- TEMPORARY: kept so pages not yet migrated to i18n keep working ----
// (English only). These will be deleted once every page uses useOptions()/translateValue() instead.
export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "officer", label: "Officer" },
  { value: "viewer", label: "Viewer" },
];

export const ACCIDENT_TYPES = [
  { value: "collision", label: "Collision" },
  { value: "pedestrian", label: "Pedestrian" },
  { value: "rollover", label: "Rollover" },
  { value: "hit_and_run", label: "Hit & Run" },
  { value: "other", label: "Other" },
];

export const ACCIDENT_CAUSES = [
  { value: "speeding", label: "Speeding" },
  { value: "wrong_way", label: "Wrong-way driving" },
  { value: "mechanical", label: "Mechanical failure" },
  { value: "distracted", label: "Distracted driving" },
  { value: "other", label: "Other" },
];

export const VEHICLE_TYPES = [
  { value: "car", label: "Car" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "rickshaw", label: "Rickshaw" },
  { value: "bus", label: "Bus" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
  { value: "bicycle", label: "Bicycle" },
  { value: "other", label: "Other" },
];

export const SEVERITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];