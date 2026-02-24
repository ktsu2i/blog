import { zennPosts } from "../data/zenn";
import type { Post } from "./types";

export function listZennPosts(): Post[] {
  return zennPosts;
}
