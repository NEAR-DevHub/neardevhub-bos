import {
  clickWhenSelectorIsVisible,
  setInputAndAssert,
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
    await page.goto("/devhub.near/widget/app?page=communities");

    await page.getByRole("button", { name: " Community" }).click();

    await page.getByTestId("1-name--editable").fill("the new community name");
  });

  test("should validate input when user is creating a new community", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=communities");

    await page.getByRole("button", { name: " Community" }).click();

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
  test("should create a new community", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=communities");

    await page.getByRole("button", { name: " Community" }).click();

    await page.getByTestId("1-name--editable").fill("My new community");
    await page
      .getByTestId("3-description--editable")
      .fill("A very nice community to be in");
    await page.getByTestId("0-handle--editable").fill("mynewcommunity");
    await page.getByTestId("2-tag--editable").fill("mynewcommunity");
    await page.getByText("Launch").click();
    const transactionText = JSON.stringify(
      JSON.parse(await page.locator("div.modal-body code").innerText()),
      null,
      1
    );
    await expect(transactionText).toEqual(
      JSON.stringify(
        {
          inputs: {
            handle: "mynewcommunity",
            name: "My new community",
            tag: "mynewcommunity",
            description: "A very nice community to be in",
            bio_markdown:
              "This is a sample text about your community.\nYou can change it on the community configuration page.",
            logo_url:
              "https://ipfs.near.social/ipfs/bafkreibysr2mkwhb4j36h2t7mqwhynqdy4vzjfygfkfg65kuspd2bawauu",
            banner_url:
              "https://ipfs.near.social/ipfs/bafkreic4xgorjt6ha5z4s5e3hscjqrowe5ahd7hlfc5p4hb6kdfp6prgy4",
          },
        },
        null,
        1
      )
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
    await page.goto("/devhub.near/widget/app?page=communities");

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
