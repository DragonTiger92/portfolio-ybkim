import { expect, test } from "@playwright/test";

const capabilityGroups = [
  {
    title: "프론트엔드 구현",
    description: "의미가 드러나는 HTML, TypeScript, CSS와 접근성을 제품 구조 안에서 함께 다룹니다.",
  },
  {
    title: "제품 전달",
    description: "요구사항, 범위, 문서와 검증 기준을 구현 과정과 연결합니다.",
  },
  {
    title: "통합 이해",
    description: "API, 데이터 흐름, 배포와 릴리스 경계를 이해하고 협업합니다.",
  },
  {
    title: "유지보수",
    description: "명확한 책임, 타입 안정성과 자동화된 품질 검증 절차를 중요하게 생각합니다.",
  },
];

test("groups skills by delivery responsibility instead of tool proficiency", async ({ page }) => {
  await page.goto("/");

  const skills = page.locator("#skills");
  const groups = skills.locator(".capability-grid > li");

  await expect(skills).toContainText(
    "기술 이름을 나열하기보다 제품을 끝까지 전달하는 데 어떻게 활용했는지 설명합니다.",
  );
  await expect(groups).toHaveCount(capabilityGroups.length);

  for (const [index, capabilityGroup] of capabilityGroups.entries()) {
    const group = groups.nth(index);

    await expect(group.locator("h3")).toHaveText(capabilityGroup.title);
    await expect(group.locator("p")).toHaveText(capabilityGroup.description);
  }
});
