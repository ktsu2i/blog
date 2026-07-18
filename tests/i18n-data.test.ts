import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  getAlternatePath,
  getLocaleFromUrl,
  getLocalePath,
  locales,
  useTranslations,
} from "@/i18n/config";
import { en } from "@/i18n/en";
import { ja } from "@/i18n/ja";
import { career, getCareer } from "@/data/career";
import { getTalks, talks } from "@/data/talks";

describe("i18n helpers", () => {
  it("detects supported locales and falls back to Japanese", () => {
    expect(locales).toEqual(["ja", "en"]);
    expect(defaultLocale).toBe("ja");
    expect(getLocaleFromUrl(new URL("https://example.com/en/blog"))).toBe("en");
    expect(getLocaleFromUrl(new URL("https://example.com/ja/blog"))).toBe("ja");
    expect(getLocaleFromUrl(new URL("https://example.com/fr/blog"))).toBe("ja");
  });

  it("returns translations and locale-aware paths", () => {
    expect(useTranslations("ja")).toBe(ja);
    expect(useTranslations("en")).toBe(en);
    expect(getLocalePath("/blog", "ja")).toBe("/blog");
    expect(getLocalePath("/blog", "en")).toBe("/en/blog");
  });

  it("switches between default and English paths", () => {
    expect(getAlternatePath("/en/blog/post", "ja")).toBe("/blog/post");
    expect(getAlternatePath("/en", "ja")).toBe("/");
    expect(getAlternatePath("/blog/post", "en")).toBe("/en/blog/post");
  });
});

describe("localized data", () => {
  it("returns both career translations and keeps the legacy export", () => {
    expect(getCareer("ja")).toBe(career);
    expect(getCareer("en")).not.toBe(career);
    expect(getCareer("en")[0].id).toBe(getCareer("ja")[0].id);
  });

  it("returns both talk translations and keeps the legacy export", () => {
    expect(getTalks("ja")).toBe(talks);
    expect(getTalks("en")).not.toBe(talks);
    expect(getTalks("en")[0].id).toBe(getTalks("ja")[0].id);
  });
});
