import { expect, test } from "@playwright/test";

const email = "dczwtu12b+portfolio@gmail.com";
const githubProfileUrl = "https://github.com/DragonTiger92";
const portfolioRepositoryUrl = `${githubProfileUrl}/portfolio-ybkim`;

test("provides correctly scoped profile, repository, and contact actions", async ({ page }) => {
  await page.addInitScript(() => {
    let copiedEmail = "";

    Object.defineProperty(window, "__copiedEmail", {
      configurable: true,
      get: () => copiedEmail,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedEmail = value;
        },
      },
    });
  });
  await page.goto("/");

  const gmailAction = page.getByRole("link", { name: "Gmail에서 메일 쓰기(새 창)" });
  const profileActions = page.getByRole("link", { name: "GitHub 프로필 보기(새 창)" });

  await expect(gmailAction).toHaveAttribute(
    "href",
    "https://mail.google.com/mail/?view=cm&fs=1&to=dczwtu12b%2Bportfolio%40gmail.com",
  );
  await expect(gmailAction).toHaveAttribute("target", "_blank");
  await expect(gmailAction).toHaveAttribute("rel", "noopener noreferrer");
  await expect(profileActions).toHaveCount(2);
  await expect(
    page.locator(".contact-actions a[href='https://github.com/DragonTiger92']"),
  ).toContainText("GitHub 프로필");
  await expect(
    page.locator(".site-footer a[href='https://github.com/DragonTiger92']"),
  ).toContainText("GitHub 프로필");
  for (const profileAction of await profileActions.all()) {
    await expect(profileAction).toHaveAttribute("href", githubProfileUrl);
    await expect(profileAction).toHaveAttribute("target", "_blank");
    await expect(profileAction).toHaveAttribute("rel", "noopener noreferrer");
    await expect(profileAction.locator(".new-window-link__icon")).toHaveText("↗");
  }

  await expect(page.locator("#public-email-address")).toHaveText(email);
  await page.getByRole("button", { name: "주소 복사" }).click();
  expect(
    await page.evaluate(() => (window as typeof window & { __copiedEmail: string }).__copiedEmail),
  ).toBe(email);
  await expect(page.getByRole("status")).toHaveText("이메일 주소를 복사했습니다.");

  const copyStatus = page.getByRole("status");

  await expect(copyStatus).toHaveCount(1);
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "주소 복사" }).click();
  await page.waitForTimeout(2100);
  await expect(copyStatus).toHaveText("이메일 주소를 복사했습니다.");
  await expect(copyStatus).toBeEmpty({ timeout: 2000 });

  const resumeDownload = page.getByRole("link", { name: "이력서 PDF 다운로드" });

  await expect(resumeDownload).toHaveAttribute("download", "");
  await expect(resumeDownload.locator(".button-link__download-label")).toHaveText(
    "이력서 PDF 다운로드",
  );
  await expect(resumeDownload.locator("svg.button-link__download-icon")).toHaveCount(1);
  await expect(resumeDownload.locator("svg")).toHaveAttribute("aria-hidden", "true");

  const contactRowGap = await page
    .locator(".contact-actions")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).rowGap));

  expect(contactRowGap).toBeGreaterThanOrEqual(16);

  await expect(
    page.locator("#projects .project-card").first().getByRole("link", { name: "GitHub 저장소" }),
  ).toHaveAttribute("href", portfolioRepositoryUrl);
  await expect(page.locator("#repository")).toHaveCount(0);
});

test("keeps the public email usable when automatic copy is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => Promise.reject(new Error("Clipboard unavailable")),
      },
    });
  });
  await page.goto("/");

  await page.getByRole("button", { name: "주소 복사" }).click();

  await expect(page.locator("#public-email-address")).toHaveText(email);
  await expect(page.getByRole("status")).toHaveText(
    "자동 복사를 사용할 수 없습니다. 표시된 이메일 주소를 직접 복사해 주세요.",
  );
});
