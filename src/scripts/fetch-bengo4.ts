import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { POST_SOURCES, type Post } from "../lib/types";

const FEED_URL = "https://creators.bengo4.com/feed";
const AUTHOR = "ktsu2i";
// The Hatena feed returns 30 entries per page with no rel="next";
// pages past the end return 200 with zero entries
const MAX_PAGES = 50;

interface CustomItemFields {
  // Set from Atom <author><name>, but missing from Parser.Item
  author?: string;
}

type FeedItem = Parser.Item & CustomItemFields;

const parser = new Parser<Record<string, unknown>, CustomItemFields>();

type ParseUrl = (url: string) => Promise<{ items?: FeedItem[] }>;
type Fetcher = (url: string) => Promise<{ text(): Promise<string> }>;

export async function fetchAllItems(
  parseUrl: ParseUrl = (url) => parser.parseURL(url),
  maxPages = MAX_PAGES,
): Promise<FeedItem[]> {
  const items: FeedItem[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const feed = await parseUrl(`${FEED_URL}?page=${page}`);
    const pageItems = feed.items ?? [];
    if (pageItems.length === 0) break;
    items.push(...pageItems);
  }
  return items;
}

export async function fetchOgImage(
  url: string,
  fetcher: Fetcher = fetch,
): Promise<string | undefined> {
  try {
    const res = await fetcher(url);
    const html = await res.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/
    );
    return match?.[1];
  } catch {
    return undefined;
  }
}

export async function createPosts(
  feedItems: FeedItem[],
  loadOgImage: (url: string) => Promise<string | undefined> = fetchOgImage,
  now: () => Date = () => new Date(),
): Promise<Post[]> {
  const items = feedItems.filter((item) => {
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

      const ogImage = item.link
        ? await loadOgImage(item.link)
        : undefined;

      return {
        id: `bengo4-${urlPath}`,
        source: POST_SOURCES.EXTERNAL,
        title: item.title ?? "",
        date: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : now().toISOString(),
        description,
        url: item.link ?? "",
        ...(ogImage ? { ogImage } : {}),
      };
    })
  );

  return posts;
}

export function writePosts(posts: Post[], cwd = process.cwd()): void {
  const outputDir = path.join(cwd, "src/data/generated");
  const outputPath = path.join(outputDir, "bengo4.json");

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Fetched ${posts.length} posts from Bengo4 Creators Blog.`);
}

export async function main(
  loadItems: () => Promise<FeedItem[]> = fetchAllItems,
  write: (posts: Post[]) => void = writePosts,
): Promise<void> {
  write(await createPosts(await loadItems()));
}

export function handleCliError(err: unknown): void {
  console.error("Failed to fetch Bengo4 RSS:", err);
  process.exitCode = 1;
}

export async function runCli(
  task: () => Promise<void> = main,
  onError: (err: unknown) => void = handleCliError,
): Promise<void> {
  try {
    await task();
  } catch (err) {
    onError(err);
  }
}

export const cliRun = runCli();
