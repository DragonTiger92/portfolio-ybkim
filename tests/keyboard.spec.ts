import { expect, test, type Locator, type Page } from "./helpers/browser";

async function tabTo(page: Page, target: Locator): Promise<void> {
  let steps = 0;
  while (!(await target.evaluate((element) => element === document.activeElement)) && steps < 40) {
    await page.keyboard.press("Tab");
    steps += 1;
  }
  await expect(target, "The action must be reachable using Tab alone").toBeFocused();
}

async function crossDialogBoundary(page: Page, target: Locator, key: string): Promise<void> {
  await page.keyboard.press(key);
  if (!(await target.evaluate((element) => element === document.activeElement))) {
    // Native dialogs may visit browser chrome before wrapping; background controls stay inert.
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
    await page.keyboard.press(key);
  }
  await expect(target).toBeFocused();
}

test("skips repeated navigation and reaches the main contact action with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "본문으로 이동" });

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Gmail에서 메일 쓰기(새 창)" })).toBeFocused();
});

test("navigates to projects and operates the theme control using only the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const projectsLink = page.getByRole("link", { name: "프로젝트", exact: true });
  await tabTo(page, projectsLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects-title")).toBeInViewport();

  await page.goto("/");
  const themeToggle = page.locator("[data-theme-toggle]");
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  await tabTo(page, themeToggle);
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    initialTheme === "dark" ? "light" : "dark",
  );
});

test("contains dialog focus and restores it to the request link after Escape", async ({ page }) => {
  await page.goto("/projects/karly/");
  const trigger = page.getByRole("link", {
    name: "Karly 테스트 계정 요청 메일 작성(Gmail 새 창)",
  });
  await tabTo(page, trigger);
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Gmail에서 테스트 계정 요청" });
  const close = dialog.getByRole("button", { name: "닫기" });
  const continueLink = dialog.getByRole("link", { name: "Gmail에서 계속(새 창)" });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await crossDialogBoundary(page, continueLink, "Shift+Tab");
  await crossDialogBoundary(page, close, "Tab");

  await page.keyboard.press("Tab");
  await expect(dialog.locator("textarea")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "메일 양식 복사" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(continueLink).toBeFocused();
  await crossDialogBoundary(page, close, "Tab");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
