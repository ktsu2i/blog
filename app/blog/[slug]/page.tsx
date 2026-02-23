import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { listLocalPosts, getLocalPostBySlug } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await listLocalPosts();
  return posts.map((post) => ({ slug: post.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getLocalPostBySlug(slug);
  if (!result) return {};

  return {
    title: result.meta.title,
    description: result.meta.description,
    openGraph: {
      title: result.meta.title,
      description: result.meta.description,
      type: "article",
      publishedTime: result.meta.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getLocalPostBySlug(slug);

  if (!result) {
    notFound();
  }

  const { meta, content } = result;
  const formattedDate = format(new Date(meta.date), "yyyy年M月d日");

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
          <Badge>Local</Badge>
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </header>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
