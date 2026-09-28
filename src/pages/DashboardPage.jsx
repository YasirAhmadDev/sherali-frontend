import { useMemo, useState } from "react";
import { Calendar, Car, HeartPulse, MapPin, Skull } from "lucide-react";

import { getDashboardStats } from "@/api/stats.api";
import { useFetch } from "@/hooks/useFetch";
import { formatLongDate, formatTime, getKabulMonth, getKabulYear } from "@/utils/formatters";

import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import RecentAccidents from "@/components/dashboard/RecentAccidents";
import QuickActions from "@/components/dashboard/QuickActions";
import CityBanner from "@/components/dashboard/CityBanner";

// key = field name inside `data.cards` (from the backend)
const CARDS = [
  { key: "totalAccidents", label: "Total Accidents", icon: Car, tone: "green", goodWhen: "down" },
  { key: "injured", label: "Injured People", icon: HeartPulse, tone: "red", goodWhen: "down" },
  { key: "deaths", label: "Fatalities", icon: Skull, tone: "yellow", goodWhen: "down" },
  { key: "locations", label: "Locations", icon: MapPin, tone: "blue", goodWhen: "neutral" },
];

export default function DashboardPage() {
  const currentYear = getKabulYear();
  const [year, setYear] = useState(currentYear);
  const { data, loading, error, reload, updatedAt } = useFetch(() => getDashboardStats(year), [year]);

  // For the current year, hide future months so the chart does not drop to zero
  const perMonth = useMemo(() => {
    if (!data) return [];
    return data.year === currentYear ? data.perMonth.slice(0, getKabulMonth()) : data.perMonth;
  }, [data, currentYear]);

  const header = (
    <PageHeader
      title="Dashboard"
      subtitle="Overview of road accidents in Kabul"
      action={
        <div className="text-sm sm:text-end">
          <p className="flex items-center gap-2 font-medium text-fg sm:justify-end">
            <Calendar size={16} className="text-muted" />
            {formatLongDate()}
          </p>
          {updatedAt && <p className="mt-0.5 text-xs text-subtle">Last updated: {formatTime(updatedAt)}</p>}
        </div>
      }
    />
  );

  if (!data && loading) {
    return (
      <>
        {header}
        <Loader />
      </>
    );
  }

  if (!data && error) {
    return (
      <>
        {header}
        <Alert>{error}</Alert>
        <Button onClick={reload} variant="secondary" className="mt-4">
          Try again
        </Button>
      </>
    );
  }

  return (
    <>
      {header}

      <div className={`space-y-6 transition-opacity ${loading ? "opacity-60" : ""}`}>
        {/* 4 stat cards: 1 column on phones, 2 on tablets, 4 on desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CARDS.map(({ key, ...card }) => (
            <StatCard
              key={key}
              {...card}
              value={data.cards[key].value}
              change={data.cards[key].change}
            />
          ))}
        </div>

        {/* Chart + table on the left, actions + banner on the right (stacked on smaller screens) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <MonthlyChart
              data={perMonth}
              year={year}
              yearOptions={[currentYear, currentYear - 1, currentYear - 2]}
              onYearChange={setYear}
            />
            <RecentAccidents accidents={data.recent} />
          </div>

          <div className="space-y-6">
            <QuickActions />
            <CityBanner />
          </div>
        </div>
      </div>
    </>
  );
}