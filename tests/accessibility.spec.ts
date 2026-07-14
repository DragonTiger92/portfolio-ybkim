import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/projects/portfolio-ybkim/", "/projects/karly/", "/projects/book-kong/"];

interface TargetSizeFailure {
  height: number;
  label: string;
  width: number;
}

async function getTargetSizeFailures(page: Page) {
  return page.evaluate<TargetSizeFailure[]>(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, [role="button"]'),
    );

    function inspectTarget(target: HTMLElement): TargetSizeFailure | null {
      const rectangle = target.getBoundingClientRect();
      const isVisible = rectangle.width > 0 && rectangle.height > 0;
      const isLargeEnough = rectangle.width >= 44 && rectangle.height >= 44;

      if (!isVisible || isLargeEnough) {
        return null;
      }

      const targetName = target.getAttribute("aria-label") ?? target.innerText.trim();

      return {
        height: Math.round(rectangle.height),
        label: targetName || target.tagName,
        width: Math.round(rectangle.width),
      };
    }

    return targets.map(inspectTarget).filter((failure) => failure !== null);
  });
}

async function getUntitledSectioningElements(page: Page) {
  return page.evaluate<string[]>(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>("section, article"));

    return containers.flatMap((container) => {
      const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      const ownsHeading = headings.some(
        (heading) => heading.closest("section, article") === container,
      );

      return ownsHeading ? [] : [container.id || container.className || container.tagName];
    });
  });
}

for (const route of routes) {
  test.describe(route, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test("uses one main landmark and one page heading", async ({ page }) => {
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      if (route === "/") {
        await expect(page.locator("h1")).toHaveText(
          "사용자가 이해하기 쉬운 UI와 오래 관리할 수 있는 웹 제품을 만듭니다.",
        );
      }
    });

    test("keeps sectioning elements titled", async ({ page }) => {
      expect(await getUntitledSectioningElements(page)).toEqual([]);
    });

    test("has no automatically detectable WCAG A or AA violations", async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test("keeps pointer targets at least 44 by 44 CSS pixels", async ({ page }) => {
      expect(await getTargetSizeFailures(page)).toEqual([]);
    });

    test("does not overflow the viewport horizontally", async ({ page }) => {
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );

      expect(hasHorizontalOverflow).toBe(false);
    });
  });
}

test("presents the approved first viewport hierarchy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#intro .status-tag")).toHaveText(
    "새로운 웹 개발자 기회에 열려 있습니다",
  );
  await expect(page.locator("#intro .eyebrow")).toHaveText(
    "Web Developer · Frontend-focused delivery",
  );
  await expect(page.locator("#intro .hero-summary")).toHaveText(
    "프론트엔드 구현을 중심으로 데이터 흐름, 문서화, 검증 가능한 결과물을 함께 정리하는 개발자 김용범입니다.",
  );

  const actions = page.locator("#intro .action-list a");

  await expect(actions).toHaveCount(3);
  await expect(actions.nth(0)).toHaveText("이메일로 연락하기");
  await expect(actions.nth(0)).toHaveAttribute("href", "mailto:dczwtu12b+portfolio@gmail.com");
  await expect(actions.nth(1)).toHaveText("GitHub 보기");
  await expect(actions.nth(1)).toHaveAttribute(
    "href",
    "https://github.com/DragonTiger92/portfolio-ybkim",
  );
  await expect(actions.nth(2)).toHaveAccessibleName("이력서 PDF 다운로드");
  await expect(actions.nth(2)).toHaveAttribute("href", "/assets/resume/yb-kim-resume.pdf");
});

test("switches and persists the explicit color theme", async ({ page }) => {
  await page.goto("/");

  const themeButton = page.locator("[data-theme-toggle]");
  const documentElement = page.locator("html");
  const initialTheme = await documentElement.getAttribute("data-theme");
  const nextTheme = initialTheme === "dark" ? "light" : "dark";

  await themeButton.click();
  await expect(documentElement).toHaveAttribute("data-theme", nextTheme);
  await expect(themeButton).toHaveAttribute("aria-pressed", String(nextTheme === "dark"));

  await page.reload();
  await expect(documentElement).toHaveAttribute("data-theme", nextTheme);
});
