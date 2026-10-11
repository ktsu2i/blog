import { useState } from "react";
import { Button } from "@/components/ui/button";
import { POST_SOURCES, type PostSource } from "@/lib/types";

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
        {(["all", ...Object.values(POST_SOURCES)] as const).map((source) => (
          <Button
            key={source}
            variant={sourceFilter === source ? "default" : "outline"}
            size="sm"
            aria-pressed={sourceFilter === source}
            aria-controls={listId}
            onClick={() => select(source)}
          >
            {source === "all" ? "All" : source}
          </Button>
        ))}
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {countText}
      </p>
    </div>
  );
}
