import type { Metadata } from "next";
import { PostFilter } from "@/components/post/post-filter";
import { listAllPosts } from "@/lib/feed";

export const metadata: Metadata = {
  title: "Blog",
  description: "ブログ記事一覧",
};

export default async function BlogPage() {
  const posts = await listAllPosts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          ローカル記事と外部記事をまとめて表示しています。
        </p>
      </div>
      <PostFilter posts={posts} />
    </div>
  );
}
