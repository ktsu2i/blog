import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { POST_SOURCES, type Post } from "../lib/types";

const FEED_URL = "https://creators.bengo4.com/feed";
const AUTHOR = "ktsu2i";
// The Hatena feed returns 30 entries per page with no rel="next";
// pages past the end return 200 with zero entries
const MAX_PAGES = 50;

// rss-parser does not map Atom <category term> to item.categories,
// so pull the raw elements via customFields
interface AtomCategory {
  $: { term?: string; label?: string };
}

interface CustomItemFields {
  // Set from Atom <author><name>, but missing from Parser.Item
  author?: string;
  atomCategories?: AtomCategory[];
}

type FeedItem = Parser.Item & CustomItemFields;

const parser = new Parser<Record<string, unknown>, CustomItemFields>({
  customFields: {
    item: [["category", "atomCategories", { keepArray: true }]],
  },
});

async function fetchAllItems(): Promise<FeedItem[]> {
  const items: FeedItem[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const feed = await parser.parseURL(`${FEED_URL}?page=${page}`);
    const pageItems = feed.items ?? [];
    if (pageItems.length === 0) break;
    items.push(...pageItems);
  }
  return items;
}

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
  const items = (await fetchAllItems()).filter((item) => {
    return item.author === AUTHOR;
  });

  if (items.length === 0) {
    throw new Error(
      `No posts by ${AUTHOR} found in the feed. The feed structure may have changed.`
    );
  }

  const posts: Post[] = await Promise.all(
    items.map(async (item) => {
      const urlPath = item.link
        ? new URL(item.link).pathname.replace(/\//g, "-").replace(/^-/, "")
        : item.guid ?? "";

      const description = item.contentSnippet
        ? item.contentSnippet.slice(0, 200)
        : "";

      const tags: string[] = (item.atomCategories ?? [])
        .map((category) => category.$.term)
        .filter((term): term is string => Boolean(term));

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
