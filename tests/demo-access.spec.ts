import { expect, test } from "@playwright/test";

const demoProjects = [
  { route: "/projects/karly/", title: "Karly" },
  { route: "/projects/book-kong/", title: "Book-Kong" },
];

function expectGmailRequestUrl(href: string | null, projectTitle: string): void {
  const requestUrl = new URL(href ?? "");

  expect(requestUrl.origin).toBe("https://mail.google.com");
  expect(requestUrl.searchParams.get("to")).toBe("dczwtu12b+portfolio@gmail.com");
  expect(requestUrl.searchParams.get("su")).toBe(`[Portfolio Demo Access] ${projectTitle}`);
  expect(requestUrl.searchParams.get("body")).toContain(`${projectTitle} 데모 계정`);
  expect(requestUrl.searchParams.get("body")).toContain("검토 종료일");
  expect(requestUrl.searchParams.get("body")).toContain("암호 수신 연락처");
}

for (const project of demoProjects) {
  test(`${project.title} provides a scoped demo access request`, async ({ page }) => {
    await page.goto(project.route);

    const section = page.locator(".demo-access");
    const gmailLink = section.getByRole("link", {
      name: `${project.title} 테스트 계정 요청 메일 작성(Gmail 새 창)`,
    });
    const dialog = section.getByRole("dialog", { name: "Gmail에서 테스트 계정 요청" });

    await expect(section.getByRole("heading", { name: "데모 로그인" })).toBeVisible();
    await expect(section).toContainText("만료형 보안 링크");
    await expect(gmailLink).toHaveAttribute("target", "_blank");
    await expect(gmailLink).toHaveAttribute("rel", "noopener noreferrer");
    expectGmailRequestUrl(await gmailLink.getAttribute("href"), project.title);
    await expect(section.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(dialog).not.toBeVisible();

    await gmailLink.click();

    const continueLink = dialog.getByRole("link", { name: "Gmail에서 계속(새 창)" });
    const template = dialog.locator("#demo-request-template");

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(
      "Gmail에 로그인하지 않았다면 Google 로그인 화면이 먼저 열리고",
    );
    await expect(template).toHaveValue(/받는 사람: dczwtu12b\+portfolio@gmail\.com/);
    await expect(template).toHaveValue(
      new RegExp(`제목: \\[Portfolio Demo Access\\] ${project.title}`),
    );
    await expect(continueLink).toHaveAttribute("target", "_blank");
    await expect(continueLink).toHaveAttribute("rel", "noopener noreferrer");
    expectGmailRequestUrl(await continueLink.getAttribute("href"), project.title);
  });
}

test("keeps each landing request beside its deployment demo", async ({ page }) => {
  await page.goto("/");

  for (const project of demoProjects) {
    const card = page.locator(".project-card").filter({ hasText: project.title });
    const deploymentDemo = card.getByRole("link", { name: "배포 데모" });
    const gmailLink = card.getByRole("link", {
      name: `${project.title} 테스트 계정 요청 메일 작성(Gmail 새 창)`,
    });

    await expect(deploymentDemo).toBeVisible();
    await expect(gmailLink).toHaveAttribute("target", "_blank");
    await expect(gmailLink).toHaveAttribute("rel", "noopener noreferrer");
    expectGmailRequestUrl(await gmailLink.getAttribute("href"), project.title);
    await expect(card.locator('a[href^="mailto:"]')).toHaveCount(0);
  }
});

test("copies the manual request template from the pre-navigation dialog", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText(value: string) {
          window.sessionStorage.setItem("copied-demo-request", value);
          return Promise.resolve();
        },
      },
    });
  });

  await page.goto("/projects/karly/");
  await page.getByRole("link", { name: "Karly 테스트 계정 요청 메일 작성(Gmail 새 창)" }).click();

  const dialog = page.getByRole("dialog", { name: "Gmail에서 테스트 계정 요청" });

  await dialog.getByRole("button", { name: "메일 양식 복사" }).click();
  await expect(dialog.getByRole("status")).toHaveText("메일 양식을 복사했습니다.");

  const copiedRequest = await page.evaluate(() =>
    window.sessionStorage.getItem("copied-demo-request"),
  );

  expect(copiedRequest).toContain("받는 사람: dczwtu12b+portfolio@gmail.com");
  expect(copiedRequest).toContain("제목: [Portfolio Demo Access] Karly");
  expect(copiedRequest).toContain("Karly 데모 계정을 요청드립니다.");
});

test("keeps demo access requests off projects that do not need credentials", async ({ page }) => {
  await page.goto("/projects/portfolio-ybkim/");

  await expect(page.locator(".demo-access")).toHaveCount(0);

  await page.goto("/");
  const portfolioCard = page.locator(".project-card").filter({ hasText: "portfolio-ybkim" });
  await expect(portfolioCard.getByRole("link", { name: /테스트 계정 요청/ })).toHaveCount(0);
});
