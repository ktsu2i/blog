import { describe, expect, it } from "vitest";
import { listExternalPosts } from "./external";
import { externalPosts } from "../data/external";
import bengo4Posts from "../data/generated/bengo4.json";

describe("listExternalPosts", () => {
  it("combines generated Bengo4 posts with curated external posts", () => {
    expect(listExternalPosts()).toEqual([...bengo4Posts, ...externalPosts]);
  });
});
