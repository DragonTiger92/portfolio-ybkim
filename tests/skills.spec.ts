import { expect, test } from "@playwright/test";

const techStackCategories = [
  "언어",
  "프론트엔드",
  "백엔드 · API",
  "데이터베이스 · 스토리지",
  "클라우드 · 인프라",
  "DevOps · CI/CD",
  "테스트 · 품질",
  "보안 · 소프트웨어 공급망",
  "버전 관리 · 협업",
];

const capabilityTitles = [
  "기계적인 품질 피드백",
  "안전한 Agent 개발 환경",
  "문서 Architecture와 작업 추적",
  "웹 표준과 접근성",
  "자동화된 회귀 검증",
];

test("presents the reviewed resume stack with optional local marks", async ({ page }) => {
  await page.goto("/");

  const stack = page.locator("#skills .tech-stack");
  const backendStack = stack.locator(".tech-stack__group", { hasText: "백엔드 · API" });
  const testingStack = stack.locator(".tech-stack__group", { hasText: "테스트 · 품질" });

  await expect(stack).toHaveAccessibleName("기술 스택");
  await expect(stack.locator(".tech-stack__group dt")).toHaveText(techStackCategories);
  await expect(backendStack.locator(".tech-stack__items > li > span:last-child")).toHaveText([
    "Django",
    "FastAPI",
    "SQLAlchemy",
    "Alembic",
  ]);
  await expect(testingStack.locator(".tech-stack__items > li > span:last-child")).toHaveText([
    "Vitest",
    "Playwright",
    "Mock Service Worker",
    "ESLint",
    "Husky",
  ]);
  await expect(stack.locator(".tech-stack__items > li")).toHaveCount(34);
  await expect(stack.locator(".tech-stack__mark")).toHaveCount(25);
  await expect(
    stack.locator("[class*='tech-stack__icon--']:not(.tech-stack__icon--fallback)"),
  ).toHaveCount(25);
  await expect(stack.locator(".tech-stack__icon--fallback")).toHaveCount(9);
});

test("compares implementation capabilities through one evidence matrix", async ({ page }) => {
  await page.goto("/");

  const matrix = page.locator("#skills .capability-matrix");
  const rows = matrix.locator("tbody tr");

  await expect(matrix).toHaveAccessibleName("구현 역량");
  await expect(matrix.locator("thead th")).toHaveText([
    "역량",
    "설계 기준",
    "자동화 경로",
    "확인 근거",
  ]);
  await expect(rows).toHaveCount(capabilityTitles.length);
  await expect(rows.locator("th[scope='row'] strong")).toHaveText(capabilityTitles);
  await expect(rows.locator("a")).toHaveCount(capabilityTitles.length);
  await expect(rows.locator("a[target='_blank'][rel='noopener noreferrer']")).toHaveCount(
    capabilityTitles.length,
  );
  await expect(matrix).not.toContainText("visual regression");
});
