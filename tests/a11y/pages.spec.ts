import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(wcagTags)
    .analyze();
  // Keep failure output readable; the full report is in axe's docs per rule id
  expect(
    violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target.join(" ")),
    })),
  ).toEqual([]);
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

test("mobile-nav-open", async ({ page }, { project }) => {
  test.skip(
    !project.name.startsWith("mobile"),
    "The menu is only reachable on mobile widths",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "メニュー" }).click();
  await expect(page.getByRole("dialog", { name: "メニュー" })).toBeVisible();
  await expectNoViolations(page);
});
