const { test, expect } = require("@playwright/test");

const { setCookieConsentAccepted } = require("../testUtils.js");

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should show spawner when user clicks create community", async ({
    page,
  }) => {
    await page.goto("/devgovgigs.near/widget/app?page=communities");

    await setCookieConsentAccepted(page);

    const createCommunityButtonSelector = 'button:has-text("Create Community")';

    await page.waitForSelector(createCommunityButtonSelector, {
      state: "visible",
    });
    await page.click(createCommunityButtonSelector);

    const communitySpawnerSelector = 'div:has-text("Community information")';
    await page.waitForSelector(communitySpawnerSelector, { state: "visible" });
  });
});

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("spawner and button should not be visible", async ({ page }) => {
    await page.goto("/devgovgigs.near/widget/app?page=communities");

    const createCommunityButtonSelector = 'button:has-text("Create Community")';

    await page.waitForSelector(createCommunityButtonSelector, {
      state: "detached",
    });

    const communitySpawnerSelector = 'div:has-text("Community information")';
    const isCommunitySpawnerVisible = await page.isVisible(
      communitySpawnerSelector
    );

    expect(isCommunitySpawnerVisible).toBeFalsy();
  });
});
