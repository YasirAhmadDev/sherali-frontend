import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Card from "@/components/common/Card";
import SeverityBadge from "@/components/accidents/SeverityBadge";
import { ACCIDENT_TYPES } from "@/utils/constants";
import { formatDateTime, labelFor } from "@/utils/formatters";

const th = "px-2 py-2 text-start text-xs font-medium text-muted";
const td = "px-2 py-3";

export default function RecentAccidents({ accidents = [] }) {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent Accidents"
      action={
        <Link to="/accidents" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
          View All <ArrowRight size={14} />
        </Link>
      }
    >
      {accidents.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No accidents recorded yet.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className={th}>Date &amp; Time</th>
                <th className={th}>Location</th>
                <th className={`${th} hidden md:table-cell`}>Type</th>
                <th className={`${th} hidden sm:table-cell`}>Injured</th>
                <th className={`${th} hidden sm:table-cell`}>Fatalities</th>
                <th className={th}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {accidents.map((a) => (
                <tr
                  key={a._id}
                  tabIndex={0}
                  onClick={() => navigate(`/accidents/${a._id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/accidents/${a._id}`)}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-line/40 focus:bg-line/40 focus:outline-none"
                >
                  <td className={`${td} whitespace-nowrap text-fg`}>{formatDateTime(a.date)}</td>
                  <td className={`${td} text-fg`}>{a.location?.name || a.roadName || a.district}</td>
                  <td className={`${td} hidden text-muted md:table-cell`}>{labelFor(ACCIDENT_TYPES, a.type)}</td>
                  <td className={`${td} hidden text-fg sm:table-cell`}>{a.injured}</td>
                  <td className={`${td} hidden text-fg sm:table-cell`}>{a.deaths}</td>
                  <td className={td}>
                    <SeverityBadge severity={a.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}