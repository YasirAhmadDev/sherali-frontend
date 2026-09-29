import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

// Drawn with SVG so it works in both themes. To use a real photo later, replace the
// <svg> with:  <img src={kabulPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
export default function CityBanner() {
  const { t } = useTranslation();

  return (
    <div className="relative h-40 overflow-hidden rounded-xl border border-line bg-linear-to-b from-sky-200 via-amber-100 to-emerald-100 sm:h-44 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950">
      <svg
        viewBox="0 0 400 180"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M0 120 L55 70 L95 98 L165 38 L235 100 L285 62 L400 118 L400 180 L0 180 Z"
          className="fill-slate-400/60 dark:fill-slate-700/80"
        />
        <path
          d="M0 145 L80 108 L150 132 L230 92 L320 138 L400 108 L400 180 L0 180 Z"
          className="fill-slate-500/60 dark:fill-slate-800"
        />
        <g className="fill-emerald-800/70 dark:fill-emerald-900">
          <rect x="20" y="140" width="22" height="40" />
          <rect x="48" y="150" width="18" height="30" />
          <rect x="72" y="136" width="26" height="44" />
          <rect x="112" y="148" width="20" height="32" />
          <rect x="140" y="142" width="24" height="38" />
          <rect x="188" y="150" width="20" height="30" />
          <rect x="214" y="138" width="26" height="42" />
          <rect x="250" y="148" width="18" height="32" />
          <rect x="276" y="140" width="24" height="40" />
          <rect x="316" y="150" width="22" height="30" />
          <rect x="346" y="142" width="26" height="38" />
        </g>
      </svg>

      <div className="relative flex h-full flex-col p-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <MapPin size={20} className="text-accent" />
          {t("dashboard.kabul")}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300">{t("dashboard.kabulTagline")}</p>
      </div>
    </div>
  );
}