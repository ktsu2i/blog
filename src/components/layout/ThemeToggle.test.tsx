// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

afterEach(() => {
  document.documentElement.className = "";
  localStorage.clear();
});

describe("ThemeToggle", () => {
  it("toggles the dark class and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle label="テーマを切り替え" />);
    const button = screen.getByRole("button", { name: "テーマを切り替え" });

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
    render(<ThemeToggle label="テーマを切り替え" />);

    await user.click(screen.getByRole("button", { name: "テーマを切り替え" }));

    expect(localStorage.getItem("theme")).toBe("light");
  });
});
