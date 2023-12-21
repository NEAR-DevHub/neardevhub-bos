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
      'input[data-testid="name-editor"]',
      "The test title"
    );

    await page.click('label:has-text("Yes") button');
    await selectAndAssert(page, 'div:has-text("Currency") select', "USDT");
    await setInputAndAssert(
      page,
      'input[data-testid="requested-amount-editor"]',
      "300"
    );
  });

  test("should init create post with single label from params", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=create&labels=devhub-test");

    const selector = ".rbt-input-multi";
    const typeAheadElement = await page.waitForSelector(selector);

    const tokenWithValue = await typeAheadElement.$(
      '.rbt-token:has-text("devhub-test")'
    );
    expect(tokenWithValue).toBeTruthy();
  });

  test("should init create post with multi label from params", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/app?page=create&labels=devhub-test,security"
    );

    const selector = ".rbt-input-multi";
    const typeAheadElement = await page.waitForSelector(selector);

    const devhubTestToken = await typeAheadElement.$(
      '.rbt-token:has-text("devhub-test")'
    );
    expect(devhubTestToken).toBeTruthy();
    const securityToken = await typeAheadElement.$(
      '.rbt-token:has-text("security")'
    );
    expect(securityToken).toBeTruthy();
  });

  test("should allow user to select multiple labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");
    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "devhub-test");

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the page
    }); // we do this because the input dropdown is not visible and cannot be clicked
    await page.getByLabel("devhub-test").click();

    await page.fill(selector, "security");
    await page.getByLabel("security").click();

    const typeAheadElement = await page.waitForSelector(".rbt-input-multi");
    const devhubToken = await typeAheadElement.$(
      `.rbt-token:has-text("devhub-test")`
    );
    expect(devhubToken).toBeTruthy();

    const securityToken = await typeAheadElement.$(
      `.rbt-token:has-text("security")`
    );
    expect(securityToken).toBeTruthy();
  });

  test("should not allow user to use the blog label", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "blog");
    const labelSelector = `:is(label:has-text("blog"))`;
    await page.waitForSelector(labelSelector, { state: "detached" });
  });

  test("should allow the user to create new labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "random-crazy-label-lol");
    const labelSelector = `:is(mark:has-text("random-crazy-label-lol"))`;
    const element = await page.waitForSelector(labelSelector);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the page
    });
    await element.click();

    const typeAheadElement = await page.waitForSelector(".rbt-input-multi");
    const newToken = await typeAheadElement.$(
      `.rbt-token:has-text("random-crazy-label-lol")`
    );
    expect(newToken).toBeTruthy();
  });
});
