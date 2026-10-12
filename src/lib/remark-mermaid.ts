import { renderMermaidSVG } from "beautiful-mermaid";
import type { Html, Root } from "mdast";
import { visit } from "unist-util-visit";

// Theme colors follow the site's CSS variables, so dark mode needs no re-render
const THEME = {
  bg: "var(--background)",
  fg: "var(--foreground)",
  accent: "var(--prose-accent)",
  // The default muted mix is too faint for edge labels to pass WCAG contrast
  muted: "var(--muted-foreground)",
  transparent: true,
};

function renderDiagram(code: string, prefix: string): string {
  return (
    renderMermaidSVG(code, THEME)
      // The site serves its own fonts; skip the Google Fonts requests
      .replace(/^\s*@import url\(.*\);\n/gm, "")
      // Marker IDs repeat per diagram; keep them unique within the page
      .replace(/(\sid=")/g, `$1${prefix}`)
      .replace(/url\(#/g, `url(#${prefix}`)
  );
}

// Renders ```mermaid code blocks to inline SVG at build time.
// Unsupported or malformed diagrams fail the build instead of shipping raw code.
export default function remarkMermaid() {
  return (tree: Root) => {
    let count = 0;
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) return;
      const prefix = `mermaid-${count++}-`;
      let svg: string;
      try {
        svg = renderDiagram(node.value, prefix);
      } catch (error) {
        throw new Error(
          `[remark-mermaid] Failed to render diagram at line ${node.position?.start.line ?? "?"}: ${String(error)}`,
          { cause: error },
        );
      }
      const figure: Html = {
        type: "html",
        value: `<figure class="mermaid">${svg}</figure>`,
      };
      parent.children[index] = figure;
    });
  };
}
