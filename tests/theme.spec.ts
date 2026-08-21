import { expect, test, type Page } from "@playwright/test";

type Theme = "dark" | "light";

async function expectThemeControl(page: Page, theme: Theme): Promise<void> {
  const themeButton = page.locator("[data-theme-toggle]");
  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextThemeLabel = nextTheme === "dark" ? "다크 모드" : "라이트 모드";

  await expect(themeButton).toHaveAttribute("aria-pressed", String(theme === "dark"));
  await expect(themeButton.locator(`[data-theme-action="${nextTheme}"]`)).toBeVisible();
  await expect(themeButton.locator(`[data-theme-action="${theme}"]`)).toBeHidden();
  await expect(page.getByRole("button", { name: nextThemeLabel, exact: true })).toBeVisible();
}

test("follows the system color theme until the visitor chooses one", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const documentElement = page.locator("html");
  const themeButton = page.locator("[data-theme-toggle]");
  const themeColor = page.locator('meta[name="theme-color"]');

  await expect(documentElement).toHaveAttribute("data-theme", "dark");
  await expectThemeControl(page, "dark");
  await expect(themeColor).toHaveAttribute("content", "#0d1117");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(documentElement).toHaveAttribute("data-theme", "light");
  await expectThemeControl(page, "light");
  await expect(themeColor).toHaveAttribute("content", "#f8fafc");

  await themeButton.click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(documentElement).toHaveAttribute("data-theme", "dark");
  await expectThemeControl(page, "dark");
  await expect(themeColor).toHaveAttribute("content", "#0d1117");
});

test("renders the system-matched theme control before its module loads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.route(/\/_astro\/SiteHeader.*\.js$/u, async (route) => await route.abort());
  await page.goto("/");

  const themeButton = page.locator("[data-theme-toggle]");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(themeButton.locator('[data-theme-action="light"]')).toBeVisible();
  await expect(themeButton.locator('[data-theme-action="dark"]')).toBeHidden();
  await expect(page.getByRole("button", { name: "라이트 모드", exact: true })).toBeVisible();
});

test("switches and persists the explicit color theme", async ({ page }) => {
  await page.goto("/");

  const themeButton = page.locator("[data-theme-toggle]");
  const documentElement = page.locator("html");
  const initialTheme = await documentElement.getAttribute("data-theme");
  const nextTheme = initialTheme === "dark" ? "light" : "dark";

  await themeButton.click();
  await expect(documentElement).toHaveAttribute("data-theme", nextTheme);
  await expectThemeControl(page, nextTheme);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    nextTheme === "dark" ? "#0d1117" : "#f8fafc",
  );
  expect(await page.evaluate(() => sessionStorage.getItem("portfolio-theme"))).toBe(nextTheme);
  expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBeNull();

  await page.reload();
  await expect(documentElement).toHaveAttribute("data-theme", nextTheme);
  await expectThemeControl(page, nextTheme);
});

test("starts a new browser session from the system color theme", async ({ browser }) => {
  const firstSession = await browser.newContext({ colorScheme: "light" });
  const firstPage = await firstSession.newPage();

  await firstPage.goto("/");
  await firstPage.locator("[data-theme-toggle]").click();
  await expect(firstPage.locator("html")).toHaveAttribute("data-theme", "dark");
  await firstSession.close();

  const nextSession = await browser.newContext({ colorScheme: "light" });
  const nextPage = await nextSession.newPage();

  await nextPage.goto("/");
  await expect(nextPage.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeControl(nextPage, "light");
  expect(await nextPage.evaluate(() => sessionStorage.getItem("portfolio-theme"))).toBeNull();
  await nextSession.close();
});
