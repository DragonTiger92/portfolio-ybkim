import { expect, test, type Locator } from "@playwright/test";

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

async function expectExternalProjectLinks(card: Locator, expectedLabels: string[]) {
  const externalLinks = await card.locator(".project-card__links .new-window-link").all();

  for (const [linkIndex, externalLink] of externalLinks.entries()) {
    await expect(externalLink.locator(".new-window-link__label")).toHaveText(
      expectedLabels[linkIndex],
    );
    await expect(externalLink).toHaveAttribute("target", "_blank");
    await expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  }
}

test("uses reviewable project content instead of decorative identity panels", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator("#projects .project-card");

  await expect(cards).toHaveCount(projectCards.length);
  await expect(cards.locator(".project-card__identity")).toHaveCount(0);

  for (const [index, expectedCard] of projectCards.entries()) {
    const card = cards.nth(index);

    await expect(card.locator("h4 a")).toHaveText(expectedCard.title);
    await expect(card.locator(".project-card__summary")).not.toBeEmpty();
    await expect(card.locator(".project-card__role dt")).toHaveText("역할");
    await expect(card.locator(".project-card__role dd")).toHaveText(expectedCard.role);
    await expect(card.locator(".tag-list li").first()).toHaveText(expectedCard.classification);
    expect(await card.locator(".tag-list li").count()).toBeGreaterThan(0);
    await expect(card.locator(".project-card__links > a").first()).toHaveText(
      expectedCard.links[0],
    );

    await expectExternalProjectLinks(card, expectedCard.links.slice(1));
  }
});
