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
  await expect(page.locator(".navigation-list a")).toHaveText(["소개", "프로젝트", "역량"]);
});

test("preserves the intended component colors and font weights", async ({ page }) => {
  await page.goto("/");

  const bodyColor = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).color);
  const wordmark = page.locator(".site-identity__wordmark");
  const themeToggle = page.locator("[data-theme-toggle]");
  const gmailAction = page.locator(".contact-actions .button-link").first();
  const gmailLabel = gmailAction.locator(".button-link__label");
  const gmailIcon = gmailAction.locator(".new-window-link__icon");
  const projectHeading = page.locator(".project-card h4 a").first();

  await expect(wordmark).toHaveCSS("color", bodyColor);
  await expect(wordmark).toHaveCSS("font-weight", "780");
  await expect(themeToggle).toHaveCSS("font-weight", "700");
  await expect(themeToggle).toHaveCSS("border-radius", "999px");

  const gmailForeground = await gmailLabel.evaluate((element) => getComputedStyle(element).color);

  await expect(gmailAction).toHaveCSS("color", gmailForeground);
  await expect(gmailIcon).toHaveCSS("color", gmailForeground);
  await expect(gmailAction).toHaveCSS("font-weight", "750");
  await expect(projectHeading).toHaveCSS("color", bodyColor);
  await expect(projectHeading).toHaveCSS("font-weight", "760");
});

test("keeps job status static and accents only the positioning phrases", async ({ page }) => {
  await page.goto("/");

  const jobStatus = page.locator("#intro .job-status");
  const positioning = page.locator("#intro .hero-positioning");

  await expect(page.locator("#intro .hero-meta")).toHaveCount(0);
  await expect(page.locator("#intro > .hero-layout .eyebrow")).toHaveCount(0);
  expect(await jobStatus.getAttribute("role")).toBeNull();
  expect(await jobStatus.getAttribute("aria-pressed")).toBeNull();
  await expect(jobStatus.locator("dt")).toHaveText("구직 상태");
  await expect(jobStatus.locator("dd")).toHaveText("구직 중");
  await expect(positioning).toHaveText(
    "최종 사용자와 개발자 모두를 만족시키는 제품 구현을 지향합니다.",
  );
  await expect(positioning.locator(".hero-positioning__accent")).toHaveText([
    "최종 사용자",
    "개발자",
  ]);
  await expect(page.locator("#intro .hero-summary")).toHaveCount(0);
  await expect(page.locator("#intro .hero-support")).toHaveCount(0);
});

test("keeps the page title in the document outline without rendering a visual title row", async ({
  page,
}) => {
  await page.goto("/");

  const pageTitle = page.locator("#portfolio-title");

  await expect(pageTitle).toHaveText("웹 개발자 김용범의 포트폴리오");
  await expect(pageTitle).toHaveClass(/visually-hidden/);
  expect(
    await pageTitle.evaluate((element) => window.getComputedStyle(element, "::before").content),
  ).toBe("none");
  await expect(pageTitle).toHaveCSS("clip-path", "inset(50%)");
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
  const desktopWordmarkSize = await page
    .locator(".site-identity__wordmark")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const desktopBodySize = await page
    .locator("body")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const desktopNavigationSize = await navigationLinks
    .first()
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const jobStatusLabelSize = await page
    .locator(".job-status dt")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));
  const jobStatusValueSize = await page
    .locator(".job-status dd")
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

  expect(desktopNavigationGap).toBeGreaterThanOrEqual(40);
  expect(desktopPositioningSize).toBeLessThanOrEqual(56);
  expect(desktopWordmarkSize).toBeGreaterThan(desktopBodySize);
  expect(desktopNavigationSize).toBeGreaterThanOrEqual(desktopBodySize);
  expect(jobStatusLabelSize).toBeGreaterThanOrEqual(desktopBodySize * 0.9);
  expect(jobStatusValueSize).toBeGreaterThanOrEqual(desktopBodySize);
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

test("uses root-document fragments for landing navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('.navigation-list a[href="#intro"]')).toHaveCount(1);
  await expect(page.locator('.navigation-list a[href="#projects"]')).toHaveCount(1);
  await expect(page.locator('.navigation-list a[href="#skills"]')).toHaveCount(1);
  await expect(page.locator('.navigation-list a[href="#process"]')).toHaveCount(0);
});

test("shows the current landing section and overall reading progress", async ({ page }) => {
  await page.goto("/");

  const introLink = page.locator('.navigation-list a[href="#intro"]');
  const skillsLink = page.locator('.navigation-list a[href="#skills"]');

  await expect(introLink).toHaveAttribute("aria-current", "location");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(skillsLink).toHaveAttribute("aria-current", "location");
  await expect(introLink).not.toHaveAttribute("aria-current", "location");

  const progress = await page
    .locator("[data-page-progress]")
    .evaluate((element) => Number.parseFloat(element.style.getPropertyValue("--page-progress")));

  expect(progress).toBeGreaterThan(0);
});
