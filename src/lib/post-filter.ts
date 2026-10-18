// Wires the server-rendered PostFilter: each button carries data-source, and
// aria-controls points at the list whose children carry data-source
function initPostFilter(group: HTMLElement) {
  const buttons = group.querySelectorAll<HTMLButtonElement>("[data-source]");

  function select(selected: HTMLButtonElement) {
    const { source } = selected.dataset;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
    const items = document.querySelectorAll<HTMLElement>(
      `#${selected.getAttribute("aria-controls")} > [data-source]`,
    );
    for (const item of items) {
      item.hidden = source !== "all" && item.dataset.source !== source;
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => select(button));
  }
}

export function initPostFilters() {
  for (const group of document.querySelectorAll<HTMLElement>(
    "[data-post-filter]",
  )) {
    initPostFilter(group);
  }
}
