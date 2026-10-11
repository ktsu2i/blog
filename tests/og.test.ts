import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";

const FONT = fs.readFileSync(
  path.resolve("node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff"),
);
const CSS = "@font-face { src: url(https://fonts.example/noto.woff) format('woff'); }";

function stubFontFetch(css = CSS) {
  const fetchMock = vi.fn(async (url: string) =>
    url.startsWith("https://fonts.googleapis.com")
      ? new Response(css)
      : new Response(FONT),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function loadOg() {
  return import("@/lib/og");
}

beforeEach(() => {
  vi.resetModules();
});

describe("generateOgImage", () => {
  it("renders a 1200x630 PNG and caches the downloaded font", async () => {
    const fetchMock = stubFontFetch();
    const { generateOgImage } = await loadOg();

    const short = await generateOgImage("Short title");
    const multiline = await generateOgImage(
      "A considerably longer title that wraps\nonto a second line",
    );

    for (const png of [short, multiline]) {
      const meta = await sharp(png).metadata();
      expect(meta.format).toBe("png");
      expect([meta.width, meta.height]).toEqual([1200, 630]);
    }
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("https://fonts.example/noto.woff");
  });

  it("throws when the font CSS has no URL", async () => {
    stubFontFetch("/* empty */");
    const { generateOgImage } = await loadOg();

    await expect(generateOgImage("x")).rejects.toThrow(
      "Failed to parse Noto Sans JP font URL",
    );
  });
});
