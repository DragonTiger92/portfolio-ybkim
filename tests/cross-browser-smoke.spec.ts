import { expect, test } from "./helpers/browser";

test(
  "renders and navigates the landing page without horizontal overflow",
  { tag: "@e2e" },
  async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "웹 개발자 김용범의 포트폴리오",
    );

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);

    await page.getByRole("link", { name: "프로젝트", exact: true }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator("#projects-title")).toBeInViewport();
  },
);

test(
  "switches the theme and keeps the primary contact actions usable",
  { tag: "@e2e" },
  async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.locator("[data-theme-toggle]");
    const initialTheme = await page.locator("html").getAttribute("data-theme");
    const nextTheme = initialTheme === "dark" ? "light" : "dark";

    await themeToggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
    await expect(page.locator("#intro .action-list a")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "주소 복사" })).toBeEnabled();
  },
);

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

const demoRequestEntries = [
  { route: "/", title: "Karly" },
  { route: "/", title: "Book-Kong" },
  { route: "/projects/karly/", title: "Karly" },
  { route: "/projects/book-kong/", title: "Book-Kong" },
];

for (const entry of demoRequestEntries) {
  test(
    `${entry.route} ${entry.title} dismisses only a complete backdrop click or tap`,
    { tag: ["@a11y", "@e2e"] },
    async ({ page, hasTouch }) => {
      await page.goto(entry.route);
      const trigger = page.getByRole("button", { name: `${entry.title} 테스트 계정 요청` });
      const dialog = page.getByRole("dialog", { name: "Gmail에서 테스트 계정 요청" });
      await trigger.click();
      await expect(dialog).toBeVisible();

      await page.evaluate(() => {
        document.documentElement.dataset.backgroundClicks = "0";
        document.addEventListener("click", (event) => {
          if (event.target instanceof Element && event.target.closest("dialog")) return;

          document.documentElement.dataset.backgroundClicks = String(
            Number(document.documentElement.dataset.backgroundClicks) + 1,
          );
        });
      });

      await dialog.locator(".demo-dialog__title").click();
      await expect(dialog).toBeVisible();
      await dialog.click({ position: { x: 4, y: 4 } });
      await expect(dialog).toBeVisible();
      await dialog.locator("textarea").click();
      await expect(dialog).toBeVisible();

      const bounds = await dialog.boundingBox();
      if (!bounds) throw new Error("Expected the open dialog to have bounds");
      const inside = { x: bounds.x + 4, y: bounds.y + 4 };
      const outside = { x: 2, y: 2 };

      // A drag crossing the dialog edge must not be mistaken for a backdrop click.
      await page.mouse.move(inside.x, inside.y);
      await page.mouse.down();
      await page.mouse.move(outside.x, outside.y);
      await page.mouse.up();
      await expect(dialog).toBeVisible();
      await page.mouse.move(outside.x, outside.y);
      await page.mouse.down();
      await page.mouse.move(inside.x, inside.y);
      await page.mouse.up();
      await expect(dialog).toBeVisible();

      if (hasTouch) await page.touchscreen.tap(outside.x, outside.y);
      else await page.mouse.click(outside.x, outside.y);

      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await expect(page).toHaveURL(entry.route);
      await expect(page.locator("html")).toHaveAttribute("data-background-clicks", "0");
      expect(page.context().pages()).toHaveLength(1);

      await trigger.click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    },
  );
}
