import { type CollectionEntry, getCollection } from "astro:content";
import { POST_SOURCES, type Post } from "./types";
import { type Locale, getLocalePath } from "../i18n/config";
import { compareByDateDesc } from "./utils";

const DESCRIPTION_MAX_LENGTH = 200;

/** Markdown 記法を除去してプレーンテキストを返す */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // コードブロック
    .replace(/`[^`]*`/g, "") // インラインコード
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 画像
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) =>
      m.replace(/\[([^\]]*)\]\([^)]*\)/, "$1"),
    ) // リンク → テキスト
    .replace(/^#{1,6}\s+/gm, "") // 見出し
    .replace(/^[-*>]+\s/gm, "") // リスト・引用
    .replace(/[*_~]+/g, "") // 強調・取り消し線
    .replace(/^---+$/gm, "") // 水平線
    .replace(/\n+/g, " ") // 改行 → スペース
    .replace(/\s+/g, " ") // 連続空白
    .trim();
}

/** 本文から description を抽出する (frontmatter 未設定時のフォールバック) */
function extractDescription(body: string): string {
  const plain = stripMarkdown(body);
  if (plain.length <= DESCRIPTION_MAX_LENGTH) return plain;
  return `${plain.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
}

/** Frontmatter description, falling back to an excerpt of the body */
export function getPostDescription(entry: {
  body?: string;
  data: { description?: string };
}): string {
  return entry.data.description || extractDescription(entry.body ?? "");
}

type PostCollection = "postsJa" | "postsEn";

/** Drafts are visible only outside production builds */
function isPublished(entry: { data: { draft: boolean } }): boolean {
  return !(entry.data.draft && import.meta.env.PROD);
}

/** Collection entries that should be built as pages */
export async function listPublishedEntries<C extends PostCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  return entries.filter(isPublished);
}

export async function listLocalPosts(locale: Locale = "ja"): Promise<Post[]> {
  const collectionName = locale === "ja" ? "postsJa" : "postsEn";
  const entries = await getCollection(collectionName);

  const toPost = (
    entry: (typeof entries)[number],
    postLocale: Locale,
  ): Post => ({
    id: entry.id,
    source: POST_SOURCES.BLOG,
    slug: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    description: getPostDescription(entry),
    draft: entry.data.draft,
    ogImage: getLocalePath(`/og/${entry.id}.png`, postLocale),
    locale: postLocale,
  });

  const posts: Post[] = entries
    .filter(isPublished)
    .map((entry) => toPost(entry, locale));

  // For English pages, also include Japanese-only posts (no English version)
  if (locale === "en") {
    const jaEntries = await getCollection("postsJa");
    const enSlugs = new Set(entries.map((e) => e.id));
    const jaOnly = jaEntries
      .filter((entry) => isPublished(entry) && !enSlugs.has(entry.id))
      .map((entry) => toPost(entry, "ja"));
    posts.push(...jaOnly);
  }

  posts.sort(compareByDateDesc);

  return posts;
}

/** Neighbors of the post in a list sorted by date desc */
export function getAdjacentPosts(
  posts: Post[],
  id: string,
): { newer?: Post; older?: Post } {
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return {};
  return { newer: posts[index - 1], older: posts[index + 1] };
}
