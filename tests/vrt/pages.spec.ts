import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Keep screenshots independent of third-party resources
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.abort(),
  );
});

test("home", async ({ page }) => {
  await page.goto("/");
  // The latest posts change with every new article
  await expect(page).toHaveScreenshot("home.png", {
    mask: [page.locator(".grid:has(a[data-source])")],
  });
});

for (const [name, path] of [
  ["about", "/about/"],
  ["post", "/blog/start-blog/"],
  ["404", "/404/"],
] as const) {
  test(name, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
