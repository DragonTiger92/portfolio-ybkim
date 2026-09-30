import { expect, test, type Page } from "./helpers/browser";

interface PendingCopy {
  resolve: () => void;
  reject: () => void;
}

type ClipboardWindow = typeof window & { pendingCopies: PendingCopy[] };
type ClipboardMode = "absent" | "rejected" | "deferred";

const copyActions = [
  {
    name: "email",
    route: "/",
    button: "[data-copy-email]",
    status: "[data-copy-email-status]",
    success: "이메일 주소를 복사했습니다.",
    failure: "자동 복사를 사용할 수 없습니다. 표시된 이메일 주소를 직접 복사해 주세요.",
  },
  {
    name: "demo request",
    route: "/projects/karly/",
    button: "[data-demo-access-copy]",
    status: "[data-demo-access-status]",
    success: "메일 양식을 복사했습니다.",
    failure: "복사하지 못했습니다. 선택된 양식을 직접 복사해 주세요.",
  },
];

async function configureClipboard(page: Page, mode: ClipboardMode): Promise<void> {
  await page.addInitScript((clipboardMode: ClipboardMode) => {
    const pendingCopies: PendingCopy[] = [];
    (window as ClipboardWindow).pendingCopies = pendingCopies;
    const clipboard = {
      writeText: () => {
        if (clipboardMode === "rejected") {
          return Promise.reject(new Error("Clipboard permission denied"));
        }
        return new Promise<void>((resolve, reject) => {
          pendingCopies.push({ resolve, reject: () => reject(new Error("Copy failed")) });
        });
      },
    };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboardMode === "absent" ? undefined : clipboard,
    });
  }, mode);
}

async function openCopyAction(page: Page, route: string): Promise<void> {
  await page.goto(route);
  if (route === "/") {
    return;
  }
  await page.locator("[data-demo-access-trigger]").click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function settleCopy(page: Page, index: number, succeeds: boolean): Promise<void> {
  await page.evaluate(
    ({ requestIndex, success }) => {
      const copy = (window as ClipboardWindow).pendingCopies[requestIndex];
      if (copy === undefined) {
        throw new Error("Expected a pending clipboard request");
      }
      const settle = success ? copy.resolve : copy.reject;
      settle();
    },
    { requestIndex: index, success: succeeds },
  );
}

async function expectManualFallback(
  page: Page,
  action: (typeof copyActions)[number],
): Promise<void> {
  await expect(page.locator(action.status)).toHaveText(action.failure);
  if (action.name === "email") {
    await expect(page.locator("#public-email-address")).toHaveText("dczwtu12b+portfolio@gmail.com");
    return;
  }
  const template = page.locator("#demo-request-template");
  await expect(template).toBeFocused();
  const selection = await template.evaluate((element: HTMLTextAreaElement) => [
    element.selectionStart,
    element.selectionEnd,
  ]);
  expect(selection).toEqual([0, (await template.inputValue()).length]);
}

const failureCases = copyActions.flatMap((action) =>
  (["absent", "rejected"] as const).map((mode) => ({ action, mode })),
);
const raceCases = copyActions.flatMap((action) =>
  [true, false].map((latestSucceeds) => ({ action, latestSucceeds })),
);

for (const { action, mode } of failureCases) {
  test(`${action.name} provides a manual fallback when clipboard is ${mode}`, async ({ page }) => {
    await configureClipboard(page, mode);
    await openCopyAction(page, action.route);
    await page.locator(action.button).click();
    await expectManualFallback(page, action);
  });
}

for (const { action, latestSucceeds } of raceCases) {
  test(`${action.name} preserves the latest ${latestSucceeds ? "successful" : "failed"} copy when promises settle out of order`, async ({
    page,
  }) => {
    await configureClipboard(page, "deferred");
    await openCopyAction(page, action.route);
    await page.locator(action.button).click();
    await page.locator(action.button).click();
    await expect
      .poll(() => page.evaluate(() => (window as ClipboardWindow).pendingCopies.length))
      .toBe(2);

    await settleCopy(page, 1, latestSucceeds);
    const expectedFeedback = latestSucceeds ? action.success : action.failure;
    await expect(page.locator(action.status)).toHaveText(expectedFeedback);
    await settleCopy(page, 0, !latestSucceeds);
    await expect(page.locator(action.status)).toHaveText(expectedFeedback);
  });
}
