import type { Post } from "./types";

export function listBengo4Posts(): Post[] {
  try {
    // Import the generated JSON at build time
    const posts = import.meta.glob("../data/generated/bengo4.json", {
      eager: true,
    });
    const key = Object.keys(posts)[0];
    if (key) {
      return (posts[key] as { default: Post[] }).default;
    }
    return [];
  } catch {
    return [];
  }
}
