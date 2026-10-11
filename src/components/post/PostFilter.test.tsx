// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostFilter from "./PostFilter";
import type { Post } from "@/lib/types";

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

  const link = (name: string) =>
    screen.getByRole("link", { name: new RegExp(name) });

  it("renders English listings with locale-aware links and badges", () => {
    render(
      <PostFilter posts={posts} locale="en" translations={translations} />,
    );

    expect(screen.getByText("5 posts")).toBeInTheDocument();
    expect(link("English post")).toHaveAttribute("href", "/en/blog/en-post");
    expect(link("English post")).not.toHaveAttribute("target");
    expect(within(link("English post")).getByRole("img")).toHaveAttribute(
      "src",
      "/en/og/en-post.png",
    );
    expect(
      within(link("English post")).getByText("2025-03-01"),
    ).toBeInTheDocument();

    expect(link("Japanese post")).toHaveAttribute("href", "/blog/ja-post");
    expect(
      within(link("Japanese post")).getByText("Japanese only"),
    ).toBeInTheDocument();
    expect(
      within(link("Japanese post")).queryByRole("img"),
    ).not.toBeInTheDocument();

    expect(link("Zenn post")).toHaveAttribute("href", "https://zenn.dev/x");
    expect(link("Zenn post")).toHaveAttribute("target", "_blank");
    expect(link("Zenn post")).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(link("Zenn post")).getByText("Zenn")).toBeInTheDocument();
    expect(
      within(link("External post")).getByText("External"),
    ).toBeInTheDocument();

    expect(link("Slugless post")).toHaveAttribute(
      "href",
      "https://example.com/fallback",
    );
  });

  it("uses unprefixed links without the Japanese-only badge on Japanese pages", () => {
    render(
      <PostFilter posts={posts} locale="ja" translations={translations} />,
    );

    expect(link("English post")).toHaveAttribute("href", "/blog/en-post");
    expect(screen.queryByText("Japanese only")).not.toBeInTheDocument();
  });

  it("filters posts by source", async () => {
    const user = userEvent.setup();
    render(
      <PostFilter posts={posts} locale="en" translations={translations} />,
    );
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
