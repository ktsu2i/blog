import { listLocalPosts } from "./posts";
import { listZennPosts } from "./zenn";
import { listBengo4Posts } from "./bengo4";
import type { Post } from "./types";

export async function listAllPosts(): Promise<Post[]> {
  const local = (await listLocalPosts()).map((post) => ({
    ...post,
    ogImage: `/blog/${post.slug}/opengraph-image`,
  }));
  const zenn = listZennPosts();
  const bengo4 = listBengo4Posts();
  const all = [...local, ...zenn, ...bengo4];
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return all;
}
