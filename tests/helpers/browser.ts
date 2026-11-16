import { expect, test as base } from "@playwright/test";
import { reusePinnedFont } from "./font-cache";

export { expect };
export type { Locator, Page } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/**",
      reusePinnedFont,
    );
    const runtimeErrors: string[] = [];
    const recordError = (error: Error): void => {
      runtimeErrors.push(error.message);
    };

    page.on("pageerror", recordError);
    await use(page);
    page.off("pageerror", recordError);
    expect(runtimeErrors, "The user flow must not raise uncaught browser errors").toEqual([]);
  },
});
