// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { initThemeToggles } from "./theme";

afterEach(() => {
  document.documentElement.className = "";
  document.body.innerHTML = "";
  localStorage.clear();
});

function setup() {
  document.body.innerHTML = `<button data-theme-toggle>Toggle</button>`;
  initThemeToggles();
  return document.querySelector("button") as HTMLButtonElement;
}

describe("initThemeToggles", () => {
  it("toggles the dark class and persists the choice", () => {
    const button = setup();

    button.click();
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    button.click();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("starts from the theme already applied to the document", () => {
    document.documentElement.classList.add("dark");
    setup().click();

    expect(localStorage.getItem("theme")).toBe("light");
  });
});
