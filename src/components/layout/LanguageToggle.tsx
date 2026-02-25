import { Button } from "@/components/ui/button";
import { getAlternatePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

interface Props {
  currentLocale: string;
  currentPath: string;
}

export default function LanguageToggle({
  currentLocale,
  currentPath,
}: Props) {
  const targetLocale: Locale = currentLocale === "ja" ? "en" : "ja";
  const targetPath = getAlternatePath(currentPath, targetLocale);
  const label = currentLocale === "ja" ? "EN" : "JA";

  return (
    <Button variant="ghost" size="icon" asChild>
      <a href={targetPath} className="text-xs font-semibold">
        {label}
      </a>
    </Button>
  );
}
