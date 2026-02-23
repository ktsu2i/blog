import { listLocalPosts } from "./posts";
import { listZennPosts } from "./zenn";
import type { Post } from "./types";

export async function listAllPosts(): Promise<Post[]> {
  const local = await listLocalPosts();
  const zenn = listZennPosts();
  const all = [...local, ...zenn];
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return all;
}
