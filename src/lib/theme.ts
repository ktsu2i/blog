function syncPressed(dark: boolean) {
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-pressed", String(dark));
  }
}

// Flips html.dark and remembers the choice for the inline script in BaseLayout
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  syncPressed(dark);
}

export function initThemeToggles() {
  syncPressed(document.documentElement.classList.contains("dark"));
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", toggleTheme);
  }
}
