// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav from "./MobileNav";

describe("MobileNav", () => {
  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  it("opens a menu marking the current section and closes on navigation", async () => {
    const user = userEvent.setup();
    render(
      <MobileNav
        homeItem={{ href: "/", label: "Home" }}
        menuLabel="メニュー"
        navItems={navItems}
        pathname="/blog/post"
      />,
    );

    await user.click(screen.getByRole("button", { name: "メニュー" }));
    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      within(dialog).getByRole("link", { name: "Home" }),
    ).not.toHaveAttribute("aria-current");
    expect(within(dialog).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(dialog).getByRole("link", { name: "About" }),
    ).not.toHaveAttribute("aria-current");

    // jsdom cannot navigate, so only observe the click handler
    dialog.addEventListener("click", (e) => e.preventDefault());
    await user.click(within(dialog).getByRole("link", { name: "About" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses the given home link and labels", async () => {
    const user = userEvent.setup();
    render(
      <MobileNav
        homeItem={{ href: "/en/", label: "Top" }}
        menuLabel="Menu"
        navItems={[]}
        pathname="/en/"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByRole("link", { name: "Top" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Top" })).toHaveAttribute(
      "href",
      "/en/",
    );
  });
});
