import { expect, test, type Locator } from "@playwright/test";

async function getVisibleBox(locator: Locator) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  if (box === null) {
    throw new Error("Expected the hierarchy target to be visible.");
  }

  return box;
}

test("presents a concise site wordmark and a secondary theme utility", async ({ page }) => {
  await page.goto("/");

  const identity = page.locator(".site-identity");
  const themeToggle = page.locator("[data-theme-toggle]");

  await expect(identity).toHaveAccessibleName("김용범 포트폴리오 홈");
  await expect(identity.locator(".site-identity__wordmark")).toHaveText("김용범 포트폴리오");
  await expect(identity.locator(".site-identity__copy")).toHaveCount(0);
  await expect(themeToggle).toHaveAttribute("aria-pressed", /^(true|false)$/);
  await expect(themeToggle).not.toHaveClass(/button-link/);
  await expect(page.locator(".navigation-list a")).toHaveText(["프로젝트", "역량", "작업 방식"]);
});

test("keeps job status static and accents only the positioning phrases", async ({ page }) => {
  await page.goto("/");

  const heroMeta = page.locator("#intro .hero-meta");
  const jobStatus = heroMeta.locator(".job-status");
  const positioning = page.locator("#intro .hero-positioning");

  await expect(heroMeta.getByRole("button")).toHaveCount(0);
  expect(await jobStatus.getAttribute("role")).toBeNull();
  expect(await jobStatus.getAttribute("aria-pressed")).toBeNull();
  await expect(jobStatus.locator("dt")).toHaveText("구직 상태");
  await expect(jobStatus.locator("dd")).toHaveText("구직 중");
  await expect(positioning).toHaveText(
    "사용자가 이해하기 쉬운 UI와 오래 관리할 수 있는 웹 제품을 만듭니다.",
  );
  await expect(positioning.locator(".hero-positioning__accent")).toHaveText([
    "이해하기 쉬운 UI",
    "오래 관리할 수 있는 웹 제품",
  ]);
});

test("preserves a restrained hierarchy from desktop to mobile", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/");

  const navigationLinks = page.locator(".navigation-list a");
  const firstNavigationLink = await getVisibleBox(navigationLinks.nth(0));
  const secondNavigationLink = await getVisibleBox(navigationLinks.nth(1));
  const desktopNavigationGap =
    secondNavigationLink.x - (firstNavigationLink.x + firstNavigationLink.width);
  const themeToggle = page.locator("[data-theme-toggle]");
  const desktopThemeBox = await getVisibleBox(themeToggle);
  const desktopPositioningSize = await page
    .locator(".hero-positioning")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const themeBackground = await themeToggle.evaluate(
    (element) => window.getComputedStyle(element).backgroundColor,
  );
  const headerSourceOrder = await page
    .locator(".header-layout")
    .evaluate((header) =>
      Array.from(header.children).map((element) => element.tagName.toLowerCase()),
    );
  const jobStatusBackground = await page
    .locator(".job-status dd")
    .evaluate((element) => window.getComputedStyle(element).backgroundColor);

  expect(desktopNavigationGap).toBeGreaterThanOrEqual(20);
  expect(desktopPositioningSize).toBeLessThanOrEqual(56);
  expect(desktopThemeBox.width).toBeGreaterThanOrEqual(44);
  expect(desktopThemeBox.height).toBeGreaterThanOrEqual(44);
  expect(headerSourceOrder).toEqual(["a", "nav", "button"]);
  expect(themeBackground).toBe("rgba(0, 0, 0, 0)");
  expect(jobStatusBackground).toBe("rgba(0, 0, 0, 0)");

  await page.setViewportSize({ height: 844, width: 390 });

  const mobileIdentityBox = await getVisibleBox(page.locator(".site-identity"));
  const mobileThemeBox = await getVisibleBox(themeToggle);
  const mobileNavigationBox = await getVisibleBox(page.locator(".header-layout nav"));
  const mobilePositioningSize = await page
    .locator(".hero-positioning")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  const navigationCenter = mobileNavigationBox.y + mobileNavigationBox.height / 2;
  const themeCenter = mobileThemeBox.y + mobileThemeBox.height / 2;

  expect(mobileNavigationBox.y).toBeGreaterThanOrEqual(
    mobileIdentityBox.y + mobileIdentityBox.height,
  );
  expect(mobileNavigationBox.x).toBeLessThan(mobileThemeBox.x);
  expect(Math.abs(navigationCenter - themeCenter)).toBeLessThanOrEqual(4);
  expect(mobilePositioningSize).toBeLessThanOrEqual(36);
  expect(hasHorizontalOverflow).toBe(false);
});
