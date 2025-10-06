"use client";

import { useI18n, SupportedLocale } from "./LanguageProvider";
import { Button } from "@/components/ui/button";

export default function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();

  const toggle = () => setLocale(locale === "en" ? ("hi" as SupportedLocale) : ("en" as SupportedLocale));

  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-label={t("app.name") + " language switch"}>
      {locale === "en" ? "हिंदी" : "English"}
    </Button>
  );
}


