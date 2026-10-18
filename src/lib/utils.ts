import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "../i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Comparator for sorting by date, newest first */
export function compareByDateDesc(
  a: { date: string },
  b: { date: string },
): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Pinned so the output doesn't depend on the build machine's TZ (UTC on Cloudflare)
const TIME_ZONE = "Asia/Tokyo";

/** Display date in JST, e.g. "2026年2月25日" / "Feb 25, 2026" */
export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(date));
}

/** JST date as YYYY-MM-DD for the <time datetime> attribute */
export function toDateAttr(date: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(
    new Date(date),
  );
}
