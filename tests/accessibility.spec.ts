import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./helpers/browser";
import {
  getHeadingOutline,
  getTargetSizeFailures,
  getUntitledSectioningElements,
} from "./helpers/semantics";

const routes = ["/", "/projects/portfolio-ybkim/", "/projects/karly/", "/projects/book-kong/"];

for (const route of routes) {
  test.describe(route, { tag: "@a11y" }, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test("uses one main landmark and one page heading", async ({ page }) => {
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      if (route === "/") {
        await expect(page.locator("h1")).toHaveText("웹 개발자 김용범의 포트폴리오");
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

test("exposes a concise landing-page heading outline", { tag: "@a11y" }, async ({ page }) => {
  await page.goto("/");

  expect(await getHeadingOutline(page)).toEqual([
    { level: 1, text: "웹 개발자 김용범의 포트폴리오" },
    { level: 2, text: "프로젝트" },
    { level: 3, text: "공개 프로젝트" },
    { level: 4, text: "portfolio-ybkim" },
    { level: 4, text: "Karly" },
    { level: 4, text: "Book-Kong" },
    { level: 3, text: "회사 비공개 프로젝트" },
    { level: 4, text: "학원 정보·상담 웹 서비스" },
    { level: 4, text: "과학 문항 개념·풀이 논리 구조화 도구" },
    { level: 4, text: "과학 교육 콘텐츠 제작·검수 플랫폼" },
    { level: 2, text: "역량" },
    { level: 3, text: "기술 스택" },
    { level: 3, text: "구현 역량" },
  ]);
});
