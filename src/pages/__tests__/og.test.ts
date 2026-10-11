import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { generateOgImage } from "@/lib/og";
import * as jaOg from "../og/[slug].png";
import * as enOg from "../en/og/[slug].png";
import * as siteOg from "../og/site.png";

vi.mock("@/lib/og", () => ({
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

describe.each([
  ["ja", jaOg, "postsJa"],
  ["en", enOg, "postsEn"],
])("%s OG image route", (_, route, collection) => {
  it("creates a path per published post, preferring ogTitle", async () => {
    vi.stubEnv("PROD", true);
    const paths = await route.getStaticPaths({} as never);

    expect(getCollection).toHaveBeenCalledWith(collection);
    expect(paths).toEqual([
      { params: { slug: "plain" }, props: { title: "Plain" } },
      { params: { slug: "custom" }, props: { title: "Custom\nOG" } },
    ]);
  });

  it("renders the PNG for the given title", async () => {
    const res = await route.GET({ props: { title: "Hello" } } as never);

    expect(generateOgImage).toHaveBeenCalledWith("Hello");
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(await res.text()).toBe("png:Hello");
  });
});

describe("site OG image route", () => {
  it("renders the PNG for the site name", async () => {
    const res = await siteOg.GET({} as never);

    expect(generateOgImage).toHaveBeenCalledWith("ktsu2i.dev");
    expect(res.headers.get("Content-Type")).toBe("image/png");
  });
});
