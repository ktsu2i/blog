import type { Html, Paragraph, Root } from "mdast";

const OEMBED_ENDPOINT = "https://publish.x.com/oembed";
const X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
]);
const STATUS_PATH = /^\/\w+\/status\/\d+\/?$/;

interface OEmbedResponse {
  html: string;
}

function isXPostUrl(value: string): boolean {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return X_HOSTS.has(url.hostname) && STATUS_PATH.test(url.pathname);
}

// Matches the bare-link paragraphs remark-link-card-plus turns into cards
function getBareUrl(paragraph: Paragraph): string | undefined {
  if (paragraph.children.length !== 1) return undefined;
  const [child] = paragraph.children;
  if (child.type === "text") return child.value.trim();
  if (child.type !== "link" || child.children.length !== 1) return undefined;
  const [text] = child.children;
  if (text.type !== "text" || text.value !== child.url) return undefined;
  return child.url;
}

async function fetchEmbedHtml(url: string): Promise<string | undefined> {
  const endpoint = new URL(OEMBED_ENDPOINT);
  endpoint.searchParams.set("url", url);
  // widgets.js is loaded once by the page, not per embed
  endpoint.searchParams.set("omit_script", "true");
  endpoint.searchParams.set("dnt", "true");
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.error(`[remark-x-embed] ${res.status} for ${url}`);
      return undefined;
    }
    const { html } = (await res.json()) as OEmbedResponse;
    return html.trim();
  } catch (error) {
    console.error(`[remark-x-embed] Failed to fetch ${url}: ${String(error)}`);
    return undefined;
  }
}

// Replaces bare X post URLs with the oEmbed blockquote. Must run before
// remark-link-card-plus; failed fetches are left for it to render as cards.
export default function remarkXEmbed() {
  return async (tree: Root) => {
    await Promise.all(
      tree.children.map(async (node, index) => {
        if (node.type !== "paragraph") return;
        const url = getBareUrl(node);
        if (!url || !isXPostUrl(url)) return;
        const html = await fetchEmbedHtml(url);
        if (!html) return;
        const embed: Html = {
          type: "html",
          value: `<div class="x-embed">${html}</div>`,
        };
        tree.children[index] = embed;
      }),
    );
  };
}
