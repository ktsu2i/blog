import { type Page, expect, test } from "@playwright/test";

declare global {
  interface Window {
    cspViolations: string[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.cspViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      window.cspViolations.push(
        `${event.effectiveDirective} ${event.blockedURI || "inline"}`,
      );
    });
  });
});

async function expectNoViolations(page: Page) {
  await page.waitForLoadState("networkidle");
  expect(await page.evaluate(() => window.cspViolations)).toEqual([]);
}

for (const [name, path] of [
  ["home", "/"],
  ["blog", "/blog"],
  ["post", "/blog/start-blog"],
  ["about", "/about"],
  ["talks", "/talks"],
  ["404", "/404"],
  ["home-en", "/en"],
  ["post-en", "/en/blog/start-blog"],
] as const) {
  test(name, async ({ page }) => {
    await page.goto(path);
    await expectNoViolations(page);
  });
}

test("talks-slides", async ({ page }) => {
  await page.goto("/talks");
  await page.locator("[data-speakerdeck-facade]").first().click();
  await expect(page.locator("iframe").first()).toBeAttached();
  await expectNoViolations(page);
});

test("theme-toggle", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-theme-toggle]:visible").first().click();
  await expectNoViolations(page);
});
