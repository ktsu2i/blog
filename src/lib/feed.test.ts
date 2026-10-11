import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCollection } from "astro:content";
import { listAllPosts } from "./feed";
import { listExternalPosts } from "./external";
import { listZennPosts } from "./zenn";

const future = {
  id: "future",
  data: { title: "Future", date: "2999-01-01", description: "", draft: false },
};

beforeEach(() => {
  vi.mocked(getCollection).mockResolvedValue([future] as never);
});

describe("listAllPosts", () => {
  it("merges every source sorted by date desc", async () => {
    const posts = await listAllPosts();
    const times = posts.map((p) => new Date(p.date).getTime());

    expect(getCollection).toHaveBeenCalledWith("postsJa");
    expect(posts[0].id).toBe("future");
    expect(posts).toHaveLength(
      1 + listZennPosts().length + listExternalPosts().length,
    );
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it("uses the English collection when requested", async () => {
    await listAllPosts("en");

    expect(getCollection).toHaveBeenCalledWith("postsEn");
  });
});
