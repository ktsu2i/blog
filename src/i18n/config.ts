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
  "nav.close": string;
  "nav.toggleTheme": string;

  // Language, written in that language for the toggle that switches to it
  "language.code": string;
  "language.name": string;

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
  "blog.filter.label": string;
  "blog.japaneseOnly": string;

  // Post
  "post.nav.label": string;
  "post.newer": string;
  "post.older": string;
  "post.backToBlog": string;

  // About
  "about.title": string;
  "about.description": string;
  "about.bio": string;
  "about.career": string;
  "about.current": string;
  "about.type.work": string;
  "about.type.internship": string;
  "about.type.education": string;

  // Talks
  "talks.title": string;
  "talks.description": string;
  "talks.viewOnSpeakerDeck": string;
  "talks.playSlides": string;

  // 404
  "notFound.message": string;
  "notFound.backHome": string;

  // Profile
  "profile.name": string;
  "profile.altName": string;

  // Common
  "common.siteName": string;
  "common.defaultTitle": string;
  "common.siteDescription": string;

  // Date format
  "date.format": string;
}

// Entry type whose K fields are written per locale under `localized`
export type Localized<T, K extends keyof T> = Omit<T, K> & {
  localized: Record<Locale, Pick<T, K>>;
};

const translations: Record<Locale, Translations> = { ja, en };

export function getCurrentLocale(astro: { currentLocale?: string }): Locale {
  return (astro.currentLocale ?? defaultLocale) as Locale;
}

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
  const stripped = currentPath.replace(/^\/en\//, "/");
  if (targetLocale === defaultLocale) return stripped;
  return `/en${stripped}`;
}
