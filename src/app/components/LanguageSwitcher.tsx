import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#1A1F28] rounded-md border border-[#6B7280] hover:border-[#00D9FF] transition-colors">
      <Globe className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
      <select
        aria-label={t("common.language")}
        value={i18n.resolvedLanguage}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-[#9CA3AF] text-sm font-['Inter'] focus:outline-none cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-[#1A1F28]">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
