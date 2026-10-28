// Post source kinds
export const POST_SOURCES = {
  BLOG: "Blog",
  ZENN: "Zenn",
  EXTERNAL: "External",
} as const;

export type PostSource = (typeof POST_SOURCES)[keyof typeof POST_SOURCES];

// Unified post type for local and external posts
export interface Post {
  id: string;
  source: PostSource;
  title: string;
  date: string; // ISO 8601
  description: string;
  slug?: string; // local only
  url?: string; // external only
  draft?: boolean; // local only
  ogImage?: string; // OG image URL
}

// Speaker Deck talk
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

// Career timeline entry
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
