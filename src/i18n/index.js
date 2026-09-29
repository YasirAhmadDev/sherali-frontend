import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/i18n/locales/en.json";
import fa from "@/i18n/locales/fa.json";
import ps from "@/i18n/locales/ps.json";

export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fa", label: "دری", dir: "rtl" },
  { code: "ps", label: "پښتو", dir: "rtl" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fa: { translation: fa }, ps: { translation: ps } },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], lookupLocalStorage: "accident_lang", caches: ["localStorage"] },
  });

// Sets <html lang="..." dir="ltr|rtl">, called once at startup and on every language change
export const applyDirection = (lng) => {
  const language = LANGUAGES.find((l) => l.code === lng) || LANGUAGES[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
};

applyDirection(i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;