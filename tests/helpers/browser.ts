import { expect, test as base } from "@playwright/test";

export { expect };
export type { Locator, Page } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
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
