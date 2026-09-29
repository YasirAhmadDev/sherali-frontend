import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import Card from "@/components/common/Card";
import SeverityBadge from "@/components/accidents/SeverityBadge";
import { formatDateTime, translateValue } from "@/utils/formatters";

const th = "px-2 py-2 text-start text-xs font-medium text-muted";
const td = "px-2 py-3";

export default function RecentAccidents({ accidents = [] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card
      title={t("dashboard.recentAccidents")}
      action={
        <Link
          to="/accidents"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {t("dashboard.viewAll")} <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      }
    >
      {accidents.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t("dashboard.noAccidents")}</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className={th}>{t("table.dateTime")}</th>
                <th className={th}>{t("table.location")}</th>
                <th className={`${th} hidden md:table-cell`}>{t("table.type")}</th>
                <th className={`${th} hidden sm:table-cell`}>{t("table.injured")}</th>
                <th className={`${th} hidden sm:table-cell`}>{t("table.fatalities")}</th>
                <th className={th}>{t("table.severity")}</th>
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
                  <td className={`${td} hidden text-muted md:table-cell`}>
                    {translateValue(t, "accidentTypes", a.type)}
                  </td>
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