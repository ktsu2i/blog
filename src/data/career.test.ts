import { describe, expect, it } from "vitest";
import { career, getCareer } from "./career";

describe("getCareer", () => {
  it("provides entries for both locales with matching ids", () => {
    const ja = getCareer("ja");
    const en = getCareer("en");

    expect(ja.length).toBeGreaterThan(0);
    expect(en.map((e) => e.id)).toEqual(ja.map((e) => e.id));
  });

  it("keeps the legacy export pointing at Japanese data", () => {
    expect(career).toBe(getCareer("ja"));
  });
});
