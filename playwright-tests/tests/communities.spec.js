import {
  setInputAndAssert,
  clickWhenSelectorIsVisible,
  waitForSelectorToBeVisible,
} from "../testUtils";

const { test, expect } = require("@playwright/test");

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should show spawner when user clicks create community", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/dh.communities");

    const createCommunityButtonSelector = 'button:has-text("Create Community")';

    await page.waitForSelector(createCommunityButtonSelector, {
      state: "visible",
    });
    await page.click(createCommunityButtonSelector);

    const communitySpawnerSelector = 'div:has-text("Description")';
    await page.waitForSelector(communitySpawnerSelector, { state: "visible" });
  });

  test("should validate input when user is creating a new community", async ({
    page,
  }) => {
    await page.goto("/devgovgigs.near/widget/app?page=communities");

    await clickWhenSelectorIsVisible(
      page,
      'button:has-text("Create Community")'
    );

    await waitForSelectorToBeVisible(
      page,
      'div:has-text("Community information")'
    );

    // missing title
    await expectInputValidation(
      page,
      "",
      "The description",
      "the-url-handle",
      "the-tag",
      false
    );

    // missing description
    await expectInputValidation(
      page,
      "The title",
      "",
      "the-url-handle",
      "the-tag",
      false
    );

    // missing URL handle
    await expectInputValidation(
      page,
      "The title",
      "The description",
      "",
      "the-tag",
      false
    );

    // missing tag
    await expectInputValidation(
      page,
      "The title",
      "The description",
      "the-url-handle",
      "",
      false
    );

    // valid input
    await expectInputValidation(
      page,
      "The title",
      "The description",
      "the-url-handle",
      "the-tag",
      true
    );
  });
});

const expectInputValidation = async (
  page,
  title,
  description,
  urlHandle,
  tag,
  valid
) => {
  await setInputAndAssert(page, 'input[aria-label="Name"]', title);
  await setInputAndAssert(page, 'input[aria-label="Description"]', description);
  await setInputAndAssert(page, 'input[aria-label="URL handle"]', urlHandle);
  await setInputAndAssert(page, 'input[aria-label="Tag"]', tag);

  expect(await page.isEnabled('button:has-text("Launch")')).toBe(valid);
};

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("spawner and button should not be visible", async ({ page }) => {
    await page.goto("/devhub.near/widget/dh.communities");

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
