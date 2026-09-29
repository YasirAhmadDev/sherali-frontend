import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/common/Button";
import { inputClass } from "@/components/common/FormField";
import { useOptions } from "@/hooks/useOptions";
import { VEHICLE_TYPE_VALUES } from "@/utils/constants";

const MAX_VEHICLES = 10;

// vehicles = [{ type: "car", plate: "KBL 1234" }, ...]
export default function VehicleFields({ vehicles, onChange }) {
  const { t } = useTranslation();
  const vehicleTypes = useOptions(VEHICLE_TYPE_VALUES, "vehicleTypes");

  const update = (index, field, value) =>
    onChange(vehicles.map((v, i) => (i === index ? { ...v, [field]: value } : v)));

  const remove = (index) => onChange(vehicles.filter((_, i) => i !== index));

  const add = () => onChange([...vehicles, { type: "car", plate: "" }]);

  return (
    <div className="space-y-3">
      {vehicles.length === 0 && (
        <p className="text-sm text-muted">No vehicles added. Add the vehicles involved in the accident.</p>
      )}

      {vehicles.map((vehicle, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 rounded-lg border border-line p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:border-0 sm:p-0"
        >
          <select
            value={vehicle.type}
            onChange={(e) => update(index, "type", e.target.value)}
            className={inputClass}
            aria-label={`Vehicle ${index + 1} type`}
          >
            {vehicleTypes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>

          <input
            value={vehicle.plate}
            onChange={(e) => update(index, "plate", e.target.value)}
            placeholder="Plate number (optional)"
            maxLength={20}
            className={inputClass}
            aria-label={`Vehicle ${index + 1} plate number`}
          />

          <Button
            variant="ghost"
            onClick={() => remove(index)}
            aria-label="Remove vehicle"
            className="justify-self-end"
          >
            <Trash2 size={18} className="text-red-500" />
          </Button>
        </div>
      ))}

      {vehicles.length < MAX_VEHICLES && (
        <Button variant="secondary" size="sm" icon={Plus} onClick={add}>
          Add vehicle
        </Button>
      )}
    </div>
  );
}