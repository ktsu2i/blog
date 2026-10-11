import { describe, expect, it } from "vitest";
import { getPostHref, isJapaneseOnly } from "./post-link";
import { POST_SOURCES, type Post } from "./types";

const blogPost: Post = {
  id: "hello",
  source: POST_SOURCES.BLOG,
  title: "Hello",
  date: "2026-01-01",
  description: "",
  slug: "hello",
  locale: "ja",
};

const zennPost: Post = {
  id: "zenn-1",
  source: POST_SOURCES.ZENN,
  title: "Zenn",
  date: "2026-01-01",
  description: "",
  url: "https://zenn.dev/ktsu2i/articles/1",
};

describe("isJapaneseOnly", () => {
  it("flags non-en posts on the en locale", () => {
    expect(isJapaneseOnly(blogPost, "en")).toBe(true);
    expect(isJapaneseOnly(zennPost, "en")).toBe(true);
  });

  it("ignores translated posts and the ja locale", () => {
    expect(isJapaneseOnly({ ...blogPost, locale: "en" }, "en")).toBe(false);
    expect(isJapaneseOnly(blogPost, "ja")).toBe(false);
  });
});

describe("getPostHref", () => {
  it("links local posts under the current locale", () => {
    expect(getPostHref(blogPost, "ja")).toBe("/blog/hello");
    expect(getPostHref({ ...blogPost, locale: "en" }, "en")).toBe(
      "/en/blog/hello",
    );
  });

  it("falls back to the ja route for untranslated posts", () => {
    expect(getPostHref(blogPost, "en")).toBe("/blog/hello");
  });

  it("uses the url for external posts and slugless local posts", () => {
    expect(getPostHref(zennPost, "en")).toBe(zennPost.url);
    expect(getPostHref({ ...blogPost, slug: undefined }, "ja")).toBeUndefined();
  });
});
