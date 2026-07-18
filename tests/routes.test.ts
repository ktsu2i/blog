import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";

const routeMocks = vi.hoisted(() => ({
  rss: vi.fn((input: unknown) => input),
  generateOgImage: vi.fn(async () => Buffer.from([1, 2, 3])),
}));

vi.mock("@astrojs/rss", () => ({ default: routeMocks.rss }));
vi.mock("@/lib/og", () => ({
  generateOgImage: routeMocks.generateOgImage,
}));

import { GET as getJaFeed } from "@/pages/feed.xml";
import { GET as getEnFeed } from "@/pages/en/feed.xml";
import {
  GET as getJaOg,
  getStaticPaths as getJaOgPaths,
} from "@/pages/og/[slug].png";
import {
  GET as getEnOg,
  getStaticPaths as getEnOgPaths,
} from "@/pages/en/og/[slug].png";
import { GET as getSiteOg } from "@/pages/og/site.png";

const mockedGetCollection = vi.mocked(getCollection);

const posts = [
  {
    id: "old",
    data: {
      title: "Old",
      ogTitle: "Old OG",
      date: "2025-01-01",
      description: "Old description",
      draft: false,
    },
  },
  {
    id: "new",
    data: {
      title: "New",
      date: "2026-01-01",
      description: "New description",
      draft: false,
    },
  },
  {
    id: "draft",
    data: {
      title: "Draft",
      date: "2027-01-01",
      description: "Draft description",
      draft: true,
    },
  },
];

beforeEach(() => {
  mockedGetCollection.mockReset();
  routeMocks.rss.mockClear();
  routeMocks.generateOgImage.mockClear();
});

describe("RSS routes", () => {
  it("builds a sorted Japanese feed without drafts", async () => {
    mockedGetCollection.mockResolvedValueOnce(posts as never);
    const context = { site: new URL("https://ktsu2i.dev") };

    const result = await getJaFeed(context as never);

    expect(mockedGetCollection).toHaveBeenCalledWith("postsJa");
    expect(result).toMatchObject({
      title: "ktsu2i.dev",
      description: "ktsu2i のブログ & ポートフォリオサイト",
      site: context.site,
      items: [
        {
          title: "New",
          description: "New description",
          link: "/blog/new/",
        },
        {
          title: "Old",
          description: "Old description",
          link: "/blog/old/",
        },
      ],
    });
  });

  it("builds a sorted English feed without drafts", async () => {
    mockedGetCollection.mockResolvedValueOnce(posts as never);
    const context = { site: new URL("https://ktsu2i.dev") };

    const result = await getEnFeed(context as never);

    expect(mockedGetCollection).toHaveBeenCalledWith("postsEn");
    expect(result).toMatchObject({
      description: "ktsu2i's blog & portfolio",
      items: [
        { title: "New", link: "/en/blog/new/" },
        { title: "Old", link: "/en/blog/old/" },
      ],
    });
  });
});

describe("OG routes", () => {
  it("creates Japanese paths with explicit and fallback OG titles", async () => {
    mockedGetCollection.mockResolvedValueOnce(posts.slice(0, 2) as never);
    await expect(getJaOgPaths({} as never)).resolves.toEqual([
      { params: { slug: "old" }, props: { title: "Old OG" } },
      { params: { slug: "new" }, props: { title: "New" } },
    ]);
    expect(mockedGetCollection).toHaveBeenCalledWith("postsJa");
  });

  it("creates English paths with explicit and fallback OG titles", async () => {
    mockedGetCollection.mockResolvedValueOnce(posts.slice(0, 2) as never);
    await expect(getEnOgPaths({} as never)).resolves.toEqual([
      { params: { slug: "old" }, props: { title: "Old OG" } },
      { params: { slug: "new" }, props: { title: "New" } },
    ]);
    expect(mockedGetCollection).toHaveBeenCalledWith("postsEn");
  });

  it.each([
    ["Japanese", getJaOg],
    ["English", getEnOg],
  ])("returns a PNG response for the %s post route", async (_name, handler) => {
    const response = await handler({ props: { title: "Post title" } } as never);

    expect(routeMocks.generateOgImage).toHaveBeenCalledWith("Post title");
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new Uint8Array([1, 2, 3]),
    );
  });

  it("returns the site OG image", async () => {
    const response = await getSiteOg({} as never);
    expect(routeMocks.generateOgImage).toHaveBeenCalledWith("ktsu2i.dev");
    expect(response.headers.get("Content-Type")).toBe("image/png");
  });
});
