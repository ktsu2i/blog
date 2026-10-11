import { describe, expect, it } from "vitest";
import { talks, getTalks } from "./talks";

describe("getTalks", () => {
  it("provides entries for both locales with matching ids", () => {
    const ja = getTalks("ja");
    const en = getTalks("en");

    expect(ja.length).toBeGreaterThan(0);
    expect(en.map((e) => e.id)).toEqual(ja.map((e) => e.id));
  });

  it("keeps the legacy export pointing at Japanese data", () => {
    expect(talks).toBe(getTalks("ja"));
  });
});
