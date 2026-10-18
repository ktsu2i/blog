import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { generateOgImage } from "./og";

describe("generateOgImage", () => {
  it("renders a 1200x630 PNG from local fonts without network access", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const short = await generateOgImage("Short title");
    const multiline = await generateOgImage(
      "日本語のタイトルが長くなって折り返す場合\nonto a second line",
    );

    for (const png of [short, multiline]) {
      const meta = await sharp(png).metadata();
      expect(meta.format).toBe("png");
      expect([meta.width, meta.height]).toEqual([1200, 630]);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders kanji outside the common japanese subset", async () => {
    // Missing glyphs all fall back to the same box, so distinct images mean real glyphs
    const [a, b] = await Promise.all([
      generateOgImage("髙"),
      generateOgImage("﨑"),
    ]);

    expect(a.equals(b)).toBe(false);
  });
});
