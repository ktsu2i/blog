import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Every post is written in both languages; pages, hreflang and the language
// toggle all assume the counterpart exists
const POSTS_DIR = new URL("./posts/", import.meta.url);

function readDrafts(locale: string): Record<string, boolean> {
  const dir = new URL(`${locale}/`, POSTS_DIR);
  const files = readdirSync(dir).filter((file) => /\.mdx?$/.test(file));
  return Object.fromEntries(
    files.map((file) => {
      const source = readFileSync(new URL(file, dir), "utf8");
      const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? "";
      return [file, /^draft:\s*true\s*$/m.test(frontmatter)];
    }),
  );
}

describe("posts", () => {
  const ja = readDrafts("ja");
  const en = readDrafts("en");

  it("exist in both Japanese and English", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ja).sort());
  });

  it("share the draft flag across languages", () => {
    expect(en).toEqual(ja);
  });
});
