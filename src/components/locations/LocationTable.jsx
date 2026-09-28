import { Ban, Pencil, RotateCcw } from "lucide-react";

import Badge from "@/components/common/Badge";
import Table, { tdClass, thClass } from "@/components/common/Table";

const iconButton = "rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-fg";
const coords = (l) => `${Number(l.lat).toFixed(4)}, ${Number(l.lng).toFixed(4)}`;

// Phones: cards. Tablets and desktop: a table. Action buttons show for admins only.
export default function LocationTable({ locations, isAdmin, onEdit, onDeactivate, onActivate }) {
  const actions = (l) =>
    isAdmin && (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => onEdit(l)} className={iconButton} aria-label="Edit location">
          <Pencil size={16} />
        </button>
        {l.isActive ? (
          <button
            onClick={() => onDeactivate(l)}
            className={`${iconButton} hover:text-red-500`}
            aria-label="Deactivate location"
          >
            <Ban size={16} />
          </button>
        ) : (
          <button
            onClick={() => onActivate(l)}
            className={`${iconButton} hover:text-accent`}
            aria-label="Activate location"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    );

  const status = (l) => <Badge color={l.isActive ? "green" : "gray"}>{l.isActive ? "Active" : "Inactive"}</Badge>;

  return (
    <>
      {/* Phones */}
      <div className="space-y-3 md:hidden">
        {locations.map((l) => (
          <div key={l._id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-fg">{l.name}</p>
              {isAdmin && status(l)}
            </div>
            <p className="text-sm text-muted">
              {l.district} · {coords(l)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-fg">
                <b>{l.accidentCount}</b> accident{l.accidentCount === 1 ? "" : "s"}
              </p>
              {actions(l)}
            </div>
          </div>
        ))}
      </div>

      {/* Tablet + desktop */}
      <Table className="hidden md:block">
        <thead className="border-b border-line">
          <tr>
            <th className={thClass}>Name</th>
            <th className={thClass}>District</th>
            <th className={thClass}>Coordinates</th>
            <th className={thClass}>Accidents</th>
            {isAdmin && <th className={thClass}>Status</th>}
            {isAdmin && <th className={thClass} />}
          </tr>
        </thead>
        <tbody>
          {locations.map((l) => (
            <tr key={l._id} className="border-b border-line/60 last:border-0 hover:bg-line/40">
              <td className={`${tdClass} font-medium text-fg`}>{l.name}</td>
              <td className={`${tdClass} text-muted`}>{l.district}</td>
              <td className={`${tdClass} font-mono text-muted`}>{coords(l)}</td>
              <td className={`${tdClass} text-fg`}>{l.accidentCount}</td>
              {isAdmin && <td className={tdClass}>{status(l)}</td>}
              {isAdmin && <td className={tdClass}>{actions(l)}</td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}