import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { useTranslations } from "../../i18n/config";
import { getPostDescription } from "../../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getCollection("postsEn");

  const sortedPosts = posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  return rss({
    title: useTranslations("en")["common.siteName"],
    description: "ktsu2i's blog & portfolio",
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: getPostDescription(post),
      link: `/en/blog/${post.id}/`,
    })),
  });
}
