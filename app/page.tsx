import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post/post-card";
import { listAllPosts } from "@/lib/feed";

export default async function Home() {
  const posts = await listAllPosts();
  const recent = posts.slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="space-y-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">ktsu2i.dev</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          ソフトウェアエンジニアのブログ & ポートフォリオサイトです。
          技術記事や登壇情報、プロジェクトについて発信しています。
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/blog">ブログを見る</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">最新の投稿</h2>
        <div className="space-y-4">
          {recent.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          全記事を見る
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>
    </div>
  );
}
