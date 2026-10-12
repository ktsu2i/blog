import type { Code, Html, Root, RootContent } from "mdast";
import { describe, expect, it } from "vitest";
import remarkMermaid from "./remark-mermaid";

const FLOWCHART = "graph LR\n  A[記事] --> B[公開]";

const code = (value: string, lang?: string): Code => ({
  type: "code",
  lang,
  value,
  position: {
    start: { line: 3, column: 1 },
    end: { line: 5, column: 4 },
  },
});

function transform(...children: RootContent[]): Root {
  const tree: Root = { type: "root", children };
  remarkMermaid()(tree);
  return tree;
}

describe("remarkMermaid", () => {
  it("renders a mermaid code block to an inline SVG figure", () => {
    const [node] = transform(code(FLOWCHART, "mermaid")).children as Html[];

    expect(node.type).toBe("html");
    expect(node.value).toMatch(/^<figure class="mermaid"><svg [^>]*>/);
    expect(node.value).toMatch(/<\/svg><\/figure>$/);
    expect(node.value).toContain("記事");
    expect(node.value).toContain("--bg:var(--background)");
    expect(node.value).toContain("--muted:var(--muted-foreground)");
    expect(node.value).not.toContain("@import");
  });

  it("prefixes marker IDs per diagram so they stay unique", () => {
    const [first, second] = transform(
      code(FLOWCHART, "mermaid"),
      code(FLOWCHART, "mermaid"),
    ).children as Html[];

    expect(first.value).toContain('id="mermaid-0-arrowhead"');
    expect(first.value).toContain('marker-end="url(#mermaid-0-arrowhead)"');
    expect(second.value).toContain('id="mermaid-1-arrowhead"');
    expect(second.value).toContain('marker-end="url(#mermaid-1-arrowhead)"');
    expect(first.value).not.toMatch(/\sid="arrowhead/);
  });

  it("renders diagrams nested inside other blocks", () => {
    const tree = transform({
      type: "blockquote",
      children: [code(FLOWCHART, "mermaid")],
    });

    expect(tree.children[0]).toMatchObject({
      type: "blockquote",
      children: [{ type: "html" }],
    });
  });

  it.each([
    ["another language", code(FLOWCHART, "ts")],
    ["no language", code(FLOWCHART)],
  ])("leaves code blocks with %s untouched", (_, node) => {
    expect(transform(node).children).toEqual([node]);
  });

  it("fails with the source line on unsupported diagrams", () => {
    expect(() => transform(code('pie\n  "a": 1', "mermaid"))).toThrow(
      /^\[remark-mermaid\] Failed to render diagram at line 3: Error: Invalid mermaid header/,
    );
  });

  it("falls back to ? when the block has no position", () => {
    const node: RootContent = { type: "code", lang: "mermaid", value: "pie" };

    expect(() => transform(node)).toThrow(/at line \?:/);
  });
});
