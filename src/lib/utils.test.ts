import { describe, expect, it } from "vitest";
import { cn, compareByDateDesc } from "./utils";

describe("cn", () => {
  it("joins conditional classes and resolves Tailwind conflicts", () => {
    // oxlint-disable-next-line no-constant-binary-expression
    expect(cn("px-2", false && "hidden", ["py-1"], "px-4")).toBe("py-1 px-4");
  });
});

describe("compareByDateDesc", () => {
  it("sorts newest first", () => {
    const items = [
      { date: "2024-01-01" },
      { date: "2025-02-01" },
      { date: "2024-06-01" },
    ];

    expect(items.sort(compareByDateDesc).map((item) => item.date)).toEqual([
      "2025-02-01",
      "2024-06-01",
      "2024-01-01",
    ]);
  });
});
