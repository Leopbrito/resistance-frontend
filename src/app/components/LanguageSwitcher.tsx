import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-surface rounded-md border border-neutral hover:border-resistance transition-colors">
      <Globe className="w-4 h-4 text-neutral-light" aria-hidden="true" />
      <select
        aria-label={t("common.language")}
        value={i18n.resolvedLanguage}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-neutral-light text-sm font-body focus:outline-none cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-surface">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
