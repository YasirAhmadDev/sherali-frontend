import { BarChart3, Car, HeartPulse, Skull } from "lucide-react";

import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import Table, { tdClass, thClass } from "@/components/common/Table";
import { formatNumber } from "@/utils/formatters";

const STATS = [
  { key: "accidents", label: "Accidents", icon: Car, tone: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { key: "injured", label: "Injured", icon: HeartPulse, tone: "bg-red-500/15 text-red-600 dark:text-red-400" },
  { key: "deaths", label: "Deaths", icon: Skull, tone: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400" },
];

// summary = { totals: { accidents, injured, deaths }, byDistrict: [{ district, accidents, injured, deaths }] }
export default function SummaryTable({ summary }) {
  const { totals, byDistrict } = summary;
  const max = Math.max(...byDistrict.map((d) => d.accidents), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ key, label, icon: Icon, tone }) => (
          <Card key={key}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="text-2xl font-bold text-fg">{formatNumber(totals[key])}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {byDistrict.length === 0 ? (
        <EmptyState icon={BarChart3} title="No data for these filters" message="Try a wider date range." />
      ) : (
        <div>
          <h2 className="mb-3 font-semibold text-fg">By district</h2>
          <Table>
            <thead className="border-b border-line">
              <tr>
                <th className={thClass}>District</th>
                <th className={thClass}>Accidents</th>
                <th className={thClass}>Injured</th>
                <th className={thClass}>Deaths</th>
              </tr>
            </thead>
            <tbody>
              {byDistrict.map((d) => (
                <tr key={d.district} className="border-b border-line/60 last:border-0">
                  <td className={`${tdClass} font-medium text-fg`}>{d.district}</td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-fg">{d.accidents}</span>
                      <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-line sm:block md:w-40">
                        <div className="h-full rounded-full bg-brand-light" style={{ width: `${(d.accidents / max) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className={`${tdClass} text-fg`}>{d.injured}</td>
                  <td className={`${tdClass} text-fg`}>{d.deaths}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}