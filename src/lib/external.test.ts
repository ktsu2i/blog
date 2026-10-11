import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { listExternalPosts } from "./external";
import { externalPosts } from "../data/external";

// bengo4.json is gitignored: present after `pnpm fetch:bengo4`, absent in CI
const GENERATED = path.resolve("src/data/generated/bengo4.json");

describe("listExternalPosts", () => {
  it("combines generated Bengo4 posts (if any) with curated external posts", () => {
    const generated = fs.existsSync(GENERATED)
      ? JSON.parse(fs.readFileSync(GENERATED, "utf8"))
      : [];

    expect(listExternalPosts()).toEqual([...generated, ...externalPosts]);
  });
});
