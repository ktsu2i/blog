// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { initPostFilters } from "./post-filter";

function setup() {
  const buttons = ["all", "Blog", "Zenn", "External"]
    .map(
      (source) =>
        `<button aria-pressed="${source === "all"}" aria-controls="post-list" data-source="${source}">${source}</button>`,
    )
    .join("");
  document.body.innerHTML = `
    <div role="group" data-post-filter>${buttons}</div>
    <div id="post-list">
      <a data-source="Blog">Blog 1</a>
      <a data-source="Blog">Blog 2</a>
      <a data-source="Zenn">Zenn 1</a>
      <a data-source="External">External 1</a>
    </div>
  `;
  initPostFilters();
}

const button = (source: string) =>
  document.querySelector<HTMLButtonElement>(
    `button[data-source="${source}"]`,
  ) as HTMLButtonElement;

const visible = () =>
  [...document.querySelectorAll<HTMLElement>("#post-list > [data-source]")]
    .filter((item) => !item.hidden)
    .map((item) => item.textContent);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("initPostFilters", () => {
  it("hides posts from other sources and restores them with All", () => {
    setup();

    button("Blog").click();
    expect(button("Blog")).toHaveAttribute("aria-pressed", "true");
    expect(button("all")).toHaveAttribute("aria-pressed", "false");
    expect(visible()).toEqual(["Blog 1", "Blog 2"]);

    button("Zenn").click();
    expect(button("Blog")).toHaveAttribute("aria-pressed", "false");
    expect(visible()).toEqual(["Zenn 1"]);

    button("all").click();
    expect(button("all")).toHaveAttribute("aria-pressed", "true");
    expect(visible()).toHaveLength(4);
  });
});
