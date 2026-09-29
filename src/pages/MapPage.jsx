import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getMapPoints } from "@/api/stats.api";
import { useFetch } from "@/hooks/useFetch";
import { cleanParams } from "@/utils/params";

import Alert from "@/components/common/Alert";
import Card from "@/components/common/Card";
import PageHeader from "@/components/common/PageHeader";
import AccidentMap, { SEVERITY_COLORS } from "@/components/map/AccidentMap";
import ReportFilters, { EMPTY_REPORT_FILTERS } from "@/components/reports/ReportFilters";

const LEGEND = [
  { key: "low", labelKey: "low" },
  { key: "medium", labelKey: "medium" },
  { key: "high", labelKey: "high" },
];

export default function MapPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(EMPTY_REPORT_FILTERS);
  const params = useMemo(() => cleanParams(filters), [filters]);

  const { data: points, loading, error } = useFetch(() => getMapPoints(params), [JSON.stringify(params)]);

  return (
    <>
      <PageHeader title={t("nav.map")} subtitle="Where accidents happen. Clusters of dots show dangerous spots." />

      <Card className="mb-4">
        <ReportFilters filters={filters} onChange={setFilters} />
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          {points ? `${points.length} accident${points.length === 1 ? "" : "s"} on the map` : "Loading..."}
        </p>
        <div className="flex items-center gap-4">
          {LEGEND.map(({ key, labelKey }) => (
            <span key={key} className="flex items-center gap-1.5 text-muted">
              <span className="h-3 w-3 rounded-full" style={{ background: SEVERITY_COLORS[key] }} />
              {t(`severity.${labelKey}`)}
            </span>
          ))}
        </div>
      </div>

      {/* "isolate" keeps the map layers below the sidebar, menus and popups of the app */}
      <div className="relative isolate overflow-hidden rounded-xl border border-line">
        {loading && (
          <div className="absolute end-3 top-3 z-[1100] rounded-full bg-card px-3 py-1 text-xs text-muted shadow">
            Updating...
          </div>
        )}
        <AccidentMap points={points ?? []} />
      </div>

      <p className="mt-3 text-xs text-subtle">
        Only accidents that have coordinates appear here. Officers can add them with the location list or the
        "Use my current location" button.
      </p>
    </>
  );
}