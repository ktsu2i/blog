import { zennPosts } from "@/content/zenn";
import type { Post } from "./types";

export function listZennPosts(): Post[] {
  return zennPosts;
}
