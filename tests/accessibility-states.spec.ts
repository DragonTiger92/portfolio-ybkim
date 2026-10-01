import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./helpers/browser";

async function expectAccessibleState(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

for (const route of [
  "/",
  "/projects/portfolio-ybkim/",
  "/projects/karly/",
  "/projects/book-kong/",
]) {
  test(
    `${route} has no automatically detectable accessibility violations in dark mode`,
    { tag: "@a11y" },
    async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expectAccessibleState(page);
    },
  );
}

for (const colorScheme of ["light", "dark"] as const) {
  test(
    `the open request dialog has no automatically detectable accessibility violations in ${colorScheme} mode`,
    { tag: "@a11y" },
    async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/projects/karly/");
      await page.locator("[data-demo-access-trigger]").click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expectAccessibleState(page);
    },
  );
}
