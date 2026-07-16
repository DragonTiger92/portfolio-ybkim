import { expect, test } from "@playwright/test";

const heroSupportCopy =
  "Astro로 만든 이 포트폴리오와 Karly, Book-Kong은 소스와 결과를 확인할 수 있는 공개 프로젝트입니다. 실무 경험은 공개 가능한 범위에서 역할과 기여를 요약했습니다.";
const professionalScopeLabel = "실무 경험 · 공개 범위 요약";
const reviewOrder = "프로젝트 → 실무 경험 → 역량 → 작업 방식";

test("distinguishes public project evidence from summarized professional experience", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("#intro .hero-support")).toHaveText(heroSupportCopy);

  const heroProof = page.locator("#intro .hero-proof");
  const projectCards = page.locator("#projects .project-card");
  const professionalCards = page.locator("#professional-highlights .professional-card");
  const projectCount = await projectCards.count();
  const professionalCount = await professionalCards.count();

  expect(projectCount).toBe(3);
  expect(professionalCount).toBe(3);
  await expect(heroProof).toHaveAccessibleName("공개 근거와 경험 요약");
  await expect(heroProof.locator(".eyebrow")).toHaveText("포트폴리오 검토 안내");
  await expect(heroProof.locator(".hero-proof__title")).toHaveText("공개 근거와 경험 요약");
  await expect(heroProof.locator("dt")).toHaveText(["공개 프로젝트", "실무 경험", "검토 순서"]);
  await expect(heroProof.locator("dd")).toHaveText([
    `${projectCount}개 · 소스와 결과 확인 가능`,
    `${professionalCount}개 · 공개 가능한 범위로 요약`,
    reviewOrder,
  ]);

  await expect(page.locator("#projects .section-heading__title .eyebrow")).toHaveText(
    "공개 프로젝트",
  );
  await expect(page.locator("#projects .section-heading--split > p")).toHaveText(
    "소스 또는 배포 결과를 확인할 수 있는 세 프로젝트입니다. 각 카드에서 맡은 역할과 구현 범위, 공개 근거를 함께 살펴볼 수 있습니다.",
  );
  await expect(
    page.locator("#professional-highlights .section-heading__title .eyebrow"),
  ).toHaveText("공개 범위로 요약");
  await expect(page.locator("#professional-highlights h2")).toHaveText("실무 경험");
  await expect(page.locator("#professional-highlights .section-heading--split > p")).toHaveText(
    "비공개 자료와 내부 세부사항은 제외하고, 공개 가능한 범위에서 확인된 역할과 기여를 요약했습니다.",
  );

  const scopeLabels = professionalCards.locator(".professional-card__scope");

  await expect(scopeLabels).toHaveCount(professionalCount);

  for (const scopeLabel of await scopeLabels.all()) {
    await expect(scopeLabel).toBeVisible();
    await expect(scopeLabel).toHaveText(professionalScopeLabel);
  }
});

test("removes the previous mixed-scope landing copy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#intro .hero-support")).not.toContainText("공개 가능한 실무 작업");

  const heroProof = page.locator("#intro .hero-proof");

  for (const previousCopy of ["검토 경로", "구현 방식", "Astro · TypeScript · CSS"]) {
    await expect(heroProof.getByText(previousCopy, { exact: true })).toHaveCount(0);
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
