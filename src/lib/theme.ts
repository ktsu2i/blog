// Flips html.dark and remembers the choice for the inline script in BaseLayout
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export function initThemeToggles() {
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", toggleTheme);
  }
}
