import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { generateOgImage } from "./og";
import { getOgImagePaths, ogImageResponse } from "./og-route";

vi.mock("./og", () => ({
  generateOgImage: vi.fn(async (title: string) => Buffer.from(`png:${title}`)),
}));

const entries = [
  { id: "plain", data: { title: "Plain", draft: false } },
  {
    id: "custom",
    data: { title: "Custom", ogTitle: "Custom\nOG", draft: false },
  },
  { id: "draft", data: { title: "Draft", draft: true } },
];

beforeEach(() => {
  vi.mocked(getCollection).mockResolvedValue(entries as never);
});

describe("getOgImagePaths", () => {
  it.each(["postsJa", "postsEn"] as const)(
    "creates a path per published post in %s, preferring ogTitle",
    async (collection) => {
      vi.stubEnv("PROD", true);
      const paths = await getOgImagePaths(collection);

      expect(getCollection).toHaveBeenCalledWith(collection);
      expect(paths).toEqual([
        { params: { slug: "plain" }, props: { title: "Plain" } },
        { params: { slug: "custom" }, props: { title: "Custom\nOG" } },
      ]);
    },
  );
});

describe("ogImageResponse", () => {
  it("renders the PNG for the given title", async () => {
    const res = await ogImageResponse("Hello");

    expect(generateOgImage).toHaveBeenCalledWith("Hello");
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(await res.text()).toBe("png:Hello");
  });
});
