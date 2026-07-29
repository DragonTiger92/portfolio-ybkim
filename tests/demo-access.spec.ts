import { expect, test } from "@playwright/test";

const demoProjects = [
  { route: "/projects/karly/", title: "Karly" },
  { route: "/projects/book-kong/", title: "Book-Kong" },
];

function expectDemoRequestUrl(href: string | null, projectTitle: string): void {
  const requestUrl = new URL(href ?? "");

  expect(requestUrl.origin).toBe("https://mail.google.com");
  expect(requestUrl.searchParams.get("to")).toBe("dczwtu12b+portfolio@gmail.com");
  expect(requestUrl.searchParams.get("su")).toBe(`[Portfolio Demo Access] ${projectTitle}`);
  expect(requestUrl.searchParams.get("body")).toContain(`${projectTitle} 데모 검토`);
  expect(requestUrl.searchParams.get("body")).toContain("검토 종료 예정일");
  expect(requestUrl.searchParams.get("body")).toContain("별도 연락 채널");
}

for (const project of demoProjects) {
  test(`${project.title} provides a scoped demo access request`, async ({ page }) => {
    await page.goto(project.route);

    const section = page.locator(".demo-access");
    const requestLink = section.getByRole("link", { name: new RegExp(project.title) });

    await expect(section.getByRole("heading", { name: "데모 로그인" })).toBeVisible();
    await expect(section).toContainText("만료형 보안 링크");
    await expect(requestLink).toHaveAttribute("target", "_blank");
    await expect(requestLink).toHaveAttribute("rel", "noopener noreferrer");

    expectDemoRequestUrl(await requestLink.getAttribute("href"), project.title);
  });
}

test("keeps each landing request beside its deployment demo", async ({ page }) => {
  await page.goto("/");

  for (const project of demoProjects) {
    const card = page.locator(".project-card").filter({ hasText: project.title });
    const deploymentDemo = card.getByRole("link", { name: "배포 데모" });
    const requestLink = card.getByRole("link", {
      name: `${project.title} 테스트 계정 요청 메일 작성(Gmail 새 창)`,
    });

    await expect(deploymentDemo).toBeVisible();
    await expect(requestLink).toHaveAttribute("target", "_blank");
    await expect(requestLink).toHaveAttribute("rel", "noopener noreferrer");
    expectDemoRequestUrl(await requestLink.getAttribute("href"), project.title);
  }
});

test("keeps demo access requests off projects that do not need credentials", async ({ page }) => {
  await page.goto("/projects/portfolio-ybkim/");

  await expect(page.locator(".demo-access")).toHaveCount(0);

  await page.goto("/");
  const portfolioCard = page.locator(".project-card").filter({ hasText: "portfolio-ybkim" });
  await expect(portfolioCard.getByRole("link", { name: /테스트 계정 요청/ })).toHaveCount(0);
});
