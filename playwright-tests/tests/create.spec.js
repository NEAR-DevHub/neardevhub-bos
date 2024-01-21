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

  test("should be able to submit a solution (funding request) with USDC as currency", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    await page.click('button:has-text("Solution")');

    await page.getByTestId("name-editor").fill("The test title");

    const descriptionInput = page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionInput.focus();
    await descriptionInput.fill("Developer contributor report by somebody");

    const tagsInput = page.locator(".rbt-input-multi");
    await tagsInput.focus();
    await tagsInput.pressSequentially("paid-cont", { delay: 100 });
    await tagsInput.press("Tab");
    await tagsInput.pressSequentially("developer-da", { delay: 100 });
    await tagsInput.press("Tab");

    await page.click('label:has-text("Yes") button');
    await selectAndAssert(page, 'div:has-text("Currency") select', "USDT");
    await setInputAndAssert(
      page,
      'input[data-testid="requested-amount-editor"]',
      "300"
    );
    await page.getByTestId("requested-amount-editor").fill("300");
    await page.click('button:has-text("Submit")');
    await expect(page.locator("div.modal-body code")).toHaveText(
      JSON.stringify(
        {
          parent_id: null,
          labels: ["paid-contributor", "developer-dao"],
          body: {
            name: "The test title",
            description:
              "###### Requested amount: 300 USDT\n###### Requested sponsor: @neardevdao.near\nDeveloper contributor report by somebody",
            solution_version: "V1",
            post_type: "Solution",
          },
        },
        null,
        2
      )
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

  test("should not allow user to use a protected label", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "funding-requested");
    const labelSelector = `:is(label:has-text("funding-requested"))`;
    await page.waitForSelector(labelSelector, { state: "detached" });

    await page.waitForSelector(".alert", { state: "visible" });
  });

  test("should allow the user to create new labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "random-crazy-label-lol");
    const labelSelector = `:is(mark:has-text("random-crazy-label-lol"))`;
    const element = await page.waitForSelector(labelSelector);
    await element.click();

    const typeAheadElement = await page.waitForSelector(".rbt-input-multi");
    const newToken = await typeAheadElement.$(
      `.rbt-token:has-text("random-crazy-label-lol")`
    );
    expect(newToken).toBeTruthy();
  });
  test("should create idea post", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");
    await page.click('button:has-text("Idea")');
    await page.getByTestId("name-editor").fill("A test idea");

    await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea")
      .fill("My description of the idea");

    const labelsInput = await page.locator(".rbt-input-multi");
    await labelsInput.focus();
    await labelsInput.pressSequentially("ai", { delay: 100 });
    await labelsInput.press("Tab");
    await labelsInput.pressSequentially("webassemblymus", { delay: 100 });
    await labelsInput.press("Tab");

    await page.getByTestId("submit-create-post").click();
    await expect(page.locator("div.modal-body code")).toHaveText(
      JSON.stringify(
        {
          parent_id: null,
          labels: ["ai", "webassemblymusic"],
          body: {
            name: "A test idea",
            description: "My description of the idea",
            idea_version: "V1",
            post_type: "Idea",
          },
        },
        null,
        1
      )
    );
  });
});

test.describe("Admin is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("should allow admin to use a protected label", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=create");

    const selector = ".rbt-input-main";
    await page.waitForSelector(selector);
    await page.fill(selector, "funding-requested");
    await page.getByLabel("funding-requested").click();

    const typeAheadElement = await page.waitForSelector(".rbt-input-multi");
    const protectedToken = await typeAheadElement.$(
      `.rbt-token:has-text("funding-requested")`
    );
    expect(protectedToken).toBeTruthy();
  });
});
