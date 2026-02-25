import { ja } from "./ja";
import { en } from "./en";

export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

export interface Translations {
  // Navigation
  "nav.home": string;
  "nav.blog": string;
  "nav.talks": string;
  "nav.about": string;
  "nav.menu": string;

  // Home
  "home.subtitle": string;
  "home.cta.blog": string;
  "home.cta.about": string;
  "home.latestPosts": string;
  "home.viewAll": string;

  // Blog
  "blog.title": string;
  "blog.description": string;
  "blog.count": string;
  "blog.filter.all": string;
  "blog.japaneseOnly": string;

  // About
  "about.title": string;
  "about.description": string;
  "about.bio": string;
  "about.techStack": string;
  "about.career": string;
  "about.links": string;
  "about.current": string;
  "about.type.work": string;
  "about.type.internship": string;
  "about.type.education": string;

  // Talks
  "talks.title": string;
  "talks.description": string;
  "talks.viewOnSpeakerDeck": string;

  // Common
  "common.siteName": string;
  "common.siteDescription": string;

  // Date format
  "date.format": string;
}

const translations: Record<Locale, Translations> = { ja, en };

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split("/");
  if (locales.includes(locale as Locale)) return locale as Locale;
  return defaultLocale;
}

export function useTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getLocalePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function getAlternatePath(
  currentPath: string,
  targetLocale: Locale,
): string {
  const stripped = currentPath.replace(/^\/en/, "") || "/";
  if (targetLocale === defaultLocale) return stripped;
  return `/en${stripped}`;
}
