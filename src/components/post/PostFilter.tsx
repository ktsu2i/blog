import { useState } from "react";
import { Button } from "@/components/ui/button";
import { POST_SOURCES, type PostSource } from "@/lib/types";
import { cn } from "@/lib/utils";

type SourceFilter = "all" | PostSource;

interface PostFilterTranslations {
  count: string;
  filterLabel: string;
}

interface Props {
  // Id of the server-rendered list whose children carry data-source
  listId: string;
  counts: Record<SourceFilter, number>;
  translations: PostFilterTranslations;
}

export default function PostFilter({ listId, counts, translations }: Props) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  function select(source: SourceFilter) {
    setSourceFilter(source);
    const items = document.querySelectorAll<HTMLElement>(
      `#${listId} > [data-source]`,
    );
    for (const item of items) {
      item.hidden = source !== "all" && item.dataset.source !== source;
    }
  }

  const countText = translations.count.replace(
    "{count}",
    String(counts[sourceFilter]),
  );

  return (
    <div className="space-y-6">
      <div
        role="group"
        aria-label={translations.filterLabel}
        className="flex flex-wrap items-center gap-2"
      >
        {(["all", ...Object.values(POST_SOURCES)] as const).map((source) => {
          const active = sourceFilter === source;
          return (
            <Button
              key={source}
              variant={active ? "default" : "outline"}
              size="sm"
              aria-pressed={active}
              aria-controls={listId}
              onClick={() => select(source)}
            >
              {source === "all" ? "All" : source}
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  active
                    ? "bg-primary-foreground/20"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[source]}
              </span>
            </Button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {countText}
      </p>
    </div>
  );
}
