// Wires the server-rendered PostFilter: each button carries data-source and
// data-count, and aria-controls points at the list whose children carry
// data-source
function initPostFilter(group: HTMLElement) {
  const buttons = group.querySelectorAll<HTMLButtonElement>("[data-source]");
  const status = group.querySelector("[aria-live]");
  const template = group.dataset.countTemplate ?? "";

  function select(selected: HTMLButtonElement) {
    const { source, count = "" } = selected.dataset;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
    const items = document.querySelectorAll<HTMLElement>(
      `#${selected.getAttribute("aria-controls")} > [data-source]`,
    );
    for (const item of items) {
      item.hidden = source !== "all" && item.dataset.source !== source;
    }
    if (status) status.textContent = template.replace("{count}", count);
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
