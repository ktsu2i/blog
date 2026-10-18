import { describe, expect, it } from "vitest";
import { cn, compareByDateDesc, formatDate, toDateAttr } from "./utils";

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

describe("formatDate", () => {
  it("formats per locale", () => {
    expect(formatDate("2024-06-01", "ja")).toBe("2024年6月1日");
    expect(formatDate("2024-06-01", "en")).toBe("Jun 1, 2024");
  });

  it("uses JST regardless of the runtime time zone", () => {
    expect(formatDate("2026-02-24T23:00:00.000Z", "ja")).toBe("2026年2月25日");
    expect(formatDate("2025-12-17T15:00:00.000Z", "en")).toBe("Dec 18, 2025");
  });
});

describe("toDateAttr", () => {
  it("returns the JST date as YYYY-MM-DD", () => {
    expect(toDateAttr("2024-06-01")).toBe("2024-06-01");
    expect(toDateAttr("2026-02-24T23:00:00.000Z")).toBe("2026-02-25");
  });
});
