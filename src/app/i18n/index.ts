import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

export const LANGUAGE_KEY = "language";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt-BR", label: "Português" },
] as const;

const syncDocument = (lng: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng;
  document.title = i18n.t("home.title");
};

// Detecta: localStorage -> navigator.language -> en. O detector já lida com storage bloqueado
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, "pt-BR": { translation: ptBR } },
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    // pt, pt-PT etc. caem em pt-BR; qualquer outro idioma cai em en
    nonExplicitSupportedLngs: false,
    fallbackLng: { pt: ["pt-BR"], default: ["en"] },
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_KEY,
      caches: ["localStorage"],
    },
  })
  .then(() => syncDocument(i18n.resolvedLanguage ?? "en"));

i18n.on("languageChanged", () => syncDocument(i18n.resolvedLanguage ?? "en"));

export default i18n;
