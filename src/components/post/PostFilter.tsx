import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Post, PostSource } from "@/lib/types";

type SourceFilter = "all" | PostSource;

interface PostFilterTranslations {
  count: string;
  japaneseOnly: string;
  dateFormat: string;
}

function PostCard({
  post,
  locale,
  translations,
}: {
  post: Post;
  locale: string;
  translations: PostFilterTranslations;
}) {
  const formattedDate = format(new Date(post.date), translations.dateFormat);
  const isJapaneseOnly = locale === "en" && post.locale !== "en";
  const localePath =
    post.type === "blog" && isJapaneseOnly ? "" : locale === "ja" ? "" : `/${locale}`;
  const href =
    post.type === "blog" && post.slug
      ? `${localePath}/blog/${post.slug}`
      : post.url;
  const isExternal = post.type !== "blog";
  const showJapaneseOnly = isJapaneseOnly;

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
            {post.source === "blog" && <Badge>Blog</Badge>}
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
            {showJapaneseOnly && (
              <Badge
                variant="outline"
                className="text-orange-700 dark:text-orange-300 border-orange-500/20 bg-orange-500/15"
              >
                {translations.japaneseOnly}
              </Badge>
            )}
          </div>
          <div className="leading-snug font-semibold text-lg line-clamp-2">
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
                  className="ml-1 inline-block size-4 text-muted-foreground align-text-bottom"
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

interface Props {
  posts: Post[];
  locale: string;
  translations: PostFilterTranslations;
}

export default function PostFilter({ posts, locale, translations }: Props) {
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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const countText = translations.count.replace(
    "{count}",
    String(filtered.length),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "blog", "zenn", "bengo4"] as const).map((source) => {
          const label =
            source === "all"
              ? "All"
              : source === "blog"
                ? "Blog"
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

      <p className="text-sm text-muted-foreground">{countText}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            locale={locale}
            translations={translations}
          />
        ))}
      </div>
    </div>
  );
}
