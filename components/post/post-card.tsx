import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const formattedDate = format(new Date(post.date), "yyyy年M月d日");

  const content = (
    <Card className="overflow-hidden transition-colors hover:bg-accent/50">
      {post.ogImage && (
        <div className="relative aspect-40/21">
          <Image
            src={post.ogImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
          {post.source === "local" && <Badge>Local</Badge>}
          {post.source === "zenn" && (
            <Badge variant="secondary" className="text-blue-600 dark:text-blue-400">
              Zenn
            </Badge>
          )}
          {post.source === "bengo4" && (
            <Badge variant="secondary" className="text-green-600 dark:text-green-400">
              Bengo4
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">
          <span className="flex items-center gap-1">
            {post.title}
            {post.type !== "local" && (
              <ExternalLinkIcon className="size-4 text-muted-foreground" />
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">
          {post.description}
        </CardDescription>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (post.type === "local" && post.slug) {
    return <Link href={`/blog/${post.slug}`}>{content}</Link>;
  }

  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
