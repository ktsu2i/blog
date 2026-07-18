import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { listLocalPosts } from "@/lib/posts";
import { listAllPosts } from "@/lib/feed";
import { listExternalPosts } from "@/lib/external";
import { listZennPosts } from "@/lib/zenn";
import { cn } from "@/lib/utils";
import { externalPosts } from "@/data/external";
import { zennPosts } from "@/data/zenn";
import { POST_SOURCES, type Post } from "@/lib/types";

const mockedGetCollection = vi.mocked(getCollection);

function entry(
  id: string,
  date: string,
  options: {
    description?: string;
    body?: string;
    draft?: boolean;
  } = {},
) {
  return {
    id,
    body: options.body,
    data: {
      title: `Title ${id}`,
      date,
      description: options.description ?? "",
      draft: options.draft ?? false,
    },
  };
}

beforeEach(() => {
  mockedGetCollection.mockReset();
});

describe("listLocalPosts", () => {
  it("maps, sorts, and derives plain-text descriptions", async () => {
    const markdown = [
      "# Heading",
      "- **bold** and [link](https://example.com)",
      "> quote with `inline` and ~~strike~~",
      "![image](image.png)",
      "```ts\nconst hidden = true\n```",
      "---",
    ].join("\n");
    const longBody = `# ${"x".repeat(205)}`;
    mockedGetCollection.mockResolvedValueOnce([
      entry("older", "2025-01-01", { body: markdown }),
      entry("newer", "2026-01-01", { description: "Provided" }),
      entry("long", "2024-01-01", { body: longBody }),
      entry("empty", "2023-01-01"),
    ] as never);

    const posts = await listLocalPosts();

    expect(mockedGetCollection).toHaveBeenCalledWith("postsJa");
    expect(posts.map((post) => post.id)).toEqual([
      "newer",
      "older",
      "long",
      "empty",
    ]);
    expect(posts[0]).toMatchObject({
      source: POST_SOURCES.BLOG,
      slug: "newer",
      description: "Provided",
      locale: "ja",
      ogImage: "/og/newer.png",
    });
    expect(posts[1].description).toBe("Heading bold and link quote with and strike");
    expect(posts[2].description).toHaveLength(203);
    expect(posts[2].description.endsWith("...")).toBe(true);
    expect(posts[3].description).toBe("");
  });

  it("adds only Japanese posts without English equivalents", async () => {
    mockedGetCollection
      .mockResolvedValueOnce([
        entry("shared", "2026-01-01", { description: "English" }),
        entry("en-only", "2025-01-01", { description: "English" }),
      ] as never)
      .mockResolvedValueOnce([
        entry("shared", "2026-01-01", { description: "Japanese" }),
        entry("ja-only", "2024-01-01", { description: "Japanese" }),
      ] as never);

    const posts = await listLocalPosts("en");

    expect(posts.map((post) => post.id)).toEqual([
      "shared",
      "en-only",
      "ja-only",
    ]);
    expect(posts[0].ogImage).toBe("/en/og/shared.png");
    expect(posts[2]).toMatchObject({ locale: "ja", ogImage: "/og/ja-only.png" });
  });

  it("filters drafts in production for both locales", async () => {
    vi.stubEnv("PROD", true);
    mockedGetCollection
      .mockResolvedValueOnce([
        entry("published-en", "2026-01-01"),
        entry("draft-en", "2026-02-01", { draft: true }),
      ] as never)
      .mockResolvedValueOnce([
        entry("published-ja", "2025-01-01"),
        entry("draft-ja", "2025-02-01", { draft: true }),
      ] as never);

    expect((await listLocalPosts("en")).map((post) => post.id)).toEqual([
      "published-en",
      "published-ja",
    ]);
  });
});

describe("post feeds", () => {
  it("returns the curated Zenn list", () => {
    expect(listZennPosts()).toBe(zennPosts);
  });

  it("combines generated and curated external posts", () => {
    const generated: Post = {
      id: "generated",
      source: POST_SOURCES.EXTERNAL,
      title: "Generated",
      date: "2026-01-01",
      description: "Generated",
      url: "https://example.com",
    };
    expect(
      listExternalPosts({ file: { default: [generated] } }),
    ).toEqual([generated, ...externalPosts]);
    expect(listExternalPosts({})).toEqual(externalPosts);

    const broken = new Proxy(
      {},
      {
        ownKeys() {
          throw new Error("broken module map");
        },
      },
    );
    expect(listExternalPosts(broken)).toEqual(externalPosts);
  });

  it("merges all sources in descending date order", async () => {
    mockedGetCollection.mockResolvedValueOnce([
      entry("local", "2030-01-01", { description: "Local" }),
    ] as never);

    const posts = await listAllPosts("ja");

    expect(posts[0].id).toBe("local");
    expect(posts).toEqual(
      [...posts].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );
    expect(posts.some((post) => post.source === POST_SOURCES.ZENN)).toBe(true);
    expect(posts.some((post) => post.source === POST_SOURCES.EXTERNAL)).toBe(true);
  });
});

it("merges conditional and Tailwind classes", () => {
  expect(cn("px-2", false && "hidden", "px-4", { block: true })).toBe(
    "px-4 block",
  );
});
