import { getCollection } from "astro:content";
import type { Post } from "./types";
import type { Locale } from "../i18n/config";

export async function listLocalPosts(
  locale: Locale = "ja",
): Promise<Post[]> {
  const collectionName = locale === "ja" ? "postsJa" : "postsEn";
  const entries = await getCollection(collectionName);

  const toPost = (
    entry: (typeof entries)[number],
    postLocale: Locale,
  ): Post => ({
    id: entry.id,
    type: "blog" as const,
    source: "blog" as const,
    slug: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    tags: entry.data.tags,
    description: entry.data.description,
    draft: entry.data.draft,
    ogImage: `/og/${entry.id}.png`,
    locale: postLocale,
  });

  const posts: Post[] = entries
    .filter((entry) => {
      if (entry.data.draft && import.meta.env.PROD) return false;
      return true;
    })
    .map((entry) => toPost(entry, locale));

  // For English pages, also include Japanese-only posts (no English version)
  if (locale === "en") {
    const jaEntries = await getCollection("postsJa");
    const enSlugs = new Set(entries.map((e) => e.id));
    const jaOnly = jaEntries
      .filter((entry) => {
        if (entry.data.draft && import.meta.env.PROD) return false;
        return !enSlugs.has(entry.id);
      })
      .map((entry) => toPost(entry, "ja"));
    posts.push(...jaOnly);
  }

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return posts;
}
