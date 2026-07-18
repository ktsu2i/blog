import { beforeEach, describe, expect, it, vi } from "vitest";

interface TitleNode {
  props: {
    style: { fontSize: number };
    children: string | TitleNode[];
  };
}

interface RenderTree {
  props: {
    children: [
      unknown,
      unknown,
      { props: { children: [{ props: { children: TitleNode } }] } },
    ];
  };
}

const ogMocks = vi.hoisted(() => {
  const satori = vi.fn(
    async (_tree: unknown, _options: unknown) => "<svg>rendered</svg>",
  );
  const toBuffer = vi.fn(async () => Buffer.from("png"));
  const png = vi.fn(() => ({ toBuffer }));
  const sharp = vi.fn(() => ({ png }));
  return { satori, sharp, png, toBuffer };
});

vi.mock("satori", () => ({ default: ogMocks.satori }));
vi.mock("sharp", () => ({ default: ogMocks.sharp }));

import { generateOgImage } from "@/lib/og";

beforeEach(() => {
  ogMocks.satori.mockClear();
  ogMocks.sharp.mockClear();
  ogMocks.png.mockClear();
  ogMocks.toBuffer.mockClear();
});

describe("generateOgImage", () => {
  it("rejects CSS without a Noto Sans JP font URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ text: async () => "body {}" })),
    );

    await expect(generateOgImage("Title")).rejects.toThrow(
      "Failed to parse Noto Sans JP font URL",
    );
  });

  it("loads and caches the font and renders long, multiline and short titles", async () => {
    const font = new Uint8Array([1, 2, 3]).buffer;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        text: async () =>
          "@font-face { src: url(https://example.com/noto.woff2) format('woff2'); }",
      })
      .mockResolvedValueOnce({ arrayBuffer: async () => font });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      generateOgImage(`${"長".repeat(31)}\nsecond line`),
    ).resolves.toEqual(Buffer.from("png"));
    await expect(generateOgImage("Short title")).resolves.toEqual(
      Buffer.from("png"),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/noto.woff2",
    );
    expect(ogMocks.satori).toHaveBeenCalledTimes(2);

    const [untypedLongTree, longOptions] = ogMocks.satori.mock.calls[0];
    const longTree = untypedLongTree as RenderTree;
    const longTitle = longTree.props.children[2].props.children[0].props.children;
    expect(longTitle.props.style.fontSize).toBe(44);
    expect(longTitle.props.children).toHaveLength(2);
    expect(longOptions).toMatchObject({ width: 1200, height: 630 });

    const [untypedShortTree] = ogMocks.satori.mock.calls[1];
    const shortTree = untypedShortTree as RenderTree;
    const shortTitle = shortTree.props.children[2].props.children[0].props.children;
    expect(shortTitle.props.style.fontSize).toBe(52);
    expect(shortTitle.props.children).toBe("Short title");
    expect(ogMocks.sharp).toHaveBeenCalledWith(
      Buffer.from("<svg>rendered</svg>"),
    );
    expect(ogMocks.png).toHaveBeenCalledTimes(2);
    expect(ogMocks.toBuffer).toHaveBeenCalledTimes(2);
  });
});
