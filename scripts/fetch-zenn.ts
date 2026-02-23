import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import type { Post } from "../lib/types";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile();
  const rssUrl = process.env.ZENN_RSS_URL;

  const outputDir = path.join(process.cwd(), "content/generated");
  const outputPath = path.join(outputDir, "zenn.json");

  if (!rssUrl) {
    console.warn("ZENN_RSS_URL is not set. Writing empty array.");
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    return;
  }

  const parser = new Parser();
  const feed = await parser.parseURL(rssUrl);

  const posts: Post[] = (feed.items ?? []).map((item) => {
    const urlPath = item.link
      ? new URL(item.link).pathname.replace(/\//g, "-").replace(/^-/, "")
      : item.guid ?? "";

    const description = item.contentSnippet
      ? item.contentSnippet.slice(0, 200)
      : "";

    const tags: string[] = item.categories ?? [];

    return {
      id: `zenn-${urlPath}`,
      type: "zenn" as const,
      source: "zenn" as const,
      title: item.title ?? "",
      date: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      tags,
      description,
      url: item.link ?? "",
    };
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Fetched ${posts.length} posts from Zenn RSS.`);
}

main().catch((err) => {
  console.error("Failed to fetch Zenn RSS:", err);
  process.exit(1);
});
