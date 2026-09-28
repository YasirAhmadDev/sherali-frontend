import { RotateCcw } from "lucide-react";

import Button from "@/components/common/Button";
import { inputClass } from "@/components/common/FormField";
import { ACCIDENT_CAUSES, ACCIDENT_TYPES, DISTRICT_OPTIONS, SEVERITIES } from "@/utils/constants";
import { formatDate, getKabulMonth, getKabulYear } from "@/utils/formatters";

export const EMPTY_REPORT_FILTERS = { from: "", to: "", district: "", type: "", cause: "", severity: "" };

// Quick date ranges (dates are in Kabul time)
const PRESETS = [
  {
    label: "Last 30 days",
    range: () => ({ from: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), to: formatDate(new Date()) }),
  },
  {
    label: "This month",
    range: () => ({
      from: `${getKabulYear()}-${String(getKabulMonth()).padStart(2, "0")}-01`,
      to: formatDate(new Date()),
    }),
  },
  {
    label: "This year",
    range: () => ({ from: `${getKabulYear()}-01-01`, to: formatDate(new Date()) }),
  },
];

function SelectFilter({ label, name, value, onChange, options, allLabel }) {
  return (
    <div>
      <label htmlFor={`report-${name}`} className="mb-1 block text-xs font-medium text-muted">
        {label}
      </label>
      <select id={`report-${name}`} name={name} value={value} onChange={onChange} className={inputClass}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ReportFilters({ filters, onChange }) {
  const hasActive = Object.values(filters).some(Boolean);
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">Quick range:</span>
        {PRESETS.map((preset) => (
          <Button key={preset.label} variant="secondary" size="sm" onClick={() => onChange({ ...filters, ...preset.range() })}>
            {preset.label}
          </Button>
        ))}
        {hasActive && (
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => onChange(EMPTY_REPORT_FILTERS)}>
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="report-from" className="mb-1 block text-xs font-medium text-muted">
            From
          </label>
          <input id="report-from" type="date" name="from" value={filters.from} max={filters.to || undefined} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="report-to" className="mb-1 block text-xs font-medium text-muted">
            To
          </label>
          <input id="report-to" type="date" name="to" value={filters.to} min={filters.from || undefined} onChange={handleChange} className={inputClass} />
        </div>
        <SelectFilter label="District" name="district" value={filters.district} onChange={handleChange} options={DISTRICT_OPTIONS} allLabel="All districts" />
        <SelectFilter label="Type" name="type" value={filters.type} onChange={handleChange} options={ACCIDENT_TYPES} allLabel="All types" />
        <SelectFilter label="Cause" name="cause" value={filters.cause} onChange={handleChange} options={ACCIDENT_CAUSES} allLabel="All causes" />
        <SelectFilter label="Severity" name="severity" value={filters.severity} onChange={handleChange} options={SEVERITIES} allLabel="All severities" />
      </div>
    </div>
  );
}