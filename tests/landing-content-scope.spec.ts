import { expect, test } from "@playwright/test";

test("distinguishes project evidence and business context without splitting the IA", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("#intro .hero-support")).toHaveCount(0);

  const publicProjectCards = page.locator("#projects .project-card");
  const companyProjectCards = page.locator("#projects .professional-card");
  const publicProjectCount = await publicProjectCards.count();
  const companyProjectCount = await companyProjectCards.count();

  expect(publicProjectCount).toBe(3);
  expect(companyProjectCount).toBe(3);
  await expect(page.locator("#professional-highlights")).toHaveCount(0);
  await expect(page.locator("#intro .hero-proof")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "포트폴리오 확인 가이드" })).toHaveCount(0);

  await expect(page.locator(".section-heading .eyebrow")).toHaveCount(0);
  await expect(page.locator(".project-group__heading .eyebrow")).toHaveCount(0);
  await expect(page.locator(".section-index")).toHaveCount(0);
  await expect(page.locator("#process")).toHaveCount(0);
  await expect(page.locator("#projects .section-heading > p")).toHaveCount(0);
  await expect(page.locator("#public-projects-title")).toHaveText("공개 프로젝트");
  await expect(
    page.locator("#projects .project-group").first().locator(".project-group__heading > p"),
  ).toHaveCount(0);
  await expect(page.locator("#company-projects-title")).toHaveText("회사 비공개 프로젝트");

  await expect(companyProjectCards.locator(".professional-card__scope")).toHaveCount(0);
  await expect(companyProjectCards.first().locator(".tag-list li")).toHaveText([
    "기획 및 제품 설계",
    "아키텍처 구현",
    "1인 유지보수성 확보",
  ]);
  await expect(companyProjectCards.nth(1).locator(".professional-card__description")).toHaveText(
    "인증 흐름과 초기 UI mockup을 포함한 프론트엔드 구조 전반을 구축 후, 다음 작업자가 프론트엔드 작업을 이어나갈 수 있도록 인계했습니다.",
  );
  await expect(companyProjectCards.nth(1).locator(".tag-list li")).toHaveText([
    "프론트엔드 구축",
    "로그인 흐름 설계",
    "API 응답·도메인 타입 분리",
  ]);
  await expect(companyProjectCards.nth(2).locator(".professional-card__description")).toHaveText(
    "기존 내부 업무 플랫폼을 인수받아 운영 안정성을 보강하고, 트러블 슈팅 도구를 만들어 운영상 발생하는 문제들을 해결하였습니다. 또한 제품 인계를 위한 문서 작업 등을 진행하였습니다.",
  );
  await expect(companyProjectCards.nth(2).locator(".tag-list li")).toHaveText([
    "인수인계",
    "풀스택",
    "트러블 슈팅",
  ]);
  await expect(page.locator(".project-group--company .project-group__heading > p")).toHaveText(
    "회사에서 비즈니스 목적으로 수행한 실무 프로젝트입니다. 비공개 소스 코드를 포함한 내부 정보는 제외하였습니다.",
  );
  await expect(page.locator(".project-group--company .project-group__heading > p br")).toHaveCount(
    0,
  );
});

test("aligns company project content and shares the public project tag treatment", async ({
  page,
}) => {
  await page.goto("/");

  const publicProjectCards = page.locator("#projects .project-card");
  const companyProjectCards = page.locator("#projects .professional-card");
  const projectGroupLayout = await page.evaluate(() => {
    const publicGroup = document.querySelector<HTMLElement>(".project-group--public");
    const companyHeading = document.querySelector<HTMLElement>(
      ".project-group--company .project-group__heading",
    );
    const companyDescription = companyHeading?.querySelector<HTMLElement>(":scope > p");

    if (!publicGroup || !companyHeading || !companyDescription) {
      return null;
    }

    return {
      companyAlignItems: getComputedStyle(companyHeading).alignItems,
      companyDescriptionMaxInlineSize: getComputedStyle(companyDescription).maxInlineSize,
      companyHeadingMaxInlineSize: getComputedStyle(companyHeading).maxInlineSize,
      publicGap: getComputedStyle(publicGroup).rowGap,
    };
  });

  expect(projectGroupLayout?.publicGap).toBe("32px");

  if ((page.viewportSize()?.width ?? 0) >= 768) {
    expect(projectGroupLayout).toMatchObject({
      companyAlignItems: "center",
      companyDescriptionMaxInlineSize: "none",
      companyHeadingMaxInlineSize: "none",
    });
  }

  const firstCompanyCard = companyProjectCards.first();
  await expect(firstCompanyCard.locator(".professional-card__index")).toHaveCSS(
    "align-self",
    "auto",
  );
  await expect(firstCompanyCard.locator(".professional-card__content")).toHaveCSS(
    "align-self",
    "center",
  );
  await expect(firstCompanyCard.locator(".tag-list")).toHaveCSS("align-self", "center");
  await expect(firstCompanyCard.locator(":scope > .text-link")).toHaveCSS("align-self", "center");

  const tagStyleProperties = ["background-image", "border-color", "box-shadow", "font-weight"];
  const publicTag = publicProjectCards.first().locator(":scope > .tag-list li").first();
  const companyTag = firstCompanyCard.locator(":scope > .tag-list li").first();
  const [publicTagStyles, companyTagStyles] = await Promise.all([
    publicTag.evaluate(
      (element, properties) =>
        properties.map((property) => getComputedStyle(element).getPropertyValue(property)),
      tagStyleProperties,
    ),
    companyTag.evaluate(
      (element, properties) =>
        properties.map((property) => getComputedStyle(element).getPropertyValue(property)),
      tagStyleProperties,
    ),
  ]);

  expect(companyTagStyles).toEqual(publicTagStyles);
});

test("opens the public company service without replacing the portfolio", async ({ page }) => {
  await page.goto("/");

  const publicService = page.getByRole("link", { name: "공개 서비스 보기(새 창)" });

  await expect(publicService).toHaveAttribute("target", "_blank");
  await expect(publicService).toHaveAttribute("rel", "noopener noreferrer");
  await expect(publicService.locator(".new-window-link__label")).toHaveText("공개 서비스 보기");
  await expect(publicService.locator(".new-window-link__icon")).toHaveText("↗");
});

test("removes the previous mixed-scope landing copy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#intro .hero-support")).toHaveCount(0);

  for (const previousCopy of [
    "포트폴리오 확인 가이드",
    "추천 확인 순서",
    "검토 경로",
    "구현 방식",
    "Astro · TypeScript · CSS",
    "실무 경험",
  ]) {
    await expect(page.getByText(previousCopy, { exact: true })).toHaveCount(0);
  }
});

test("keeps the revised landing content within wide and narrow viewports", async ({ page }) => {
  for (const viewport of [
    { height: 1000, width: 1440 },
    { height: 844, width: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
  }
});
