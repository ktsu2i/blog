import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import * as jaFeed from "../feed.xml";
import * as enFeed from "../en/feed.xml";
import { useTranslations } from "../../i18n/config";

const entries = [
  {
    id: "old",
    body: "Excerpt from the body",
    data: { title: "Old", date: "2024-01-01", description: "", draft: false },
  },
  {
    id: "draft",
    data: { title: "Draft", date: "2025-03-01", description: "d", draft: true },
  },
  {
    id: "new",
    data: { title: "New", date: "2025-02-01", description: "n", draft: false },
  },
];

beforeEach(() => {
  vi.mocked(getCollection).mockResolvedValue(entries as never);
});

const context = { site: new URL("https://ktsu2i.dev") } as APIContext;

describe.each([
  ["ja", jaFeed, "postsJa", "https://ktsu2i.dev/blog/"],
  ["en", enFeed, "postsEn", "https://ktsu2i.dev/en/blog/"],
] as const)("%s RSS feed", (locale, feed, collection, base) => {
  it("uses the localized site description", async () => {
    const xml = await (await feed.GET(context)).text();

    expect(xml).toContain(
      `<description>${useTranslations(locale)["common.siteDescription"]}</description>`,
    );
  });

  it("lists published posts newest first", async () => {
    const xml = await (await feed.GET(context)).text();

    expect(getCollection).toHaveBeenCalledWith(collection);
    expect(xml).not.toContain("Draft");
    expect(xml.indexOf(`${base}new/`)).toBeGreaterThan(-1);
    expect(xml.indexOf(`${base}new/`)).toBeLessThan(xml.indexOf(`${base}old/`));
  });

  it("falls back to the body when the description is empty", async () => {
    const xml = await (await feed.GET(context)).text();

    expect(xml).toContain("<description>Excerpt from the body</description>");
  });
});
