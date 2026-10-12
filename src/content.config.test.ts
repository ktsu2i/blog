import { describe, expect, it, vi } from "vitest";

vi.mock("astro/loaders", () => ({
  glob: (options: unknown) => options,
}));

const { collections, postSchema } = await import("./content.config");

type Loader = {
  base: string;
  generateId: (options: { entry: string }) => string;
};

// The loader mock returns its options, which the Astro types don't model
const loaderOf = (collection: unknown) =>
  (collection as { loader: Loader }).loader;

describe("content collections", () => {
  it("loads each locale from its own directory", () => {
    expect(loaderOf(collections.postsJa).base).toBe("./src/content/posts/ja");
    expect(loaderOf(collections.postsEn).base).toBe("./src/content/posts/en");
  });

  it.each([
    ["20250101-hello.mdx", "hello"],
    ["hello.md", "hello"],
    ["2025/20250101-nested.mdx", "2025/nested"],
    ["20250101/keep.mdx", "20250101/keep"],
  ])("derives the id of %s as %s", (entry, expected) => {
    const { generateId } = loaderOf(collections.postsJa);
    expect(generateId({ entry })).toBe(expected);
  });

  it("uses the post schema for both locales", () => {
    expect(collections.postsJa.schema).toBe(postSchema);
    expect(collections.postsEn.schema).toBe(postSchema);
  });
});

describe("postSchema", () => {
  const valid = { title: "t", date: "2025-01-01" };

  it("applies frontmatter defaults", () => {
    expect(postSchema.parse(valid)).toEqual({
      title: "t",
      date: "2025-01-01",
      description: "",
      draft: false,
    });
  });

  it("accepts every known key", () => {
    const frontmatter = {
      title: "t",
      ogTitle: "og",
      date: "2025-01-01",
      description: "d",
      draft: true,
    };

    expect(postSchema.parse(frontmatter)).toEqual(frontmatter);
  });

  it.each(["title", "date"])("requires %s", (key) => {
    const { [key as keyof typeof valid]: _, ...rest } = valid;

    expect(postSchema.safeParse(rest).success).toBe(false);
  });

  it.each(["ogtitle", "Title", "tags"])("rejects the unknown key %s", (key) => {
    expect(postSchema.safeParse({ ...valid, [key]: "x" }).success).toBe(false);
  });

  it.each(["", "  "])("rejects the blank title %j", (title) => {
    expect(postSchema.safeParse({ ...valid, title }).success).toBe(false);
  });

  it.each(["", "  "])("rejects the blank ogTitle %j", (ogTitle) => {
    expect(postSchema.safeParse({ ...valid, ogTitle }).success).toBe(false);
  });

  it.each(["2025-02-30", "2025/01/01", "not a date", ""])(
    "rejects the invalid date %j",
    (date) => {
      expect(postSchema.safeParse({ ...valid, date }).success).toBe(false);
    },
  );

  it.each([
    ["title", 1],
    ["description", null],
    ["draft", "true"],
  ])("rejects a mistyped %s", (key, value) => {
    expect(postSchema.safeParse({ ...valid, [key]: value }).success).toBe(
      false,
    );
  });
});
