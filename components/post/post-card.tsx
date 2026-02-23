import Link from "next/link";
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
    <Card className="transition-colors hover:bg-accent/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
          {post.source === "zenn" ? (
            <Badge variant="secondary" className="text-blue-600 dark:text-blue-400">
              Zenn
            </Badge>
          ) : (
            <Badge>Local</Badge>
          )}
        </div>
        <CardTitle className="text-lg">
          <span className="flex items-center gap-1">
            {post.title}
            {post.type === "zenn" && (
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
