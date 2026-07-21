import { expect, test, type Locator } from "@playwright/test";

async function getVisibleBox(locator: Locator) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  if (box === null) {
    throw new Error("Expected the responsive target to be visible.");
  }

  return box;
}

test("preserves the portfolio hierarchy from wide to narrow layouts", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/");

  const heroLayout = await getVisibleBox(page.locator(".hero-layout"));
  const heroCopy = await getVisibleBox(page.locator(".hero-copy"));
  const projectsHeading = await getVisibleBox(page.locator("#projects-title"));
  const featuredProject = await getVisibleBox(page.locator(".project-card--featured"));
  const secondaryProject = await getVisibleBox(page.locator(".project-card").nth(1));

  expect(heroCopy.x).toBeGreaterThanOrEqual(heroLayout.x);
  expect(heroCopy.width).toBeGreaterThan(heroLayout.width * 0.6);
  expect(projectsHeading.y).toBeLessThan(1000);
  const sectionPadding = await page
    .locator(".content-section")
    .first()
    .evaluate((section) => {
      const styles = window.getComputedStyle(section);

      return {
        bottom: Number.parseFloat(styles.paddingBottom),
        top: Number.parseFloat(styles.paddingTop),
      };
    });
  expect(sectionPadding.top).toBe(sectionPadding.bottom);
  await expect(page.locator(".hero-proof")).toHaveCount(0);
  expect(featuredProject.width).toBeGreaterThan(secondaryProject.width);

  const primaryActionColors = await page.locator(".button-link__label").evaluate((label) => {
    const action = label.closest("a");

    if (action === null) {
      throw new Error("Expected the primary action label to be inside a link.");
    }

    return {
      background: window.getComputedStyle(action).backgroundColor,
      foreground: window.getComputedStyle(label).color,
    };
  });

  expect(primaryActionColors.foreground).not.toBe(primaryActionColors.background);

  const professionalCards = page.locator(".professional-card");
  await expect(professionalCards).toHaveCount(3);
  expect((await getVisibleBox(professionalCards.nth(1))).y).toBeGreaterThan(
    (await getVisibleBox(professionalCards.nth(0))).y,
  );

  await page.setViewportSize({ height: 844, width: 390 });

  const narrowHeroCopy = await getVisibleBox(page.locator(".hero-copy"));
  const narrowSectionShell = await getVisibleBox(
    page.locator(".content-section > .site-shell").first(),
  );
  const projectCards = page.locator(".project-card");

  expect(narrowHeroCopy.width).toBeGreaterThan(0);
  expect(narrowSectionShell.x).toBe(12);
  await expect(page.locator(".hero-proof")).toHaveCount(0);
  expect((await getVisibleBox(projectCards.nth(1))).y).toBeGreaterThan(
    (await getVisibleBox(projectCards.nth(0))).y,
  );
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
});

test("keeps project evidence beside the article only when space allows", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/projects/portfolio-ybkim/");

  const prose = await getVisibleBox(page.locator(".prose"));
  const supporting = await getVisibleBox(page.locator(".project-supporting"));

  expect(supporting.x).toBeGreaterThan(prose.x + prose.width);

  await page.setViewportSize({ height: 844, width: 390 });

  const narrowProse = await getVisibleBox(page.locator(".prose"));
  const narrowSupporting = await getVisibleBox(page.locator(".project-supporting"));

  expect(narrowSupporting.y).toBeGreaterThan(narrowProse.y + narrowProse.height);
});
