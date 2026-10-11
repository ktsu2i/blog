// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageToggle from "@/components/layout/LanguageToggle";
import MobileNav from "@/components/layout/MobileNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import PostFilter from "@/components/post/PostFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sheet";
import type { Post } from "@/lib/types";

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
  localStorage.clear();
});

describe("LanguageToggle", () => {
  it("links Japanese pages to their English version", () => {
    render(<LanguageToggle currentLocale="ja" currentPath="/blog/" />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/blog/",
    );
  });

  it("links English pages to their Japanese version", () => {
    render(<LanguageToggle currentLocale="en" currentPath="/en/about" />);

    expect(screen.getByRole("link", { name: "JA" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});

describe("ThemeToggle", () => {
  it("toggles the dark class and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Toggle theme" });

    await user.click(button);
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    await user.click(button);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("starts from the theme already applied to the document", async () => {
    document.documentElement.classList.add("dark");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(localStorage.getItem("theme")).toBe("light");
  });
});

describe("MobileNav", () => {
  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  it("opens a menu marking the current section and closes on navigation", async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="ja" navItems={navItems} pathname="/blog/post" />);

    await user.click(screen.getByRole("button", { name: "メニュー" }));
    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(dialog).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(within(dialog).getByRole("link", { name: "Blog" })).toHaveAttribute("aria-current", "page");
    expect(within(dialog).getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");

    // jsdom cannot navigate, so only observe the click handler
    dialog.addEventListener("click", (e) => e.preventDefault());
    await user.click(within(dialog).getByRole("link", { name: "About" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses the English home link and labels", async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="en" navItems={[]} pathname="/en/" />);

    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/en/");
  });
});

describe("PostFilter", () => {
  const translations = {
    count: "{count} posts",
    japaneseOnly: "Japanese only",
    dateFormat: "yyyy-MM-dd",
    filterLabel: "Filter posts",
  };

  const posts: Post[] = [
    {
      id: "en-post",
      source: "Blog",
      slug: "en-post",
      title: "English post",
      date: "2025-03-01T00:00:00.000Z",
      description: "en",
      locale: "en",
      ogImage: "/en/og/en-post.png",
    },
    {
      id: "ja-post",
      source: "Blog",
      slug: "ja-post",
      title: "Japanese post",
      date: "2025-02-01T00:00:00.000Z",
      description: "ja",
      locale: "ja",
    },
    {
      id: "zenn",
      source: "Zenn",
      title: "Zenn post",
      date: "2025-01-01T00:00:00.000Z",
      description: "zenn",
      url: "https://zenn.dev/x",
    },
    {
      id: "external",
      source: "External",
      title: "External post",
      date: "2024-12-01T00:00:00.000Z",
      description: "ext",
      url: "https://example.com/x",
    },
    {
      id: "no-slug",
      source: "Blog",
      title: "Slugless post",
      date: "2024-11-01T00:00:00.000Z",
      description: "none",
      url: "https://example.com/fallback",
      locale: "en",
    },
  ];

  const link = (name: string) => screen.getByRole("link", { name: new RegExp(name) });

  it("renders English listings with locale-aware links and badges", () => {
    render(<PostFilter posts={posts} locale="en" translations={translations} />);

    expect(screen.getByText("5 posts")).toBeInTheDocument();
    expect(link("English post")).toHaveAttribute("href", "/en/blog/en-post");
    expect(link("English post")).not.toHaveAttribute("target");
    expect(within(link("English post")).getByRole("img")).toHaveAttribute(
      "src",
      "/en/og/en-post.png",
    );
    expect(within(link("English post")).getByText("2025-03-01")).toBeInTheDocument();

    expect(link("Japanese post")).toHaveAttribute("href", "/blog/ja-post");
    expect(within(link("Japanese post")).getByText("Japanese only")).toBeInTheDocument();
    expect(within(link("Japanese post")).queryByRole("img")).not.toBeInTheDocument();

    expect(link("Zenn post")).toHaveAttribute("href", "https://zenn.dev/x");
    expect(link("Zenn post")).toHaveAttribute("target", "_blank");
    expect(link("Zenn post")).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(link("Zenn post")).getByText("Zenn")).toBeInTheDocument();
    expect(within(link("External post")).getByText("External")).toBeInTheDocument();

    expect(link("Slugless post")).toHaveAttribute("href", "https://example.com/fallback");
  });

  it("uses unprefixed links without the Japanese-only badge on Japanese pages", () => {
    render(<PostFilter posts={posts} locale="ja" translations={translations} />);

    expect(link("English post")).toHaveAttribute("href", "/blog/en-post");
    expect(screen.queryByText("Japanese only")).not.toBeInTheDocument();
  });

  it("filters posts by source", async () => {
    const user = userEvent.setup();
    render(<PostFilter posts={posts} locale="en" translations={translations} />);
    const group = screen.getByRole("group", { name: "Filter posts" });

    await user.click(within(group).getByRole("button", { name: "Zenn" }));
    expect(within(group).getByRole("button", { name: "Zenn" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("1 posts")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);

    await user.click(within(group).getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });
});

describe("ui primitives", () => {
  it("renders Badge and Button as their own element or via asChild", () => {
    render(
      <>
        <Badge variant="outline">plain</Badge>
        <Badge asChild>
          <a href="/badge">badge link</a>
        </Badge>
        <Button size="sm">button</Button>
        <Button asChild variant="link">
          <a href="/button">button link</a>
        </Button>
      </>,
    );

    expect(screen.getByText("plain").tagName).toBe("SPAN");
    expect(screen.getByText("plain")).toHaveAttribute("data-variant", "outline");
    expect(screen.getByRole("link", { name: "badge link" })).toHaveAttribute("data-slot", "badge");
    expect(screen.getByRole("button", { name: "button" })).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("link", { name: "button link" })).toHaveAttribute("data-slot", "button");
  });

  it("renders every Card slot", () => {
    const { container } = render(
      <Card className="custom">
        <CardHeader>
          <CardTitle>title</CardTitle>
          <CardDescription>description</CardDescription>
          <CardAction>action</CardAction>
        </CardHeader>
        <CardContent>content</CardContent>
        <CardFooter>footer</CardFooter>
      </Card>,
    );

    const slots = [...container.querySelectorAll("[data-slot]")].map((el) =>
      el.getAttribute("data-slot"),
    );
    expect(slots).toEqual([
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders decorative and semantic separators", () => {
    render(
      <>
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
      </>,
    );

    expect(screen.getByTestId("decorative")).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it.each(["top", "right", "bottom", "left"] as const)(
    "renders a %s sheet with all slots",
    async (side) => {
      const user = userEvent.setup();
      render(
        <Sheet defaultOpen>
          <SheetContent side={side} showCloseButton={side !== "left"}>
            <SheetHeader>
              <SheetTitle>title</SheetTitle>
              <SheetDescription>description</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose>done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("description");
      expect(
        within(dialog).queryAllByRole("button", { name: "Close" }),
      ).toHaveLength(side === "left" ? 0 : 1);

      await user.click(screen.getByRole("button", { name: "done" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  it("uses the right side by default", () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>title</SheetTitle>
          <SheetDescription>description</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("right-0");
  });
});
