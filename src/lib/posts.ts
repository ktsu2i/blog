import { getCollection } from "astro:content";
import { POST_SOURCES, type Post } from "./types";
import { type Locale, getLocalePath } from "../i18n/config";

const DESCRIPTION_MAX_LENGTH = 200;

/** Markdown 記法を除去してプレーンテキストを返す */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // コードブロック
    .replace(/`[^`]*`/g, "") // インラインコード
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 画像
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.replace(/\[([^\]]*)\]\([^)]*\)/, "$1")) // リンク → テキスト
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
    source: POST_SOURCES.BLOG,
    slug: entry.id,
    title: entry.data.title,
    date: entry.data.date,
    tags: entry.data.tags,
    description: entry.data.description || extractDescription(entry.body ?? ""),
    draft: entry.data.draft,
    ogImage: getLocalePath(`/og/${entry.id}.png`, postLocale),
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
