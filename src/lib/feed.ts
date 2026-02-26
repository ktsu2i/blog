import { listLocalPosts } from "./posts";
import { listZennPosts } from "./zenn";
import { listExternalPosts } from "./external";
import type { Post } from "./types";
import type { Locale } from "../i18n/config";

export async function listAllPosts(
  locale: Locale = "ja",
): Promise<Post[]> {
  const blog = await listLocalPosts(locale);
  const zenn = listZennPosts();
  const external = listExternalPosts();
  const all = [...blog, ...zenn, ...external];
  all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return all;
}
