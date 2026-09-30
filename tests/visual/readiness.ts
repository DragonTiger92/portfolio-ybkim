import { expect, type Page } from "@playwright/test";

export async function prepareVisualPage(page: Page, route: string): Promise<void> {
  const failedAssets: string[] = [];
  page.on("requestfailed", (request) => {
    if (["font", "stylesheet", "image"].includes(request.resourceType())) {
      failedAssets.push(`${request.resourceType()}: ${request.url()}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedAssets.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  await page.goto(route);
  const theme = await page.evaluate(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await page.evaluate(async () => {
    const font = '16px "Pretendard Variable"';
    const text = document.body.innerText;
    const loadedFonts = await document.fonts.load(font, text);
    await document.fonts.ready;

    if (loadedFonts.length === 0 || !document.fonts.check(font, text)) {
      throw new Error("The approved CDN font did not load; refusing a fallback-font baseline.");
    }

    await Promise.all([...document.images].map((image) => image.decode()));
    window.scrollTo(0, 0);
  });
  expect(failedAssets, "All visual assets must load successfully").toEqual([]);
  await page.mouse.move(-1, -1);
}
