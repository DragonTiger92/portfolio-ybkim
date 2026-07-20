import { expect, test } from "@playwright/test";

const projectCards = [
  {
    classification: "개인 공개 프로젝트",
    links: ["상세 설명", "GitHub 저장소"],
    role: "기획 · 구현",
    title: "portfolio-ybkim",
  },
  {
    classification: "부트캠프 공개 팀 프로젝트",
    links: ["상세 설명", "팀 저장소", "배포 데모"],
    role: "프론트엔드 담당",
    title: "Karly",
  },
  {
    classification: "부트캠프 공개 팀 프로젝트",
    links: ["상세 설명", "팀 저장소", "배포 데모"],
    role: "프론트엔드 담당 · 팀 리드",
    title: "Book-Kong",
  },
];

test("uses reviewable project content instead of decorative identity panels", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator("#projects .project-card");

  await expect(cards).toHaveCount(projectCards.length);
  await expect(cards.locator(".project-card__identity")).toHaveCount(0);

  for (const [index, expectedCard] of projectCards.entries()) {
    const card = cards.nth(index);

    await expect(card.locator(".project-card__meta .eyebrow")).toHaveText(
      expectedCard.classification,
    );
    await expect(card.locator("h4 a")).toHaveText(expectedCard.title);
    await expect(card.locator(".project-card__summary")).not.toBeEmpty();
    await expect(card.locator(".project-card__role")).toHaveText(expectedCard.role);
    expect(await card.locator(".tag-list li").count()).toBeGreaterThan(0);
    await expect(card.locator(".project-card__links a")).toHaveText(expectedCard.links);
  }
});
