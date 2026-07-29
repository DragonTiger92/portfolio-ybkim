import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  getHeadingOutline,
  getTargetSizeFailures,
  getUntitledSectioningElements,
} from "./helpers/semantics";

const routes = ["/", "/projects/portfolio-ybkim/", "/projects/karly/", "/projects/book-kong/"];

const projectEvidence = [
  {
    classification: "개인 공개 프로젝트",
    headings: [
      "portfolio-ybkim",
      "해결 과제",
      "기여 경계",
      "구현 접근",
      "결과",
      "검토 링크",
      "지원 기술",
      "프로젝트 탐색",
    ],
    links: [
      "https://github.com/DragonTiger92/portfolio-ybkim",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/README.md",
      "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs/adr",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/planning/product-backlog.md",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/package.json",
    ],
    route: "/projects/portfolio-ybkim/",
    supportingLabel: "프로젝트 검토 링크와 지원 기술",
  },
  {
    classification: "부트캠프 공개 팀 프로젝트",
    headings: [
      "Karly",
      "프로젝트 맥락",
      "기여 경계",
      "구현 접근",
      "결과",
      "검토 링크",
      "데모 로그인",
      "지원 기술",
      "프로젝트 탐색",
    ],
    links: ["https://github.com/FRONTENDSCHOOL8/Karly", "https://dragontiger92.github.io/Karly/"],
    route: "/projects/karly/",
    supportingLabel: "프로젝트 검토 링크, 데모 로그인과 지원 기술",
  },
  {
    classification: "부트캠프 공개 팀 프로젝트",
    headings: [
      "Book-Kong",
      "프로젝트 맥락",
      "기여 경계",
      "구현 접근",
      "결과",
      "검토 링크",
      "데모 로그인",
      "지원 기술",
      "프로젝트 탐색",
    ],
    links: ["https://github.com/FRONTENDSCHOOL8/Book-Kong", "https://bookong.netlify.app/"],
    route: "/projects/book-kong/",
    supportingLabel: "프로젝트 검토 링크, 데모 로그인과 지원 기술",
  },
];

for (const route of routes) {
  test.describe(route, () => {
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

test("presents the approved first viewport hierarchy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#intro .job-status dt")).toHaveText("구직 상태");
  await expect(page.locator("#intro .job-status dd")).toHaveText("구직 중");
  await expect(page.locator("#intro .hero-meta")).toHaveCount(0);
  await expect(page.locator("#intro .hero-positioning")).toHaveText(
    "최종 사용자와 개발자 모두를 만족시키는 제품 구현을 지향합니다.",
  );
  await expect(page.locator("#intro .hero-summary")).toHaveCount(0);

  await expect(page.locator("#intro .action-list a")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "주소 복사" })).toBeVisible();

  await expect(page.locator(".section-heading .eyebrow")).toHaveCount(0);
  await expect(page.locator(".project-group__heading .eyebrow")).toHaveCount(0);
  await expect(page.locator(".section-index")).toHaveCount(0);
  await expect(page.locator("#company-projects-title")).toHaveText("회사 비공개 프로젝트");
  await expect(page.locator("#process")).toHaveCount(0);
});

test("exposes a concise landing-page heading outline", async ({ page }) => {
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

test("presents inspectable public results and disclosure-safe company projects", async ({
  page,
}) => {
  await page.goto("/");

  const projectCards = page.locator("#projects .project-card");

  await expect(projectCards).toHaveCount(3);
  await expect(projectCards.locator("h4")).toHaveText(["portfolio-ybkim", "Karly", "Book-Kong"]);
  await expect(projectCards.nth(0).locator(".project-card__links a")).toHaveCount(2);
  await expect(projectCards.nth(1).locator(".project-card__links a")).toHaveCount(4);
  await expect(projectCards.nth(2).locator(".project-card__links a")).toHaveCount(4);
  const professionalCards = page.locator("#projects .professional-card");

  await expect(professionalCards).toHaveCount(3);
  await expect(professionalCards.locator("h4")).toHaveText([
    "학원 정보·상담 웹 서비스",
    "과학 문항 개념·풀이 논리 구조화 도구",
    "과학 교육 콘텐츠 제작·검수 플랫폼",
  ]);
  await expect(professionalCards.locator("a")).toHaveCount(1);
  await expect(professionalCards.locator("a")).toHaveAttribute(
    "href",
    "https://academy.shine-edu.kr/",
  );
});

for (const project of projectEvidence) {
  test(`${project.route} exposes contribution, public evidence, stack, and navigation`, async ({
    page,
  }) => {
    await page.goto(project.route);

    await expect(page.locator(".project-header .project-classification")).toHaveText(
      project.classification,
    );
    await expect(page.locator(".project-facts dt")).toHaveText(["역할", "기여 범위", "초점"]);
    await expect(page.locator(".project-supporting")).toHaveAccessibleName(project.supportingLabel);
    await expect(page.locator(".project-links > p")).toHaveText(
      "제공된 저장소, 배포 또는 문서 링크에서 이 프로젝트의 범위와 결과를 확인할 수 있습니다.",
    );
    await expect(page.locator(".project-links a")).toHaveCount(project.links.length);
    expect(
      await page
        .locator(".project-links a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ).toEqual(project.links);
    await expect(page.locator(".project-stack .tag-list li").first()).toBeVisible();
    await expect(page.locator(".project-navigation a[href='/#projects']")).toHaveText(
      /프로젝트 목록/,
    );
    expect((await getHeadingOutline(page)).map((heading) => heading.text)).toEqual(
      project.headings,
    );
  });
}

test("publishes the reviewed brand identity and install metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".site-identity .site-logo")).toHaveAttribute(
    "src",
    "/assets/brand/logo-mark.svg",
  );
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
    "href",
    "/assets/brand/favicon.svg",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/assets/brand/apple-touch-icon.png",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/assets/brand/site.webmanifest",
  );

  const manifestResponse = await page.request.get("/assets/brand/site.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  expect(await manifestResponse.json()).toMatchObject({
    lang: "ko",
    name: "김용범 웹 개발자 포트폴리오",
    short_name: "김용범 포트폴리오",
  });
});

test("follows the system color theme until the visitor chooses one", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const documentElement = page.locator("html");
  const themeColor = page.locator('meta[name="theme-color"]');

  await expect(documentElement).toHaveAttribute("data-theme", "dark");
  await expect(themeColor).toHaveAttribute("content", "#0d1117");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(documentElement).toHaveAttribute("data-theme", "light");
  await expect(themeColor).toHaveAttribute("content", "#f8fafc");

  await page.locator("[data-theme-toggle]").click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(documentElement).toHaveAttribute("data-theme", "dark");
  await expect(themeColor).toHaveAttribute("content", "#0d1117");
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
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    nextTheme === "dark" ? "#0d1117" : "#f8fafc",
  );

  await page.reload();
  await expect(documentElement).toHaveAttribute("data-theme", nextTheme);
});
