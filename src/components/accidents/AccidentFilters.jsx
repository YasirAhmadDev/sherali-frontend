import { useState } from "react";
import { Filter, RotateCcw, Search } from "lucide-react";

import Button from "@/components/common/Button";
import { inputBase, inputClass } from "@/components/common/FormField";
import { ACCIDENT_CAUSES, ACCIDENT_TYPES, DISTRICT_OPTIONS, SEVERITIES } from "@/utils/constants";

export const EMPTY_FILTERS = {
  search: "",
  from: "",
  to: "",
  district: "",
  type: "",
  cause: "",
  severity: "",
};

function SelectFilter({ label, name, value, onChange, options, allLabel }) {
  return (
    <div>
      <label htmlFor={`filter-${name}`} className="mb-1 block text-xs font-medium text-muted">
        {label}
      </label>
      <select id={`filter-${name}`} name={name} value={value} onChange={onChange} className={inputClass}>
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

export default function AccidentFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false); // filters panel on phones
  const hasActive = Object.values(filters).some(Boolean);

  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      {/* Search is always visible. The "Filters" button only shows on phones. */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by road name..."
            className={`${inputBase} ps-10 pe-3`}
            aria-label="Search by road name"
          />
        </div>
        <Button variant="secondary" icon={Filter} onClick={() => setOpen((v) => !v)} className="md:hidden">
          Filters
        </Button>
      </div>

      <div className={`${open ? "grid" : "hidden"} grid-cols-1 gap-3 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-6`}>
        <div>
          <label htmlFor="filter-from" className="mb-1 block text-xs font-medium text-muted">
            From
          </label>
          <input id="filter-from" type="date" name="from" value={filters.from} max={filters.to || undefined} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="filter-to" className="mb-1 block text-xs font-medium text-muted">
            To
          </label>
          <input id="filter-to" type="date" name="to" value={filters.to} min={filters.from || undefined} onChange={handleChange} className={inputClass} />
        </div>
        <SelectFilter label="District" name="district" value={filters.district} onChange={handleChange} options={DISTRICT_OPTIONS} allLabel="All districts" />
        <SelectFilter label="Type" name="type" value={filters.type} onChange={handleChange} options={ACCIDENT_TYPES} allLabel="All types" />
        <SelectFilter label="Cause" name="cause" value={filters.cause} onChange={handleChange} options={ACCIDENT_CAUSES} allLabel="All causes" />
        <SelectFilter label="Severity" name="severity" value={filters.severity} onChange={handleChange} options={SEVERITIES} allLabel="All severities" />
      </div>

      {hasActive && (
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => onChange(EMPTY_FILTERS)}>
          Reset filters
        </Button>
      )}
    </div>
  );
}