import { expect, test } from "@playwright/test";

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is connected, but not KYC verified", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-not-kyc-verified-account.json",
  });
  test.skip("should write a first test", async ({ page }) => {});
});

test("Default page should be proposals", async ({ page }) => {
  await page.goto(`/events-committee.near/widget/app`);
  await expect(
    await page.locator("button", { hasText: "Submit Proposal" })
  ).toBeVisible();
});
