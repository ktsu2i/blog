import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  getAlternatePath,
  getLocaleFromUrl,
  getLocalePath,
  locales,
  useTranslations,
} from "./config";
import { ja } from "./ja";
import { en } from "./en";

describe("i18n config", () => {
  it("exposes the supported locales", () => {
    expect(locales).toEqual(["ja", "en"]);
    expect(defaultLocale).toBe("ja");
  });

  it.each([
    ["https://ktsu2i.dev/en/blog/", "en"],
    ["https://ktsu2i.dev/blog/", "ja"],
    ["https://ktsu2i.dev/", "ja"],
  ])("detects the locale of %s", (url, expected) => {
    expect(getLocaleFromUrl(new URL(url))).toBe(expected);
  });

  it("returns the translation table for each locale", () => {
    expect(useTranslations("ja")).toBe(ja);
    expect(useTranslations("en")).toBe(en);
  });

  it("keeps both translation tables in sync", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ja).sort());
  });

  it("prefixes paths only for non-default locales", () => {
    expect(getLocalePath("/blog/", "ja")).toBe("/blog/");
    expect(getLocalePath("/blog/", "en")).toBe("/en/blog/");
  });

  it.each([
    ["/blog/post/", "en", "/en/blog/post/"],
    ["/en/blog/post/", "ja", "/blog/post/"],
    ["/en/", "ja", "/"],
    ["/", "en", "/en/"],
  ] as const)("maps %s to its %s alternate", (path, locale, expected) => {
    expect(getAlternatePath(path, locale)).toBe(expected);
  });
});
