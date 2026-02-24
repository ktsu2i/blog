import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Post, PostSource } from "@/lib/types";

type SourceFilter = "all" | PostSource;

function PostCard({ post }: { post: Post }) {
  const formattedDate = format(new Date(post.date), "yyyy年M月d日");
  const href =
    post.type === "local" && post.slug ? `/blog/${post.slug}` : post.url;
  const isExternal = post.type !== "local";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block h-full"
    >
      <div className="bg-card text-card-foreground flex h-full flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden transition-colors hover:bg-accent/50">
        {post.ogImage && (
          <div className="relative aspect-40/21 px-0 -mt-6">
            <img
              src={post.ogImage}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6">
          <div className="flex items-center gap-2">
            <time className="text-sm text-muted-foreground">
              {formattedDate}
            </time>
            {post.source === "local" && <Badge>Local</Badge>}
            {post.source === "zenn" && (
              <Badge
                variant="secondary"
                className="text-blue-600 dark:text-blue-400"
              >
                Zenn
              </Badge>
            )}
            {post.source === "bengo4" && (
              <Badge
                variant="secondary"
                className="text-green-600 dark:text-green-400"
              >
                Bengo4
              </Badge>
            )}
          </div>
          <div className="leading-none font-semibold text-lg line-clamp-2">
            <span className="inline">
              {post.title}
              {isExternal && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block size-4 text-muted-foreground align-text-bottom"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              )}
            </span>
          </div>
        </div>
        <div className="mt-auto px-6">
          <div className="text-muted-foreground text-sm line-clamp-2">
            {post.description}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export default function PostFilter({ posts }: { posts: Post[] }) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (sourceFilter !== "all" && post.source !== sourceFilter) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => post.tags.includes(tag))
      )
        return false;
      return true;
    });
  }, [posts, sourceFilter, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "local", "zenn", "bengo4"] as const).map((source) => {
          const label =
            source === "all"
              ? "All"
              : source === "local"
                ? "Local"
                : source === "zenn"
                  ? "Zenn"
                  : "Bengo4";
          return (
            <Button
              key={source}
              variant={sourceFilter === source ? "default" : "outline"}
              size="sm"
              onClick={() => setSourceFilter(source)}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => toggleTag(tag)}>
              <Badge
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {filtered.length} 件の記事
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
