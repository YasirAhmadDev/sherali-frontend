// All dates are shown in Kabul time, whatever the computer's timezone is.
const TZ = "Asia/Kabul";

export const formatNumber = (n) => new Intl.NumberFormat("en-US").format(n ?? 0);

// "2026-09-25 14:30"
export const formatDateTime = (date) =>
  date
    ? new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, dateStyle: "short", timeStyle: "short" }).format(
        new Date(date)
      )
    : "-";

// "2026-09-25"
export const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, dateStyle: "short" }).format(new Date(date))
    : "-";

// "10:24"
export const formatTime = (date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(
    new Date(date)
  );

// "September 28, 2026"
export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "long", day: "numeric" }).format(
    date
  );

export const getKabulYear = () =>
  Number(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric" }).format(new Date()));

export const getKabulMonth = () =>
  Number(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month: "numeric" }).format(new Date()));

// Finds the label of a value in an options list: labelFor(ACCIDENT_TYPES, "hit_and_run") -> "Hit & Run"
export const labelFor = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value ?? "-";

// <input type="datetime-local"> helpers (used by the accident form)
export const toKabulInputValue = (date) =>
  date ? formatDateTime(date).replace(" ", "T") : "";

export const fromKabulInputValue = (value) =>
  value ? new Date(`${value}:00+04:30`).toISOString() : undefined;

export const nowKabulInputValue = () => toKabulInputValue(new Date());