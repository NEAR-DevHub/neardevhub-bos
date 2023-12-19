import { expect, test } from "@playwright/test";
import { selectAndAssert, setInputAndAssert } from "../testUtils";

test.describe("Wallet is not connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should not be able to create if not logged in", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const createPostButton = 'button[data-testid="submit-create-post"]';

    await page.waitForSelector(createPostButton, {
      state: "detached",
    });

    const isCreatePostButtonVisible = await page.isVisible(createPostButton);

    expect(isCreatePostButtonVisible).toBeFalsy();
  });
});

test.describe("Wallet is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should be able to submit a solution with USDC as currency", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    await page.click('button:has-text("Solution")');

    await setInputAndAssert(
      page,
      'p:has-text("Title") + input',
      "The test title"
    );

    await page.click('label:has-text("Yes") button');
    await selectAndAssert(page, 'div:has-text("Currency") select', "USDT");
    await setInputAndAssert(
      page,
      'div:has-text("Requested amount") input',
      "300"
    );
  });

  test("should init create post with labels from params", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create&labels=devhub-test");

    const selector = 'div:has-text("Labels") input';

    const singleValue = await page.inputValue(selector);
    expect(singleValue).toBe("devhub-test");

    await page.goto("/devhub.near/widget/app?page=create&labels=devhub-test");

    const multiValue = await page.inputValue(selector);
    expect(multiValue).toBe("devhub-test");
  });

  test("should allow user to select multiple labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = 'div:has-text("Labels") input';

    await page.fill(selector, "devhub-test, security");
    const actualValue = await page.inputValue(selector);
    expect(actualValue).toBe(["devhub-test", "security"]);
  });

  test("should not allow user to use the blog label", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = 'div:has-text("Labels") input';

    await page.fill(selector, "blog");
    const actualValue = await page.inputValue(selector);
    expect(actualValue).toBe("");
  });

  test("should allow the user to create new labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    await page.goto("/devhub.near/widget/app?page=create");

    const selector = 'div:has-text("Labels") input';

    await page.fill(selector, "random-crazy-label-lol");
    const actualValue = await page.inputValue(selector);
    expect(actualValue).toBe("random-crazy-label-lol");
  });
});
