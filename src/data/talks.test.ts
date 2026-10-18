import { describe, expect, it } from "vitest";
import { getTalks } from "./talks";

describe("getTalks", () => {
  it("provides entries for both locales with matching ids", () => {
    const ja = getTalks("ja");
    const en = getTalks("en");

    expect(ja.length).toBeGreaterThan(0);
    expect(en.map((e) => e.id)).toEqual(ja.map((e) => e.id));
  });

  it("merges the localized text into each talk", () => {
    const [ja] = getTalks("ja");
    const [en] = getTalks("en");

    expect(ja).not.toHaveProperty("localized");
    expect(en.speakerdeckUrl).toBe(ja.speakerdeckUrl);
    expect(en.title).not.toBe(ja.title);
  });
});
