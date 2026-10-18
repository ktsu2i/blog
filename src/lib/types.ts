import type { Locale } from "../i18n/config";

export const POST_SOURCES = {
  BLOG: "Blog",
  ZENN: "Zenn",
  EXTERNAL: "External",
} as const;

export type PostSource = (typeof POST_SOURCES)[keyof typeof POST_SOURCES];

// Post shape shared by local and external sources
export interface Post {
  id: string;
  source: PostSource;
  title: string;
  date: string; // ISO 8601
  description: string;
  slug?: string; // local only
  url?: string; // external only
  draft?: boolean; // local only
  ogImage?: string;
  locale?: Locale;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  speakerdeckUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  description: string;
}

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
