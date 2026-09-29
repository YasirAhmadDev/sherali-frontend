import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

import { LANGUAGES } from "@/i18n";
import { inputClass } from "@/components/common/FormField";

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <Languages size={16} className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-subtle" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        aria-label="Language"
        className={`${inputClass} w-auto py-1.5 ps-8`}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}