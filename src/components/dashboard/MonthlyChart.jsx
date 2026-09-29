import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import Card from "@/components/common/Card";
import { inputClass } from "@/components/common/FormField";
import { useTheme } from "@/hooks/useTheme";

// data = [{ month: "Jan", count: 17 }, ...]
export default function MonthlyChart({ data = [], year, yearOptions = [], onYearChange }) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Recharts needs real colour values (not CSS classes)
  const grid = isDark ? "#1f2937" : "#e2e8f0";
  const axis = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#111827" : "#ffffff";
  const tooltipText = isDark ? "#f1f5f9" : "#0f172a";

  return (
    <Card
      title={t("dashboard.accidentsPerMonth")}
      action={
        yearOptions.length > 0 && (
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className={`${inputClass} w-auto py-1.5`}
            aria-label="Select year"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )
      }
    >
      <div className="h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="accidentsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={axis} tick={{ fill: axis, fontSize: 12 }} tickLine={false} />
            <YAxis
              stroke={axis}
              tick={{ fill: axis, fontSize: 12 }}
              tickLine={false}
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => [value, "Accidents"]}
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${grid}`,
                borderRadius: 8,
                color: tooltipText,
              }}
              labelStyle={{ color: tooltipText }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#accidentsFill)"
              dot={{ r: 3, fill: "#22c55e" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}