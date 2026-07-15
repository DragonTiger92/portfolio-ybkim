import { expect, test } from "@playwright/test";

const pretendardStylesheet =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

test("loads the pinned Pretendard stylesheet through shared font tokens", async ({ page }) => {
  await page.goto("/");

  const stylesheet = page.locator(`link[rel="stylesheet"][href="${pretendardStylesheet}"]`);

  await expect(stylesheet).toHaveCount(1);
  await expect(stylesheet).toHaveAttribute("crossorigin", "anonymous");

  const bodyFontFamily = await page
    .locator("body")
    .evaluate((body) => getComputedStyle(body).fontFamily);
  const headingFontFamily = await page
    .locator("h1")
    .evaluate((heading) => getComputedStyle(heading).fontFamily);

  expect(bodyFontFamily).toContain("Pretendard Variable");
  expect(headingFontFamily).toContain("Pretendard Variable");
});
