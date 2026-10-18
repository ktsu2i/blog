import { describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { buildRssFeed } from "@/lib/rss";
import * as jaFeed from "../feed.xml";
import * as enFeed from "../en/feed.xml";

vi.mock("@/lib/rss", () => ({
  buildRssFeed: vi.fn(async () => new Response("rss")),
}));

const context = { site: new URL("https://ktsu2i.dev") } as APIContext;

describe.each([
  ["ja", jaFeed],
  ["en", enFeed],
])("%s RSS feed route", (locale, feed) => {
  it("builds the feed for its locale", async () => {
    const res = await feed.GET(context);

    expect(buildRssFeed).toHaveBeenCalledWith(context, locale);
    expect(await res.text()).toBe("rss");
  });
});
