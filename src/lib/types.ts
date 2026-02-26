import type { Locale } from "../i18n/config";

// 投稿のソース種別
export const POST_SOURCES = {
  BLOG: "blog",
  ZENN: "zenn",
  EXTERNAL: "external",
} as const;

export type PostSource = (typeof POST_SOURCES)[keyof typeof POST_SOURCES];

export const POST_SOURCE_LABELS: Record<PostSource, string> = {
  [POST_SOURCES.BLOG]: "Blog",
  [POST_SOURCES.ZENN]: "Zenn",
  [POST_SOURCES.EXTERNAL]: "External",
};

// 統一投稿型（ローカル記事・外部記事共通）
export interface Post {
  id: string;
  source: PostSource;
  title: string;
  date: string; // ISO 8601
  tags: string[];
  description: string;
  slug?: string; // local 用
  url?: string; // external 用
  draft?: boolean; // local 用
  ogImage?: string; // OG画像URL
  locale?: Locale;
}

// ローカル記事の frontmatter 型
export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  description: string;
  draft?: boolean;
}

// SpeakerDeck トーク型
export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  speakerdeckUrl: string;
  embedUrl: string;
  description: string;
}

// プロジェクト型
export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  repoUrl?: string;
  tags: string[];
  image?: string;
}

// 経歴型
export type CareerEntry = {
  id: string;
  period: string;
  description: string;
  tags?: string[];
  current?: boolean;
} & (
  | { type: "work" | "internship"; company: string; role: string }
  | { type: "education"; university: string; major: string }
);
