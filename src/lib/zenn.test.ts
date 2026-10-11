import { describe, expect, it } from "vitest";
import { listZennPosts } from "./zenn";
import { zennPosts } from "../data/zenn";

describe("listZennPosts", () => {
  it("returns the curated Zenn posts", () => {
    expect(listZennPosts()).toBe(zennPosts);
  });
});
