// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostFilter from "./PostFilter";

describe("PostFilter", () => {
  const translations = {
    count: "{count} posts",
    filterLabel: "Filter posts",
  };
  const counts = { all: 4, Blog: 2, Zenn: 1, External: 1 };

  function renderWithList() {
    const list = document.createElement("div");
    list.id = "post-list";
    list.innerHTML = `
      <a data-source="Blog">Blog 1</a>
      <a data-source="Blog">Blog 2</a>
      <a data-source="Zenn">Zenn 1</a>
      <a data-source="External">External 1</a>
    `;
    document.body.append(list);
    render(
      <PostFilter
        listId="post-list"
        counts={counts}
        translations={translations}
      />,
    );
    return list;
  }

  const visible = (list: HTMLElement) =>
    [...list.querySelectorAll<HTMLElement>("[data-source]")]
      .filter((item) => !item.hidden)
      .map((item) => item.textContent);

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("starts with every post shown", () => {
    const list = renderWithList();
    const group = screen.getByRole("group", { name: "Filter posts" });

    expect(screen.getByText("4 posts")).toBeInTheDocument();
    expect(within(group).getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(group).getByRole("button", { name: "Zenn" })).toHaveAttribute(
      "aria-controls",
      "post-list",
    );
    expect(visible(list)).toHaveLength(4);
  });

  it("shows each source's count inside its button", () => {
    renderWithList();
    const group = screen.getByRole("group", { name: "Filter posts" });

    expect(
      within(group).getByRole("button", { name: "All" }),
    ).toHaveTextContent("All4");
    expect(
      within(group).getByRole("button", { name: "Blog" }),
    ).toHaveTextContent("Blog2");
  });

  it("hides posts from other sources and restores them with All", async () => {
    const user = userEvent.setup();
    const list = renderWithList();
    const group = screen.getByRole("group", { name: "Filter posts" });

    await user.click(within(group).getByRole("button", { name: "Blog" }));
    expect(within(group).getByRole("button", { name: "Blog" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("2 posts")).toBeInTheDocument();
    expect(visible(list)).toEqual(["Blog 1", "Blog 2"]);

    await user.click(within(group).getByRole("button", { name: "Zenn" }));
    expect(screen.getByText("1 posts")).toBeInTheDocument();
    expect(visible(list)).toEqual(["Zenn 1"]);

    await user.click(within(group).getByRole("button", { name: "All" }));
    expect(screen.getByText("4 posts")).toBeInTheDocument();
    expect(visible(list)).toHaveLength(4);
  });
});
