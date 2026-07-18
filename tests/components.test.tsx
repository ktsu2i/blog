// @vitest-environment jsdom

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LanguageToggle from "@/components/layout/LanguageToggle";
import MobileNav from "@/components/layout/MobileNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import PostFilter from "@/components/post/PostFilter";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { POST_SOURCES, type Post } from "@/lib/types";

beforeEach(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("dark");
  localStorage.clear();
});

describe("UI primitives", () => {
  it("renders button variants, sizes, and slotted children", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ] as const;
    const sizes = [
      "default",
      "xs",
      "sm",
      "lg",
      "icon",
      "icon-xs",
      "icon-sm",
      "icon-lg",
    ] as const;
    for (const variant of variants) {
      expect(buttonVariants({ variant })).toContain("inline-flex");
    }
    for (const size of sizes) {
      expect(buttonVariants({ size })).toContain("inline-flex");
    }

    const { rerender } = render(<Button>Default</Button>);
    expect(screen.getByRole("button", { name: "Default" })).toHaveAttribute(
      "data-variant",
      "default",
    );

    rerender(
      <Button asChild variant="link" size="lg" className="custom">
        <a href="/target">Link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("data-size", "lg");
    expect(link).toHaveClass("custom");
  });

  it("renders badge variants and slotted children", () => {
    const variants = [
      "default",
      "secondary",
      "destructive",
      "outline",
      "ghost",
      "link",
    ] as const;
    for (const variant of variants) {
      expect(badgeVariants({ variant })).toContain("inline-flex");
    }

    const { rerender } = render(<Badge>Default badge</Badge>);
    expect(screen.getByText("Default badge")).toHaveAttribute(
      "data-variant",
      "default",
    );
    rerender(
      <Badge asChild variant="outline" className="custom">
        <a href="/badge">Badge link</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "Badge link" })).toHaveClass(
      "custom",
    );
  });

  it("renders every card region", () => {
    render(
      <Card className="card-custom">
        <CardHeader className="header-custom">
          <CardTitle className="title-custom">Title</CardTitle>
          <CardDescription className="description-custom">
            Description
          </CardDescription>
          <CardAction className="action-custom">Action</CardAction>
        </CardHeader>
        <CardContent className="content-custom">Content</CardContent>
        <CardFooter className="footer-custom">Footer</CardFooter>
      </Card>,
    );

    for (const slot of [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it("renders horizontal and vertical separators", () => {
    const { rerender } = render(<Separator className="custom" />);
    expect(document.querySelector('[data-slot="separator"]')).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    rerender(
      <Separator orientation="vertical" decorative={false} className="vertical" />,
    );
    expect(screen.getByRole("separator")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("renders every sheet region, side, and close-button mode", () => {
    const sides = ["right", "left", "top", "bottom"] as const;
    sides.forEach((side, index) => {
      const view = render(
        <Sheet open>
          <SheetTrigger>Trigger</SheetTrigger>
          <SheetContent side={side} showCloseButton={index === 0}>
            <SheetHeader className="header">
              <SheetTitle className="title">Title {side}</SheetTitle>
              <SheetDescription className="description">
                Description
              </SheetDescription>
            </SheetHeader>
            <SheetFooter className="footer">
              <SheetClose>Custom close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      );

      expect(screen.getByRole("dialog")).toHaveAttribute(
        "data-slot",
        "sheet-content",
      );
      expect(document.querySelector('[data-slot="sheet-overlay"]')).not.toBeNull();
      if (index === 0) {
        expect(screen.getByText("Close")).toBeInTheDocument();
      } else {
        expect(screen.queryByText("Close")).not.toBeInTheDocument();
      }
      view.unmount();
    });
  });
});

describe("layout islands", () => {
  it("switches language labels and paths", () => {
    const { rerender } = render(
      <LanguageToggle currentLocale="ja" currentPath="/blog/post" />,
    );
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/blog/post",
    );
    rerender(
      <LanguageToggle currentLocale="en" currentPath="/en/blog/post" />,
    );
    expect(screen.getByRole("link", { name: "JA" })).toHaveAttribute(
      "href",
      "/blog/post",
    );
  });

  it("initializes and toggles the theme in both directions", async () => {
    document.documentElement.classList.add("dark");
    const user = userEvent.setup();
    const { container } = render(<ThemeToggle />);

    expect(container.querySelector(".lucide-sun")).not.toBeNull();
    const toggle = screen.getByRole("button", { name: "Toggle theme" });
    await user.click(toggle);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
    await user.click(toggle);
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it.each([
    ["ja", "/", "メニュー", "/"],
    ["en", "/en/blog", "Menu", "/en/"],
  ])(
    "opens and closes the %s mobile navigation",
    async (locale, pathname, menuLabel, homeHref) => {
      window.history.replaceState({}, "", pathname);
      const user = userEvent.setup();
      render(
        <MobileNav
          locale={locale}
          navItems={[
            { href: locale === "ja" ? "/blog" : "/en/blog", label: "Blog" },
            { href: locale === "ja" ? "/about" : "/en/about", label: "About" },
          ]}
        />,
      );

      await user.click(screen.getByRole("button", { name: menuLabel }));
      const home = await screen.findByRole("link", { name: "Home" });
      expect(home).toHaveAttribute("href", homeHref);
      if (locale === "ja") {
        expect(home).toHaveClass("text-foreground");
        expect(screen.getByRole("link", { name: "Blog" })).toHaveClass(
          "text-muted-foreground",
        );
      } else {
        expect(home).toHaveClass("text-muted-foreground");
        expect(screen.getByRole("link", { name: "Blog" })).toHaveClass(
          "text-foreground",
        );
      }
      const about = screen.getByRole("link", { name: "About" });
      about.addEventListener("click", (event) => event.preventDefault());
      await user.click(about);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );
});

describe("PostFilter", () => {
  const translations = {
    count: "{count} posts",
    japaneseOnly: "Japanese only",
    dateFormat: "yyyy-MM-dd",
  };
  const posts: Post[] = [
    {
      id: "ja-blog",
      source: POST_SOURCES.BLOG,
      slug: "ja-blog",
      title: "Japanese blog",
      date: "2026-01-04",
      description: "Japanese",
      locale: "ja",
      ogImage: "/og.png",
    },
    {
      id: "en-blog",
      source: POST_SOURCES.BLOG,
      slug: "en-blog",
      title: "English blog",
      date: "2026-01-03",
      description: "English",
      locale: "en",
    },
    {
      id: "no-slug",
      source: POST_SOURCES.BLOG,
      title: "Blog without slug",
      date: "2026-01-02",
      description: "Fallback URL",
      locale: "en",
      url: "/fallback",
    },
    {
      id: "zenn",
      source: POST_SOURCES.ZENN,
      title: "Zenn post",
      date: "2026-01-01",
      description: "Zenn",
      url: "https://zenn.dev/post",
    },
    {
      id: "external",
      source: POST_SOURCES.EXTERNAL,
      title: "External post",
      date: "2025-01-01",
      description: "External",
      url: "https://example.com/post",
    },
  ];

  it("renders every post kind and filters by each source", async () => {
    const user = userEvent.setup();
    render(<PostFilter posts={posts} locale="en" translations={translations} />);

    expect(screen.getByText("5 posts")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Japanese blog/ })).toHaveAttribute(
      "href",
      "/blog/ja-blog",
    );
    expect(screen.getByRole("link", { name: /English blog/ })).toHaveAttribute(
      "href",
      "/en/blog/en-blog",
    );
    expect(screen.getByRole("link", { name: /Blog without slug/ })).toHaveAttribute(
      "href",
      "/fallback",
    );
    expect(screen.getAllByText("Japanese only")).toHaveLength(3);
    expect(screen.getByRole("img", { name: "Japanese blog" })).toHaveAttribute(
      "loading",
      "lazy",
    );
    expect(screen.getByRole("link", { name: /Zenn post/ })).toHaveAttribute(
      "target",
      "_blank",
    );

    await user.click(screen.getByRole("button", { name: "Blog" }));
    expect(screen.getByText("3 posts")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Zenn" }));
    expect(screen.getByText("1 posts")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "External" }));
    expect(screen.getByText("1 posts")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("5 posts")).toBeInTheDocument();
  });

  it("uses unprefixed blog links for Japanese", () => {
    render(
      <PostFilter posts={[posts[1]]} locale="ja" translations={translations} />,
    );
    expect(screen.getByRole("link", { name: /English blog/ })).toHaveAttribute(
      "href",
      "/blog/en-blog",
    );
    expect(screen.queryByText("Japanese only")).not.toBeInTheDocument();
  });
});
