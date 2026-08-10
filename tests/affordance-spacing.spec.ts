import { expect, test, type Locator, type Page } from "@playwright/test";

const publicRoutes = [
  "/",
  "/projects/portfolio-ybkim/",
  "/projects/karly/",
  "/projects/book-kong/",
];

interface AffordanceGap {
  minimumGap: number;
  renderedGap: number;
}

async function expectAffordanceColor(container: Locator, tokenName: string): Promise<void> {
  const colors = await container.evaluate((element, token) => {
    const label = element.querySelector(":scope > .affordance-pair__label");
    const mark = element.querySelector(":scope > .affordance-pair__mark");

    if (label === null || mark === null) {
      throw new Error("Expected the affordance pair to contain label and mark elements.");
    }

    const probe = document.createElement("span");

    probe.style.color = `var(${token})`;
    document.body.append(probe);

    const tokenColor = getComputedStyle(probe).color;

    probe.remove();

    return {
      labelColor: getComputedStyle(label).color,
      markColor: getComputedStyle(mark).color,
      tokenColor,
    };
  }, tokenName);

  expect(colors.labelColor).toBe(colors.tokenColor);
  expect(colors.markColor).toBe(colors.tokenColor);
}

async function getAffordanceGap(
  container: Locator,
  labelSelector: string,
  markSelector: string,
): Promise<AffordanceGap> {
  return container.evaluate(
    (element, selectors) => {
      const label = element.querySelector(selectors.label);
      const mark = element.querySelector(selectors.mark);

      if (label === null || mark === null) {
        throw new Error(
          "Expected the affordance pair to contain separate label and mark elements.",
        );
      }

      const labelBox = label.getBoundingClientRect();
      const markBox = mark.getBoundingClientRect();
      const renderedGap = Math.max(labelBox.left - markBox.right, markBox.left - labelBox.right);
      const minimumGap = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--space-1"),
      );

      return { minimumGap, renderedGap };
    },
    { label: labelSelector, mark: markSelector },
  );
}

async function expectMinimumAffordanceGap(
  container: Locator,
  labelSelector: string,
  markSelector: string,
): Promise<void> {
  const { minimumGap, renderedGap } = await getAffordanceGap(
    container,
    labelSelector,
    markSelector,
  );

  expect(minimumGap).toBeGreaterThan(0);
  expect(renderedGap).toBeGreaterThanOrEqual(minimumGap - 0.5);
}

async function expectVisibleNewWindowGap(link: Locator): Promise<void> {
  if (!(await link.isVisible())) {
    return;
  }

  await expectMinimumAffordanceGap(
    link,
    ":scope > .new-window-link__label",
    ":scope > .new-window-link__icon",
  );
}

async function expectCanonicalNewWindowLinks(page: Page): Promise<void> {
  const newWindowLinks = page.locator('a[target="_blank"]');
  const linkCount = await newWindowLinks.count();

  expect(linkCount).toBeGreaterThan(0);

  for (const link of await newWindowLinks.all()) {
    await expect(link).toHaveClass(/(?:^|\s)new-window-link(?:\s|$)/);
    await expect(link.locator(":scope > .new-window-link__label")).toHaveCount(1);
    await expect(link.locator(":scope > .new-window-link__icon")).toHaveCount(1);
    await expect(link.locator(":scope > .new-window-link__icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expectVisibleNewWindowGap(link);
  }
}

for (const route of publicRoutes) {
  test(`${route} uses the canonical new-window affordance contract`, async ({ page }) => {
    await page.goto(route);
    await expectCanonicalNewWindowLinks(page);
  });
}

test("keeps non-external text and affordance marks visibly separated", async ({ page }) => {
  await page.goto("/");

  await expectMinimumAffordanceGap(
    page.locator("[data-theme-toggle]"),
    "[data-theme-label]",
    ".theme-toggle__icon",
  );
  await expectMinimumAffordanceGap(
    page.getByRole("link", { name: "이력서 PDF 다운로드" }),
    ".button-link__download-label",
    ".button-link__download-icon",
  );

  await page.goto("/projects/karly/");

  await expectMinimumAffordanceGap(
    page.locator(".project-navigation__featured"),
    "strong",
    ".project-navigation__arrow",
  );
  await expectMinimumAffordanceGap(
    page.locator(".project-navigation__utilities .text-link").first(),
    ".affordance-pair__label",
    ".affordance-pair__mark",
  );
});

test("keeps demo-request affordances visible in light and dark button states", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/projects/karly/");

    const requestLink = page.locator("[data-demo-access-trigger]");

    await expectAffordanceColor(requestLink, "--color-text");
    await requestLink.click();

    const continueLink = page.locator("[data-demo-access-continue]");

    await expect(continueLink).toBeVisible();
    await expectAffordanceColor(continueLink, "--color-on-accent");
    await page.getByRole("button", { name: "닫기" }).click();
  }
});
