import type { Metadata } from "next";
import { PostCard } from "@/components/post/post-card";
import { listAllPosts } from "@/lib/feed";

export const metadata: Metadata = {
  title: "Notes",
  description: "外部記事まとめ",
};

export default async function NotesPage() {
  const posts = await listAllPosts();
  const zennPosts = posts.filter((p) => p.source === "zenn");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="mt-2 text-muted-foreground">
          Zenn に投稿した外部記事の一覧です。
        </p>
      </div>
      <div className="space-y-4">
        {zennPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {zennPosts.length === 0 && (
          <p className="text-muted-foreground">記事がありません。</p>
        )}
      </div>
    </div>
  );
}
