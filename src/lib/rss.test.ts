import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { buildRssFeed } from "./rss";
import { useTranslations } from "../i18n/config";

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
  ["ja", "postsJa", "https://ktsu2i.dev/blog/"],
  ["en", "postsEn", "https://ktsu2i.dev/en/blog/"],
] as const)("buildRssFeed (%s)", (locale, collection, base) => {
  it("lists published posts newest first", async () => {
    vi.stubEnv("PROD", true);
    const xml = await (await buildRssFeed(context, locale)).text();

    expect(getCollection).toHaveBeenCalledWith(collection);
    expect(xml).not.toContain("Draft");
    expect(xml.indexOf(`${base}new/`)).toBeGreaterThan(-1);
    expect(xml.indexOf(`${base}new/`)).toBeLessThan(xml.indexOf(`${base}old/`));
  });

  it("uses the localized site description", async () => {
    const xml = await (await buildRssFeed(context, locale)).text();

    expect(xml).toContain(
      `<description>${useTranslations(locale)["common.siteDescription"]}</description>`,
    );
  });

  it("falls back to the body when the description is empty", async () => {
    const xml = await (await buildRssFeed(context, locale)).text();

    expect(xml).toContain("<description>Excerpt from the body</description>");
  });
});
