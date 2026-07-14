import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/projects/portfolio-ybkim/", "/projects/karly/", "/projects/book-kong/"];

const projectEvidence = [
  {
    classification: "포트폴리오 제품",
    links: [
      "https://github.com/DragonTiger92/portfolio-ybkim",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/README.md",
      "https://github.com/DragonTiger92/portfolio-ybkim/tree/main/docs/adr",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/docs/planning/product-backlog.md",
      "https://github.com/DragonTiger92/portfolio-ybkim/blob/main/package.json",
    ],
    route: "/projects/portfolio-ybkim/",
  },
  {
    classification: "공개 팀 프로젝트",
    links: ["https://github.com/FRONTENDSCHOOL8/Karly", "https://dragontiger92.github.io/Karly/"],
    route: "/projects/karly/",
  },
  {
    classification: "공개 팀 프로젝트",
    links: ["https://github.com/FRONTENDSCHOOL8/Book-Kong", "https://bookong.netlify.app/"],
    route: "/projects/book-kong/",
  },
];

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

  await expect(page.locator("#intro .status-tag")).toHaveText("웹 개발자 포지션을 찾고 있습니다");
  await expect(page.locator("#intro .eyebrow")).toHaveText("웹 개발자 · 프론트엔드 중심");
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

  await expect(page.locator("#projects .eyebrow").first()).toHaveText("검토 가능한 작업");
  await expect(page.locator("#professional-highlights .eyebrow")).toHaveText("실무 경험");
  await expect(page.locator("#skills .eyebrow")).toHaveText("핵심 역량");
  await expect(page.locator("#process .eyebrow")).toHaveText("작업 흐름");
});

test("presents inspectable public projects and disclosure-safe professional highlights", async ({
  page,
}) => {
  await page.goto("/");

  const projectCards = page.locator("#projects .project-card");

  await expect(projectCards).toHaveCount(3);
  await expect(projectCards.locator("h3")).toHaveText(["portfolio-ybkim", "Karly", "Book-Kong"]);
  await expect(projectCards.nth(0).locator(".project-card__links a")).toHaveCount(2);
  await expect(projectCards.nth(1).locator(".project-card__links a")).toHaveCount(3);
  await expect(projectCards.nth(2).locator(".project-card__links a")).toHaveCount(3);

  const professionalCards = page.locator("#professional-highlights .professional-card");

  await expect(professionalCards).toHaveCount(3);
  await expect(professionalCards.locator("h3")).toHaveText([
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

    await expect(page.locator(".project-header .eyebrow")).toHaveText(project.classification);
    await expect(page.locator(".project-facts dt")).toHaveText(["역할", "기여 범위", "초점"]);
    await expect(page.locator(".project-links a")).toHaveCount(project.links.length);
    expect(
      await page
        .locator(".project-links a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ).toEqual(project.links);
    await expect(page.locator(".project-stack .tag-list li").first()).toBeVisible();
    await expect(page.locator(".project-navigation a[href='/#projects']")).toHaveText(
      "전체 프로젝트",
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
