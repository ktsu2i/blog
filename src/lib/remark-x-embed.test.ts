import type { PhrasingContent, Root, RootContent } from "mdast";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import remarkXEmbed from "./remark-x-embed";

const POST_URL = "https://x.com/ktsu2i/status/1234567890";
const EMBED_HTML = '<blockquote class="twitter-tweet">post</blockquote>';

const paragraph = (...children: PhrasingContent[]): RootContent => ({
  type: "paragraph",
  children,
});
const text = (value: string): PhrasingContent => ({ type: "text", value });
const link = (
  url: string,
  ...children: PhrasingContent[]
): PhrasingContent => ({
  type: "link",
  url,
  children,
});

async function transform(...children: RootContent[]): Promise<Root> {
  const tree: Root = { type: "root", children };
  await remarkXEmbed()(tree);
  return tree;
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(Response.json({ html: `${EMBED_HTML}\n\n` }));
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe("remarkXEmbed", () => {
  it("embeds a bare autolinked post URL", async () => {
    const tree = await transform(paragraph(link(POST_URL, text(POST_URL))));

    expect(tree.children).toEqual([
      { type: "html", value: `<div class="x-embed">${EMBED_HTML}</div>` },
    ]);
    const endpoint = new URL(fetchMock.mock.calls[0][0] as URL);
    expect(endpoint.origin + endpoint.pathname).toBe(
      "https://publish.x.com/oembed",
    );
    expect(Object.fromEntries(endpoint.searchParams)).toEqual({
      url: POST_URL,
      omit_script: "true",
      dnt: "true",
    });
  });

  it.each([
    "https://twitter.com/ktsu2i/status/1234567890",
    "https://mobile.x.com/ktsu2i/status/1234567890/",
    "https://x.com/ktsu2i/status/1234567890?s=20",
  ])("embeds %s given as plain text", async (url) => {
    const tree = await transform(paragraph(text(` ${url} `)));

    expect(tree.children[0].type).toBe("html");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it.each([
    ["a non-X URL", paragraph(text("https://example.com/a/status/1"))],
    ["an X profile URL", paragraph(text("https://x.com/ktsu2i"))],
    ["plain text", paragraph(text("hello world"))],
    ["a labeled link", paragraph(link(POST_URL, text("my post")))],
    [
      "a link with formatted text",
      paragraph(
        link(POST_URL, { type: "emphasis", children: [text(POST_URL)] }),
      ),
    ],
    [
      "a link with several children",
      paragraph(link(POST_URL, text(POST_URL), text("!"))),
    ],
    [
      "a URL inside a sentence",
      paragraph(text("see "), link(POST_URL, text(POST_URL))),
    ],
    ["a non-paragraph node", { type: "code", value: POST_URL } as RootContent],
  ])("leaves %s untouched", async (_, node) => {
    const tree = await transform(structuredClone(node));

    expect(tree.children).toEqual([node]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the link when oEmbed returns an error status", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }));
    const node = paragraph(link(POST_URL, text(POST_URL)));

    const tree = await transform(structuredClone(node));

    expect(tree.children).toEqual([node]);
    expect(console.error).toHaveBeenCalledWith(
      `[remark-x-embed] 404 for ${POST_URL}`,
    );
  });

  it("keeps the link when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));
    const node = paragraph(link(POST_URL, text(POST_URL)));

    const tree = await transform(structuredClone(node));

    expect(tree.children).toEqual([node]);
    expect(console.error).toHaveBeenCalledWith(
      `[remark-x-embed] Failed to fetch ${POST_URL}: Error: timeout`,
    );
  });
});
