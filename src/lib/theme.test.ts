// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { initThemeToggles } from "./theme";

afterEach(() => {
  document.documentElement.className = "";
  document.body.innerHTML = "";
  localStorage.clear();
});

function setup() {
  document.body.innerHTML = `
    <button data-theme-toggle>Toggle</button>
    <button data-theme-toggle>Toggle</button>
  `;
  initThemeToggles();
  return [...document.querySelectorAll("button")];
}

describe("initThemeToggles", () => {
  it("toggles the dark class and persists the choice", () => {
    const [button] = setup();

    button.click();
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    button.click();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reflects the theme in aria-pressed on every toggle", () => {
    const [first, second] = setup();
    expect(first).toHaveAttribute("aria-pressed", "false");

    first.click();
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(second).toHaveAttribute("aria-pressed", "true");
  });

  it("starts from the theme already applied to the document", () => {
    document.documentElement.classList.add("dark");
    const [button] = setup();
    expect(button).toHaveAttribute("aria-pressed", "true");

    button.click();
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
