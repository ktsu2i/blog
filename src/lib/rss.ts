import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { type Locale, getLocalePath, useTranslations } from "../i18n/config";
import { getPostDescription } from "./posts";
import { compareByDateDesc } from "./utils";

/** RSS feed of the locale's local posts, drafts excluded */
export async function buildRssFeed(
  context: APIContext,
  locale: Locale,
): Promise<Response> {
  const t = useTranslations(locale);
  const posts = await getCollection(locale === "ja" ? "postsJa" : "postsEn");

  return rss({
    title: t["common.siteName"],
    description: t["common.siteDescription"],
    site: context.site!,
    items: posts
      .filter((post) => !post.data.draft)
      .sort((a, b) => compareByDateDesc(a.data, b.data))
      .map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: getPostDescription(post),
        link: getLocalePath(`/blog/${post.id}/`, locale),
      })),
  });
}
