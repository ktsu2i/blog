import type { Post } from "./types";
import { externalPosts } from "../data/external";

export function listExternalPosts(): Post[] {
  // Auto-generated posts from RSS feeds (e.g., Bengo4)
  let rssGenerated: Post[] = [];
  try {
    const posts = import.meta.glob("../data/generated/bengo4.json", {
      eager: true,
    });
    const key = Object.keys(posts)[0];
    if (key) {
      rssGenerated = (posts[key] as { default: Post[] }).default;
    }
  } catch {
    // ignore
  }

  // Combine RSS-generated + manually curated external posts
  return [...rssGenerated, ...externalPosts];
}
