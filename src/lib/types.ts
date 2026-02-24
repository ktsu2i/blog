// 投稿のソース種別
export type PostSource = "local" | "zenn" | "bengo4";

// 統一投稿型（ローカル記事・外部記事共通）
export interface Post {
  id: string;
  type: PostSource;
  source: PostSource;
  title: string;
  date: string; // ISO 8601
  tags: string[];
  description: string;
  slug?: string; // local 用
  url?: string; // external 用
  draft?: boolean; // local 用
  ogImage?: string; // OG画像URL
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
export interface CareerEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}
