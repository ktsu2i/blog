import { type Locale, getLocalePath } from "../i18n/config";
import { POST_SOURCES, type Post } from "./types";

// Untranslated local posts only exist under the default (ja) route
export function isJapaneseOnly(post: Post, locale: Locale): boolean {
  return locale === "en" && post.locale !== "en";
}

export function getPostHref(post: Post, locale: Locale): string | undefined {
  if (post.source !== POST_SOURCES.BLOG || !post.slug) return post.url;
  return getLocalePath(
    `/blog/${post.slug}`,
    isJapaneseOnly(post, locale) ? "ja" : locale,
  );
}
