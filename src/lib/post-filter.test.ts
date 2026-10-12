// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { initPostFilters } from "./post-filter";

const counts = { all: 4, Blog: 2, Zenn: 1, External: 1 };

function setup({ template = "{count} posts", withStatus = true } = {}) {
  const buttons = Object.entries(counts)
    .map(
      ([source, count]) =>
        `<button aria-pressed="${source === "all"}" aria-controls="post-list" data-source="${source}" data-count="${count}">${source}</button>`,
    )
    .join("");
  document.body.innerHTML = `
    <div data-post-filter ${template ? `data-count-template="${template}"` : ""}>
      <div role="group">${buttons}</div>
      ${withStatus ? `<p aria-live="polite">4 posts</p>` : ""}
    </div>
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

const status = () => document.querySelector("[aria-live]")?.textContent;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("initPostFilters", () => {
  it("hides posts from other sources and restores them with All", () => {
    setup();

    button("Blog").click();
    expect(button("Blog")).toHaveAttribute("aria-pressed", "true");
    expect(button("all")).toHaveAttribute("aria-pressed", "false");
    expect(status()).toBe("2 posts");
    expect(visible()).toEqual(["Blog 1", "Blog 2"]);

    button("Zenn").click();
    expect(button("Blog")).toHaveAttribute("aria-pressed", "false");
    expect(status()).toBe("1 posts");
    expect(visible()).toEqual(["Zenn 1"]);

    button("all").click();
    expect(button("all")).toHaveAttribute("aria-pressed", "true");
    expect(status()).toBe("4 posts");
    expect(visible()).toHaveLength(4);
  });

  it("still filters when the status region is missing", () => {
    setup({ withStatus: false });

    button("External").click();
    expect(visible()).toEqual(["External 1"]);
  });

  it("falls back to empty strings for missing data attributes", () => {
    setup({ template: "" });
    const external = button("External");
    delete external.dataset.count;

    external.click();
    expect(status()).toBe("");
  });
});
