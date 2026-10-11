import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { listLocalPosts } from "@/lib/posts";
import { listAllPosts } from "@/lib/feed";
import { listExternalPosts } from "@/lib/external";
import { listZennPosts } from "@/lib/zenn";
import { cn } from "@/lib/utils";
import { externalPosts } from "@/data/external";
import { zennPosts } from "@/data/zenn";
import bengo4Posts from "@/data/generated/bengo4.json";

type Entry = {
  id: string;
  body?: string;
  data: { title: string; date: string; description: string; draft: boolean };
};

function entry(id: string, data: Partial<Entry["data"]> = {}, body?: string): Entry {
  return {
    id,
    body,
    data: { title: id, date: "2025-01-01", description: "desc", draft: false, ...data },
  };
}

const collections: Record<string, Entry[]> = { postsJa: [], postsEn: [] };

beforeEach(() => {
  collections.postsJa = [];
  collections.postsEn = [];
  vi.mocked(getCollection).mockImplementation(
    (async (name: string) => collections[name]) as never,
  );
});

describe("listLocalPosts", () => {
  it("maps Japanese entries to posts sorted by date desc", async () => {
    collections.postsJa = [
      entry("old", { date: "2024-01-01" }),
      entry("new", { date: "2025-06-01" }),
    ];

    const posts = await listLocalPosts();

    expect(getCollection).toHaveBeenCalledWith("postsJa");
    expect(posts.map((p) => p.id)).toEqual(["new", "old"]);
    expect(posts[0]).toEqual({
      id: "new",
      source: "Blog",
      slug: "new",
      title: "new",
      date: "2025-06-01",
      description: "desc",
      draft: false,
      ogImage: "/og/new.png",
      locale: "ja",
    });
  });

  it("falls back to a plain-text description extracted from the body", async () => {
    const body = [
      "# Heading",
      "",
      "Some **bold** and _italic_ ~~gone~~ text with `code` and a [link](https://example.com).",
      "![image](https://example.com/a.png)",
      "- list item",
      "> quote",
      "---",
      "```ts",
      "const hidden = true;",
      "```",
    ].join("\n");
    collections.postsJa = [
      entry("a", { description: "" }, body),
      entry("b", { description: "" }),
    ];

    const [a, b] = await listLocalPosts("ja");

    expect(a.description).toBe(
      "Heading Some bold and italic gone text with and a link. list item quote",
    );
    expect(b.description).toBe("");
  });

  it("truncates long fallback descriptions to 200 characters", async () => {
    collections.postsJa = [entry("long", { description: "" }, "あ".repeat(250))];

    const [post] = await listLocalPosts("ja");

    expect(post.description).toBe(`${"あ".repeat(200)}...`);
  });

  it("includes drafts outside production", async () => {
    vi.stubEnv("PROD", false);
    collections.postsJa = [entry("draft", { draft: true }), entry("pub")];

    const posts = await listLocalPosts("ja");

    expect(posts.map((p) => p.id).sort()).toEqual(["draft", "pub"]);
  });

  it("excludes drafts in production", async () => {
    vi.stubEnv("PROD", true);
    collections.postsJa = [entry("draft", { draft: true }), entry("pub")];

    const posts = await listLocalPosts("ja");

    expect(posts.map((p) => p.id)).toEqual(["pub"]);
  });

  it("merges Japanese-only posts into English listings", async () => {
    vi.stubEnv("PROD", true);
    collections.postsEn = [
      entry("both", { date: "2025-01-01" }),
      entry("en-draft", { draft: true }),
    ];
    collections.postsJa = [
      entry("both", { date: "2025-01-01" }),
      entry("ja-only", { date: "2025-02-01" }),
      entry("ja-draft", { draft: true }),
    ];

    const posts = await listLocalPosts("en");

    expect(posts.map((p) => [p.id, p.locale, p.ogImage])).toEqual([
      ["ja-only", "ja", "/og/ja-only.png"],
      ["both", "en", "/en/og/both.png"],
    ]);
  });
});

describe("listZennPosts / listExternalPosts", () => {
  it("returns the curated Zenn posts", () => {
    expect(listZennPosts()).toBe(zennPosts);
  });

  it("combines generated Bengo4 posts with curated external posts", () => {
    expect(listExternalPosts()).toEqual([...bengo4Posts, ...externalPosts]);
  });
});

describe("listAllPosts", () => {
  it("merges every source sorted by date desc", async () => {
    collections.postsJa = [entry("future", { date: "2999-01-01" })];

    const posts = await listAllPosts();
    const times = posts.map((p) => new Date(p.date).getTime());

    expect(posts[0].id).toBe("future");
    expect(posts).toHaveLength(
      1 + zennPosts.length + bengo4Posts.length + externalPosts.length,
    );
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it("uses the English collection when requested", async () => {
    await listAllPosts("en");

    expect(getCollection).toHaveBeenCalledWith("postsEn");
  });
});

describe("cn", () => {
  it("joins conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("px-2", false && "hidden", ["py-1"], "px-4")).toBe("py-1 px-4");
  });
});
