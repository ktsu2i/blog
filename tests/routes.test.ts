import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

vi.mock("@/lib/og", () => ({
  generateOgImage: vi.fn(async (title: string) => Buffer.from(`png:${title}`)),
}));

const { generateOgImage } = await import("@/lib/og");
const jaFeed = await import("@/pages/feed.xml");
const enFeed = await import("@/pages/en/feed.xml");
const jaOg = await import("@/pages/og/[slug].png");
const enOg = await import("@/pages/en/og/[slug].png");
const siteOg = await import("@/pages/og/site.png");

const entries = [
  { id: "old", data: { title: "Old", date: "2024-01-01", description: "o", draft: false } },
  { id: "draft", data: { title: "Draft", date: "2025-03-01", description: "d", draft: true } },
  {
    id: "new",
    data: { title: "New", ogTitle: "New\nOG", date: "2025-02-01", description: "n", draft: false },
  },
];

beforeEach(() => {
  vi.mocked(getCollection).mockResolvedValue(entries as never);
});

const context = { site: new URL("https://ktsu2i.dev") } as APIContext;

describe.each([
  ["ja", jaFeed, "postsJa", "https://ktsu2i.dev/blog/"],
  ["en", enFeed, "postsEn", "https://ktsu2i.dev/en/blog/"],
])("%s RSS feed", (_, feed, collection, base) => {
  it("lists published posts newest first", async () => {
    const xml = await (await feed.GET(context)).text();

    expect(getCollection).toHaveBeenCalledWith(collection);
    expect(xml).not.toContain("Draft");
    expect(xml.indexOf(`${base}new/`)).toBeGreaterThan(-1);
    expect(xml.indexOf(`${base}new/`)).toBeLessThan(xml.indexOf(`${base}old/`));
  });
});

describe.each([
  ["ja", jaOg, "postsJa"],
  ["en", enOg, "postsEn"],
])("%s OG image route", (_, route, collection) => {
  it("creates a path per post, preferring ogTitle", async () => {
    const paths = await route.getStaticPaths({} as never);

    expect(getCollection).toHaveBeenCalledWith(collection);
    expect(paths).toEqual([
      { params: { slug: "old" }, props: { title: "Old" } },
      { params: { slug: "draft" }, props: { title: "Draft" } },
      { params: { slug: "new" }, props: { title: "New\nOG" } },
    ]);
  });

  it("renders the PNG for the given title", async () => {
    const res = await route.GET({ props: { title: "Hello" } } as never);

    expect(generateOgImage).toHaveBeenCalledWith("Hello");
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(await res.text()).toBe("png:Hello");
  });
});

describe("site OG image route", () => {
  it("renders the PNG for the site name", async () => {
    const res = await siteOg.GET({} as never);

    expect(generateOgImage).toHaveBeenCalledWith("ktsu2i.dev");
    expect(res.headers.get("Content-Type")).toBe("image/png");
  });
});
