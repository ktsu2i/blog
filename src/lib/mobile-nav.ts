// Opens the menu dialog from its trigger and closes it on link or backdrop
// clicks; Esc, focus trapping and focus return come from showModal()
function initMobileNav(dialog: HTMLDialogElement) {
  const trigger = document.querySelector(`[aria-controls="${dialog.id}"]`);
  trigger?.addEventListener("click", () => dialog.showModal());

  dialog.addEventListener("click", (event) => {
    // Clicks on ::backdrop target the dialog itself but land outside its box
    const rect = dialog.getBoundingClientRect();
    const onBackdrop =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    // Close before navigating so a page restored from bfcache isn't left open
    const onLink = event.target instanceof Element && event.target.closest("a");
    if (onBackdrop || onLink) dialog.close();
  });
}

export function initMobileNavs() {
  for (const dialog of document.querySelectorAll<HTMLDialogElement>(
    "dialog[data-mobile-nav]",
  )) {
    initMobileNav(dialog);
  }
}
