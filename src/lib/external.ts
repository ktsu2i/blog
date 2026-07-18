import type { Post } from "./types";
import { externalPosts } from "../data/external";

type GeneratedPostModule = { default: Post[] };

export function listExternalPosts(
  generatedModules: Record<string, unknown> = import.meta.glob(
    "../data/generated/bengo4.json",
    { eager: true },
  ),
): Post[] {
  // Auto-generated posts from RSS feeds (e.g., Bengo4)
  let rssGenerated: Post[] = [];
  try {
    const key = Object.keys(generatedModules)[0];
    if (key) {
      rssGenerated = (generatedModules[key] as GeneratedPostModule).default;
    }
  } catch {
    // ignore
  }

  // Combine RSS-generated + manually curated external posts
  return [...rssGenerated, ...externalPosts];
}
