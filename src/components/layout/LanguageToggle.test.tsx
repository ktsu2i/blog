// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LanguageToggle from "./LanguageToggle";

describe("LanguageToggle", () => {
  it("links Japanese pages to their English version", () => {
    render(<LanguageToggle currentLocale="ja" currentPath="/blog/" />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/blog/",
    );
  });

  it("links English pages to their Japanese version", () => {
    render(<LanguageToggle currentLocale="en" currentPath="/en/about/" />);

    expect(screen.getByRole("link", { name: "JA" })).toHaveAttribute(
      "href",
      "/about/",
    );
  });
});
