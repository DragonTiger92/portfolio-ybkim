import { expect, test } from "@playwright/test";

test("gives every public project a decorative first-party identity panel", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator("#projects .project-card");

  await expect(cards).toHaveCount(3);

  for (const card of await cards.all()) {
    await expect(card.locator(".project-card__identity")).toHaveAttribute("aria-hidden", "true");
    await expect(card.locator(".project-card__mark")).not.toBeEmpty();
    await expect(card.locator(".project-card__wordmark")).not.toBeEmpty();
  }

  await expect(cards.locator(".project-card__identity img")).toHaveCount(0);
});
