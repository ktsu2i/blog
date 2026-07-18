import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MobileNav from "@/components/layout/MobileNav";

describe("MobileNav SSR", () => {
  it("uses the root pathname when window is unavailable", () => {
    const html = renderToString(
      <MobileNav
        locale="ja"
        navItems={[{ href: "/blog", label: "Blog" }]}
      />,
    );
    expect(html).toContain("メニュー");
  });
});
