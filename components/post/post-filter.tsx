"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "./post-card";
import type { Post, PostSource } from "@/lib/types";

type SourceFilter = "all" | PostSource;

export function PostFilter({ posts }: { posts: Post[] }) {
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
        {(["all", "local", "zenn"] as const).map((source) => (
          <Button
            key={source}
            variant={sourceFilter === source ? "default" : "outline"}
            size="sm"
            onClick={() => setSourceFilter(source)}
          >
            {source === "all" ? "All" : source === "local" ? "Local" : "Zenn"}
          </Button>
        ))}
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

      <p className="text-sm text-muted-foreground">{filtered.length} 件の記事</p>

      <div className="space-y-4">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
