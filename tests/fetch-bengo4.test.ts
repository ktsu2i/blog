import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const parseURL = vi.fn(async (url: string) => ({
    items: url.endsWith("page=1")
      ? [
          {
            author: "ktsu2i",
            link: "https://creators.bengo4.com/entry/imported",
            title: "Imported",
            pubDate: "2026-01-01T00:00:00.000Z",
            contentSnippet: "Imported description",
          },
        ]
      : [],
  }));
  const mkdirSync = vi.fn();
  const writeFileSync = vi.fn();
  const fetch = vi.fn(async () => ({
    text: async () =>
      '<meta property="og:image" content="https://example.com/imported.png">',
  }));
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
  return { parseURL, mkdirSync, writeFileSync, fetch };
});

vi.mock("rss-parser", () => ({
  default: class MockParser {
    parseURL = mocks.parseURL;
  },
}));

vi.mock("fs", () => ({
  default: {
    mkdirSync: mocks.mkdirSync,
    writeFileSync: mocks.writeFileSync,
  },
}));

import {
  cliRun,
  createPosts,
  fetchAllItems,
  fetchOgImage,
  handleCliError,
  main,
  runCli,
  writePosts,
} from "@/scripts/fetch-bengo4";

beforeAll(async () => {
  await cliRun;
});

beforeEach(() => {
  mocks.mkdirSync.mockClear();
  mocks.writeFileSync.mockClear();
});

describe("Bengo4 feed loading", () => {
  it("paginates until an empty or missing item list", async () => {
    const parseUrl = vi
      .fn()
      .mockResolvedValueOnce({ items: [{ title: "one" }] })
      .mockResolvedValueOnce({});

    expect(await fetchAllItems(parseUrl, 5)).toEqual([{ title: "one" }]);
    expect(parseUrl).toHaveBeenCalledTimes(2);
  });

  it("stops at the configured page limit", async () => {
    const parseUrl = vi.fn().mockResolvedValue({ items: [{ title: "one" }] });

    expect(await fetchAllItems(parseUrl, 1)).toEqual([{ title: "one" }]);
    expect(parseUrl).toHaveBeenCalledWith(
      "https://creators.bengo4.com/feed?page=1",
    );
  });

  it("extracts an OG image and tolerates missing or failed pages", async () => {
    const withImage = vi.fn(async () => ({
      text: async () =>
        '<html><meta property="og:image" content="https://example.com/og.png"></html>',
    }));
    const withoutImage = vi.fn(async () => ({
      text: async () => "<html></html>",
    }));
    const failed = vi.fn(async () => {
      throw new Error("offline");
    });

    expect(await fetchOgImage("https://example.com/post", withImage)).toBe(
      "https://example.com/og.png",
    );
    expect(await fetchOgImage("https://example.com/post", withoutImage)).toBe(
      undefined,
    );
    expect(await fetchOgImage("https://example.com/post", failed)).toBe(
      undefined,
    );
  });
});

describe("Bengo4 post conversion", () => {
  it("filters the author and covers optional feed fields", async () => {
    const loadOgImage = vi.fn(async (url: string) =>
      url.endsWith("complete") ? "https://example.com/og.png" : undefined,
    );
    const now = () => new Date("2020-01-01T00:00:00.000Z");

    const posts = await createPosts(
      [
        {
          author: "ktsu2i",
          link: "https://example.com/complete",
          title: "Complete",
          pubDate: "2026-01-01T00:00:00.000Z",
          contentSnippet: "x".repeat(250),
        },
        {
          author: "ktsu2i",
          link: "https://example.com/no-image",
          title: "No image",
        },
        { author: "ktsu2i", guid: "guid-id", title: "Guid" },
        { author: "ktsu2i" },
        { author: "someone-else", title: "Ignored" },
      ],
      loadOgImage,
      now,
    );

    expect(posts).toHaveLength(4);
    expect(posts[0]).toMatchObject({
      id: "bengo4-complete",
      source: "External",
      title: "Complete",
      date: "2026-01-01T00:00:00.000Z",
      description: "x".repeat(200),
      url: "https://example.com/complete",
      ogImage: "https://example.com/og.png",
    });
    expect(posts[1]).not.toHaveProperty("ogImage");
    expect(posts[2].id).toBe("bengo4-guid-id");
    expect(posts[3]).toMatchObject({
      id: "bengo4-",
      title: "",
      date: "2020-01-01T00:00:00.000Z",
      description: "",
      url: "",
    });
    expect(loadOgImage).toHaveBeenCalledTimes(2);
  });

  it("uses the default clock for missing publication dates", async () => {
    const [post] = await createPosts([{ author: "ktsu2i" }]);
    expect(Number.isNaN(Date.parse(post.date))).toBe(false);
  });

  it("fails loudly when the expected author disappears", async () => {
    await expect(createPosts([{ author: "other" }])).rejects.toThrow(
      "No posts by ktsu2i found",
    );
  });
});

describe("Bengo4 command orchestration", () => {
  it("writes formatted generated data", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const posts = [
      {
        id: "post",
        source: "External" as const,
        title: "Post",
        date: "2026-01-01",
        description: "Description",
      },
    ];

    writePosts(posts, "/workspace");

    expect(mocks.mkdirSync).toHaveBeenCalledWith(
      "/workspace/src/data/generated",
      { recursive: true },
    );
    expect(mocks.writeFileSync).toHaveBeenCalledWith(
      "/workspace/src/data/generated/bengo4.json",
      JSON.stringify(posts, null, 2),
    );
    expect(log).toHaveBeenCalledWith(
      "Fetched 1 posts from Bengo4 Creators Blog.",
    );
  });

  it("loads, converts, and delegates writing", async () => {
    const write = vi.fn();
    await main(
      async () => [
        {
          author: "ktsu2i",
          guid: "post",
          title: "Post",
          pubDate: "2026-01-01T00:00:00.000Z",
        },
      ],
      write,
    );
    expect(write).toHaveBeenCalledWith([
      expect.objectContaining({ id: "bengo4-post", title: "Post" }),
    ]);
  });

  it("runs successful tasks and reports rejected tasks", async () => {
    const success = vi.fn(async () => undefined);
    const failure = vi.fn(async () => {
      throw new Error("failed");
    });
    const onError = vi.fn();

    await runCli(success, onError);
    expect(success).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();

    await runCli(failure, onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: "failed" }));
  });

  it("logs CLI failures and sets a failing exit code", () => {
    const previousExitCode = process.exitCode;
    const error = new Error("failed");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    handleCliError(error);

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to fetch Bengo4 RSS:",
      error,
    );
    expect(process.exitCode).toBe(1);
    process.exitCode = previousExitCode;
  });
});
