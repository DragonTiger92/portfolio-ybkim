import { expect, test } from "./helpers/browser";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of [
    "/",
    "/projects/portfolio-ybkim/",
    "/projects/karly/",
    "/projects/book-kong/",
  ]) {
    test(`${route} retains its main content and navigation`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).not.toBeEmpty();
      await expect(page.getByRole("navigation", { name: "주요 메뉴" })).toBeVisible();
      await expect(page.getByRole("link", { name: "김용범 포트폴리오 홈" })).toHaveAttribute(
        "href",
        "/",
      );
      await expect(page.locator("main a[href]").first()).toBeVisible();
    });
  }

  test(
    "retains contact, resume, project navigation, and direct demo request links",
    { tag: "@e2e" },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("link", { name: "Gmail에서 메일 쓰기(새 창)" })).toHaveAttribute(
        "href",
        /^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=/,
      );
      await expect(page.locator("#public-email-address")).toHaveText(
        "dczwtu12b+portfolio@gmail.com",
      );
      await expect(page.getByRole("link", { name: "이력서 PDF 다운로드" })).toHaveAttribute(
        "href",
        "/assets/resume/resume-ybkim.pdf",
      );

      await page.locator(".project-card h4 a").filter({ hasText: "Karly" }).click();
      await expect(page).toHaveURL(/\/projects\/karly\/$/);
      await expect(page.locator("h1")).toHaveText("Karly");
      await expect(page.locator("[data-demo-access-trigger]")).toHaveAttribute(
        "href",
        /^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=/,
      );
      await expect(page.locator("#demo-access-dialog")).not.toBeVisible();
      await page.locator(".project-navigation a[href='/#projects']").click();
      await expect(page).toHaveURL(/\/#projects$/);
      await expect(page.locator("#projects-title")).toBeInViewport();
    },
  );
});

test(
  "downloads the published resume with its expected filename and PDF signature",
  { tag: "@e2e" },
  async ({ page }) => {
    await page.goto("/");
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("link", { name: "이력서 PDF 다운로드" }).click();
    const download = await downloadEvent;

    expect(download.suggestedFilename()).toBe("resume-ybkim.pdf");
    expect(await download.failure()).toBeNull();
    const downloadedPdf = await download.createReadStream();
    expect(downloadedPdf).not.toBeNull();
    if (downloadedPdf === null) {
      throw new Error("The completed resume download must have a readable artifact");
    }
    const signature = await new Promise<string>((resolve, reject) => {
      downloadedPdf.once("readable", () => {
        resolve(new TextDecoder("ascii").decode(new Uint8Array(downloadedPdf.read(5))));
        downloadedPdf.destroy();
      });
      downloadedPdf.once("error", reject);
      downloadedPdf.once("end", () => resolve(""));
    });
    expect(signature).toBe("%PDF-");
  },
);
