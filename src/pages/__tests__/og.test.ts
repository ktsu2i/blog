import { describe, expect, it, vi } from "vitest";
import { getOgImagePaths, ogImageResponse } from "@/lib/og-route";
import * as jaOg from "../og/[slug].png";
import * as enOg from "../en/og/[slug].png";
import * as siteOg from "../og/site.png";

vi.mock("@/lib/og-route", () => ({
  getOgImagePaths: vi.fn(async () => []),
  ogImageResponse: vi.fn(async (title: string) => new Response(title)),
}));

describe.each([
  ["ja", jaOg, "postsJa"],
  ["en", enOg, "postsEn"],
])("%s OG image route", (_, route, collection) => {
  it("creates paths from its collection", async () => {
    await route.getStaticPaths({} as never);

    expect(getOgImagePaths).toHaveBeenCalledWith(collection);
  });

  it("renders the PNG for the given title", async () => {
    const res = await route.GET({ props: { title: "Hello" } } as never);

    expect(ogImageResponse).toHaveBeenCalledWith("Hello");
    expect(await res.text()).toBe("Hello");
  });
});

describe("site OG image route", () => {
  it("renders the PNG for the site name", async () => {
    await siteOg.GET({} as never);

    expect(ogImageResponse).toHaveBeenCalledWith("ktsu2i.dev");
  });
});
