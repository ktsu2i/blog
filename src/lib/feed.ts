import { listLocalPosts } from "./posts";
import { listZennPosts } from "./zenn";
import { listBengo4Posts } from "./bengo4";
import type { Post } from "./types";
import type { Locale } from "../i18n/config";

export async function listAllPosts(
  locale: Locale = "ja",
): Promise<Post[]> {
  const local = await listLocalPosts(locale);
  const zenn = listZennPosts();
  const bengo4 = listBengo4Posts();
  const all = [...local, ...zenn, ...bengo4];
  all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return all;
}
