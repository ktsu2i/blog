import { describe, expect, it } from "vitest";
import { career, getCareer } from "@/data/career";
import { getTalks, talks } from "@/data/talks";

describe.each([
  ["career", getCareer, career],
  ["talks", getTalks, talks],
] as const)("%s data", (_, get, legacy) => {
  it("provides entries for both locales with matching ids", () => {
    const ja = get("ja");
    const en = get("en");

    expect(ja.length).toBeGreaterThan(0);
    expect(en.map((e) => e.id)).toEqual(ja.map((e) => e.id));
  });

  it("keeps the legacy export pointing at Japanese data", () => {
    expect(legacy).toBe(get("ja"));
  });
});
