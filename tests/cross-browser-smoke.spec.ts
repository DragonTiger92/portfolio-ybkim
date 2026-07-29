import { expect, test } from "@playwright/test";

test("renders and navigates the landing page without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("웹 개발자 김용범의 포트폴리오");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("link", { name: "프로젝트", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects-title")).toBeInViewport();
});

test("switches the theme and keeps the primary contact actions usable", async ({ page }) => {
  await page.goto("/");

  const themeToggle = page.locator("[data-theme-toggle]");
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  const nextTheme = initialTheme === "dark" ? "light" : "dark";

  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
  await expect(page.locator("#intro .action-list a")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "주소 복사" })).toBeEnabled();
});

test("renders project evidence and supporting navigation", async ({ page }) => {
  await page.goto("/projects/portfolio-ybkim/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("portfolio-ybkim");
  await expect(page.locator(".project-supporting")).toBeVisible();
  const projectNavigation = page.getByRole("region", { name: "프로젝트 탐색" });

  await expect(projectNavigation.getByRole("link", { name: "프로젝트 목록" })).toHaveAttribute(
    "href",
    "/#projects",
  );
});
