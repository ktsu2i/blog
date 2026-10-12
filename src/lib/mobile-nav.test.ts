// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initMobileNavs } from "./mobile-nav";

// jsdom doesn't implement modal dialogs
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
});

afterEach(() => {
  document.body.innerHTML = "";
});

function setup() {
  document.body.innerHTML = `
    <button aria-controls="mobile-nav">Menu</button>
    <dialog id="mobile-nav" data-mobile-nav>
      <h2>Menu</h2>
      <nav><a href="#about"><span>About</span></a></nav>
    </dialog>
  `;
  initMobileNavs();
  const dialog = document.querySelector("dialog") as HTMLDialogElement;
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(
    new DOMRect(100, 0, 200, 600),
  );
  (document.querySelector("button") as HTMLButtonElement).click();
  return dialog;
}

const clickAt = (target: Element, clientX: number, clientY: number) =>
  target.dispatchEvent(
    new MouseEvent("click", { bubbles: true, clientX, clientY }),
  );

describe("initMobileNavs", () => {
  it("opens the dialog from its trigger", () => {
    expect(setup().open).toBe(true);
  });

  it("closes when a link inside is clicked", () => {
    const dialog = setup();
    clickAt(dialog.querySelector("span") as Element, 150, 50);
    expect(dialog.open).toBe(false);
  });

  it.each([
    ["left", 50, 300],
    ["right", 350, 300],
    ["above", 150, -10],
    ["below", 150, 700],
  ])("closes on a backdrop click %s the panel", (_, x, y) => {
    const dialog = setup();
    clickAt(dialog, x, y);
    expect(dialog.open).toBe(false);
  });

  it("stays open on clicks inside the panel that aren't links", () => {
    const dialog = setup();
    clickAt(dialog.querySelector("h2") as Element, 150, 50);
    clickAt(dialog, 150, 500);
    expect(dialog.open).toBe(true);
  });

  it("ignores a dialog without a trigger", () => {
    document.body.innerHTML = `<dialog id="orphan" data-mobile-nav></dialog>`;
    expect(() => initMobileNavs()).not.toThrow();
  });
});
