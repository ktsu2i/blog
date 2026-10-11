import { describe, expect, it, vi } from "vitest";

vi.mock("astro/loaders", () => ({
  glob: (options: unknown) => options,
}));

const { collections } = await import("./content.config");

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

  it("applies frontmatter defaults", () => {
    const schema = collections.postsJa.schema as {
      parse: (value: unknown) => unknown;
    };

    expect(schema.parse({ title: "t", date: "2025-01-01" })).toEqual({
      title: "t",
      date: "2025-01-01",
      description: "",
      draft: false,
    });
    expect(() => schema.parse({ date: "2025-01-01" })).toThrow();
  });
});
