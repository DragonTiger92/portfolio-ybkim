import { test, expect } from "../helpers/browser";
import type { Page, TestInfo } from "@playwright/test";
import { prepareVisualPage } from "./readiness";

test("landing", async ({ page }) => {
  await prepareVisualPage(page, "/");
  await expect(page.locator("#intro .job-status dd")).toHaveText("구직 중");
  await expect(page).toHaveScreenshot("landing.png", { fullPage: true });
});

test("karly", async ({ page }) => {
  await prepareVisualPage(page, "/projects/karly/");
  await expect(page).toHaveScreenshot("karly.png", { fullPage: true });
});

test("demo dialog", async ({ page }) => {
  await prepareVisualPage(page, "/projects/karly/");
  await page.getByRole("link", { name: "Karly 테스트 계정 요청 메일 작성(Gmail 새 창)" }).click();
  const dialog = page.getByRole("dialog", { name: "Gmail에서 테스트 계정 요청" });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(dialog).toHaveScreenshot("demo-dialog.png");
});

const runtime = (globalThis as { process?: { env?: { PORTFOLIO_VISUAL_PROBE?: string } } }).process;

async function proveScreenshotRegression(page: Page, testInfo: TestInfo): Promise<void> {
  await prepareVisualPage(page, "/");
  await page.addStyleTag({ content: "html body { background: #ff00ff !important; }" });
  const mismatch = await expect(page)
    .toHaveScreenshot("landing.png", { fullPage: true, timeout: 3000 })
    .then(
      () => "",
      (failure: unknown) => (failure instanceof Error ? failure.message : String(failure)),
    );

  expect(mismatch).toContain("pixels");
  expect(testInfo.attachments.some((attachment) => attachment.name.includes("diff"))).toBe(true);
}

if (runtime?.env?.PORTFOLIO_VISUAL_PROBE === "1") {
  test("detects intentional screenshot regression", async ({ page }, testInfo) => {
    await proveScreenshotRegression(page, testInfo);
  });
}
