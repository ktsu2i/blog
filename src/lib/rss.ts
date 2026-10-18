import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { type Locale, getLocalePath, useTranslations } from "../i18n/config";
import { getPostDescription, listPublishedEntries } from "./posts";
import { compareByDateDesc } from "./utils";

/** RSS feed of the locale's published local posts */
export async function buildRssFeed(
  context: APIContext,
  locale: Locale,
): Promise<Response> {
  const t = useTranslations(locale);
  const posts = await listPublishedEntries(
    locale === "ja" ? "postsJa" : "postsEn",
  );

  return rss({
    title: t["common.siteName"],
    description: t["common.siteDescription"],
    site: context.site!,
    items: posts
      .sort((a, b) => compareByDateDesc(a.data, b.data))
      .map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: getPostDescription(post),
        link: getLocalePath(`/blog/${post.id}/`, locale),
      })),
  });
}
