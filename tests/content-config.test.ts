import { describe, expect, it } from "vitest";
import { collections, generatePostId } from "../src/content.config";

describe("content collections", () => {
  it("normalizes dated markdown file names", () => {
    expect(generatePostId({ entry: "20260301-start-blog.mdx" })).toBe(
      "start-blog",
    );
    expect(generatePostId({ entry: "nested/20240101-post.md" })).toBe(
      "nested/post",
    );
    expect(generatePostId({ entry: "nested/post.txt" })).toBe(
      "nested/post.txt",
    );
  });

  it("defines Japanese and English collections with validated defaults", () => {
    expect(Object.keys(collections)).toEqual(["postsJa", "postsEn"]);

    const jaCollection = collections.postsJa as unknown as {
      schema: { parse(input: unknown): unknown };
    };
    expect(
      jaCollection.schema.parse({
        title: "Title",
        date: "2026-01-01",
      }),
    ).toEqual({
      title: "Title",
      date: "2026-01-01",
      description: "",
      draft: false,
    });
  });
});
