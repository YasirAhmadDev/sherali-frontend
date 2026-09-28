import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import SeverityBadge from "@/components/accidents/SeverityBadge";
import Table, { tdClass, thClass } from "@/components/common/Table";
import { ACCIDENT_CAUSES, ACCIDENT_TYPES, ROLES } from "@/utils/constants";
import { formatDateTime, labelFor } from "@/utils/formatters";
import { canDeleteAccident, canEditAccident } from "@/utils/permissions";

const iconButton = "rounded-lg p-2 transition-colors hover:bg-line";
const placeOf = (a) => a.location?.name || a.roadName || "-";

// Phones: a list of cards. Tablets and desktop: a table.
export default function AccidentTable({ accidents, user, onDelete }) {
  const navigate = useNavigate();
  const showActions = user?.role !== ROLES.VIEWER;

  const open = (a) => navigate(`/accidents/${a._id}`);
  const stop = (fn) => (e) => {
    e.stopPropagation(); // do not open the detail page when clicking an action button
    fn();
  };

  const actions = (a) => (
    <div className="flex items-center justify-end gap-1">
      {canEditAccident(user, a) && (
        <button
          onClick={stop(() => navigate(`/accidents/${a._id}/edit`))}
          className={`${iconButton} text-muted hover:text-fg`}
          aria-label="Edit accident"
        >
          <Pencil size={16} />
        </button>
      )}
      {canDeleteAccident(user) && (
        <button
          onClick={stop(() => onDelete(a))}
          className={`${iconButton} text-red-500`}
          aria-label="Delete accident"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Phones */}
      <div className="space-y-3 md:hidden">
        {accidents.map((a) => (
          <div
            key={a._id}
            onClick={() => open(a)}
            className="cursor-pointer rounded-xl border border-line bg-card p-4 active:bg-line/40"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-muted">{formatDateTime(a.date)}</p>
              <SeverityBadge severity={a.severity} />
            </div>
            <p className="mt-1 font-semibold text-fg">{placeOf(a)}</p>
            <p className="text-sm text-muted">
              {a.district} · {labelFor(ACCIDENT_TYPES, a.type)} · {labelFor(ACCIDENT_CAUSES, a.cause)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-fg">
                Injured <b>{a.injured}</b> · Deaths <b>{a.deaths}</b>
              </p>
              {showActions && actions(a)}
            </div>
          </div>
        ))}
      </div>

      {/* Tablet + desktop */}
      <Table className="hidden md:block">
        <thead className="border-b border-line">
          <tr>
            <th className={thClass}>Date &amp; Time</th>
            <th className={thClass}>Location</th>
            <th className={thClass}>District</th>
            <th className={thClass}>Type</th>
            <th className={`${thClass} hidden xl:table-cell`}>Cause</th>
            <th className={thClass}>Injured</th>
            <th className={thClass}>Deaths</th>
            <th className={thClass}>Severity</th>
            {showActions && <th className={thClass} />}
          </tr>
        </thead>
        <tbody>
          {accidents.map((a) => (
            <tr
              key={a._id}
              tabIndex={0}
              onClick={() => open(a)}
              onKeyDown={(e) => e.key === "Enter" && open(a)}
              className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-line/40 focus:bg-line/40 focus:outline-none"
            >
              <td className={`${tdClass} whitespace-nowrap text-fg`}>{formatDateTime(a.date)}</td>
              <td className={`${tdClass} text-fg`}>{placeOf(a)}</td>
              <td className={`${tdClass} text-muted`}>{a.district}</td>
              <td className={`${tdClass} text-muted`}>{labelFor(ACCIDENT_TYPES, a.type)}</td>
              <td className={`${tdClass} hidden text-muted xl:table-cell`}>{labelFor(ACCIDENT_CAUSES, a.cause)}</td>
              <td className={`${tdClass} text-fg`}>{a.injured}</td>
              <td className={`${tdClass} text-fg`}>{a.deaths}</td>
              <td className={tdClass}>
                <SeverityBadge severity={a.severity} />
              </td>
              {showActions && <td className={tdClass}>{actions(a)}</td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}