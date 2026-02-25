import { getCollection } from "astro:content";
import type { Post } from "./types";
import type { Locale } from "../i18n/config";

export async function listLocalPosts(
  locale: Locale = "ja",
): Promise<Post[]> {
  const collectionName = locale === "ja" ? "postsJa" : "postsEn";
  const entries = await getCollection(collectionName);

  const posts: Post[] = entries
    .filter((entry) => {
      if (entry.data.draft && import.meta.env.PROD) return false;
      return true;
    })
    .map((entry) => ({
      id: entry.id,
      type: "local" as const,
      source: "local" as const,
      slug: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      tags: entry.data.tags,
      description: entry.data.description,
      draft: entry.data.draft,
      ogImage: `/og/${entry.id}.png`,
      locale,
    }));

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return posts;
}
