import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { parseURL, mkdirSync, writeFileSync } = vi.hoisted(() => ({
  parseURL: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("rss-parser", () => ({
  default: class {
    parseURL = parseURL;
  },
}));

vi.mock("fs", () => ({
  default: { mkdirSync, writeFileSync },
}));

type Item = Record<string, string | undefined>;

function stubPages(pages: (Item[] | undefined)[]) {
  parseURL.mockImplementation(async (url: string) => {
    const page = Number(new URL(url).searchParams.get("page"));
    return { items: pages[page - 1] ?? [] };
  });
}

async function run() {
  vi.resetModules();
  await import("@/scripts/fetch-bengo4");
  // The script runs main() on import without exposing its promise;
  // vi.waitFor is avoided because it advances the faked clock
  const exit = vi.mocked(process.exit);
  while (!writeFileSync.mock.calls.length && !exit.mock.calls.length) {
    await new Promise((resolve) => setImmediate(resolve));
  }
}

function writtenPosts() {
  const [file, json] = writeFileSync.mock.calls[0];
  expect(file).toBe(path.join(process.cwd(), "src/data/generated/bengo4.json"));
  return JSON.parse(json);
}

beforeEach(() => {
  parseURL.mockReset();
  mkdirSync.mockReset();
  writeFileSync.mockReset();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(process, "exit").mockImplementation((() => {}) as never);
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-01-02T03:04:05Z") });
});

describe("fetch-bengo4", () => {
  it("collects the author's posts across pages and writes them to JSON", async () => {
    stubPages([
      [
        {
          author: "ktsu2i",
          link: "https://creators.bengo4.com/entry/2026/01/01/120000",
          title: "Full",
          pubDate: "Thu, 01 Jan 2026 03:00:00 GMT",
          contentSnippet: "x".repeat(250),
        },
        { author: "someone-else", title: "Other" },
      ],
      [
        { author: "ktsu2i", guid: "tag:guid-only" },
        { author: "ktsu2i", link: "https://creators.bengo4.com/entry/no-og" },
        { author: "ktsu2i", link: "https://creators.bengo4.com/entry/broken" },
      ],
      undefined,
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/broken")) throw new Error("network");
        if (url.endsWith("/no-og")) return new Response("<html></html>");
        return new Response(
          '<meta property="og:image" content="https://cdn.example/og.png">',
        );
      }),
    );

    await run();

    expect(parseURL.mock.calls.map(([url]) => url)).toEqual([
      "https://creators.bengo4.com/feed?page=1",
      "https://creators.bengo4.com/feed?page=2",
      "https://creators.bengo4.com/feed?page=3",
    ]);
    expect(mkdirSync).toHaveBeenCalledWith(
      path.join(process.cwd(), "src/data/generated"),
      { recursive: true },
    );
    expect(writtenPosts()).toEqual([
      {
        id: "bengo4-entry-2026-01-01-120000",
        source: "External",
        title: "Full",
        date: "2026-01-01T03:00:00.000Z",
        description: "x".repeat(200),
        url: "https://creators.bengo4.com/entry/2026/01/01/120000",
        ogImage: "https://cdn.example/og.png",
      },
      {
        id: "bengo4-tag:guid-only",
        source: "External",
        title: "",
        date: "2026-01-02T03:04:05.000Z",
        description: "",
        url: "",
      },
      {
        id: "bengo4-entry-no-og",
        source: "External",
        title: "",
        date: "2026-01-02T03:04:05.000Z",
        description: "",
        url: "https://creators.bengo4.com/entry/no-og",
      },
      {
        id: "bengo4-entry-broken",
        source: "External",
        title: "",
        date: "2026-01-02T03:04:05.000Z",
        description: "",
        url: "https://creators.bengo4.com/entry/broken",
      },
    ]);
    expect(console.log).toHaveBeenCalledWith(
      "Fetched 4 posts from Bengo4 Creators Blog.",
    );
  });

  it("falls back to an empty id when an item has neither link nor guid", async () => {
    stubPages([[{ author: "ktsu2i", title: "Bare" }]]);

    await run();

    expect(writtenPosts()[0].id).toBe("bengo4-");
  });

  it("stops after the maximum page count", async () => {
    parseURL.mockResolvedValue({ items: [{ author: "ktsu2i", guid: "g" }] });

    await run();

    expect(parseURL).toHaveBeenCalledTimes(50);
    expect(writtenPosts()).toHaveLength(50);
  });

  it("treats a page without items as the end of the feed", async () => {
    parseURL.mockResolvedValue({});

    await run();

    expect(parseURL).toHaveBeenCalledTimes(1);
  });

  it("fails the process when the author has no posts", async () => {
    stubPages([[{ author: "someone-else" }]]);

    await run();

    expect(writeFileSync).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch Bengo4 RSS:",
      expect.objectContaining({
        message: expect.stringContaining("No posts by ktsu2i found"),
      }),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
