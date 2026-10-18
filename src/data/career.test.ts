import { describe, expect, it } from "vitest";
import { getCareer } from "./career";

describe("getCareer", () => {
  it("provides entries for both locales with matching ids", () => {
    const ja = getCareer("ja");
    const en = getCareer("en");

    expect(ja.length).toBeGreaterThan(0);
    expect(en.map((e) => e.id)).toEqual(ja.map((e) => e.id));
  });

  it("merges the localized text into each entry", () => {
    const [ja] = getCareer("ja");
    const [en] = getCareer("en");

    expect(ja).not.toHaveProperty("localized");
    expect(en.tags).toEqual(ja.tags);
    expect(en.period).not.toBe(ja.period);
  });
});
