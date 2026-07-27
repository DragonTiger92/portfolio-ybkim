import { expect, test } from "@playwright/test";

const projectRoutes = [
  { reviewLinkCount: 5, route: "/projects/portfolio-ybkim/" },
  { reviewLinkCount: 2, route: "/projects/karly/" },
  { reviewLinkCount: 2, route: "/projects/book-kong/" },
];

for (const project of projectRoutes) {
  test(`${project.route} presents contextual and evidence navigation`, async ({ page }) => {
    await page.goto(project.route);

    await expect(page.locator(".breadcrumb a")).toHaveText(["홈", "프로젝트"]);
    await expect(page.locator(".breadcrumb [aria-current='page']")).not.toBeEmpty();

    const reviewLinks = await page.locator(".project-links a").all();

    expect(reviewLinks).toHaveLength(project.reviewLinkCount);

    for (const reviewLink of reviewLinks) {
      await expect(reviewLink.locator(".new-window-link__icon")).toHaveText("↗");
      await expect(reviewLink).toHaveAttribute("target", "_blank");
      await expect(reviewLink).toHaveAttribute("rel", "noopener noreferrer");
    }

    await expect(page.locator(".project-navigation a[href='/#projects']")).toContainText(
      "프로젝트 목록",
    );
    await expect(page.locator(".project-navigation__card")).toHaveCount(
      project.route === "/projects/karly/" ? 2 : 1,
    );
  });
}

test("keeps the reviewed project detail copy and support technologies", async ({ page }) => {
  await page.goto("/projects/portfolio-ybkim/");

  await expect(page.locator(".prose")).toContainText("직접 설계하고 구현하였습니다.");
  await expect(page.locator(".prose")).toContainText("개별 프로젝트 상세 페이지");

  await page.goto("/projects/karly/");
  await expect(page.locator(".prose")).not.toContainText("로그인, 회원가입, 장바구니");

  await page.goto("/projects/book-kong/");
  await expect(page.locator(".project-stack .tag-list li")).toHaveText([
    "React",
    "React Router",
    "TanStack Query",
    "TailwindCSS",
    "PocketBase",
    "Storybook",
  ]);
  await expect(page.locator(".prose")).toContainText(
    "일정을 조율하고 작업을 역할에 따라 분배하였습니다.",
  );
});
