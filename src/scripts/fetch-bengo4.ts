import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { POST_SOURCES, type Post } from "../lib/types";

const FEED_URL = "https://creators.bengo4.com/feed";
const AUTHOR = "ktsu2i";

async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/
    );
    return match?.[1];
  } catch {
    return undefined;
  }
}

async function main() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);

  const items = (feed.items ?? []).filter((item) => {
    return item.author === AUTHOR;
  });

  const posts: Post[] = await Promise.all(
    items.map(async (item) => {
      const urlPath = item.link
        ? new URL(item.link).pathname.replace(/\//g, "-").replace(/^-/, "")
        : item.guid ?? "";

      const description = item.contentSnippet
        ? item.contentSnippet.slice(0, 200)
        : "";

      const tags: string[] = item.categories ?? [];

      const ogImage = item.link
        ? await fetchOgImage(item.link)
        : undefined;

      return {
        id: `bengo4-${urlPath}`,
        source: POST_SOURCES.EXTERNAL,
        title: item.title ?? "",
        date: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        tags,
        description,
        url: item.link ?? "",
        ...(ogImage ? { ogImage } : {}),
      };
    })
  );

  const outputDir = path.join(process.cwd(), "src/data/generated");
  const outputPath = path.join(outputDir, "bengo4.json");

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Fetched ${posts.length} posts from Bengo4 Creators Blog.`);
}

main().catch((err) => {
  console.error("Failed to fetch Bengo4 RSS:", err);
  process.exit(1);
});
