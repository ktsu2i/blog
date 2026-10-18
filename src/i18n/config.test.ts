import { describe, expect, it } from "vitest";
import {
  SOURCE_LABEL_KEYS,
  defaultLocale,
  getAlternatePath,
  getCurrentLocale,
  getLocaleFromUrl,
  getLocalePath,
  locales,
  useTranslations,
} from "./config";
import { ja } from "./ja";
import { en } from "./en";
import { POST_SOURCES } from "../lib/types";

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

  it("falls back to the default locale when Astro has none", () => {
    expect(getCurrentLocale({ currentLocale: "en" })).toBe("en");
    expect(getCurrentLocale({ currentLocale: undefined })).toBe(defaultLocale);
  });

  it("returns the translation table for each locale", () => {
    expect(useTranslations("ja")).toBe(ja);
    expect(useTranslations("en")).toBe(en);
  });

  it.each(Object.values(POST_SOURCES))(
    "has a label for the %s source",
    (source) => {
      expect(ja[SOURCE_LABEL_KEYS[source]]).toBeTruthy();
      expect(en[SOURCE_LABEL_KEYS[source]]).toBeTruthy();
    },
  );

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
