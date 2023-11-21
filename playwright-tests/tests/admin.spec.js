import { test, expect } from "@playwright/test";

test.describe("Wallet is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("should show be able to fill in the form to create a new team", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");

    const buttonSelector = `button[data-testid="create-team"]`;
    // Wait for the first post history button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });

    // Click on the first post history button
    await page.click(buttonSelector);
    await page.locator(".flex-grow-1").first().click();
    await page.getByPlaceholder("Team name").click();
    await page.getByPlaceholder("Team name").fill("new team");
    await page.getByPlaceholder("Team name").press("Tab");
    await page
      .frameLocator("iframe")
      .getByRole("textbox")
      .fill("new team description");
    await page.getByLabel("Select type").selectOption("starts-with:");
    await page.locator("#editPostCheckbox").check();
    await page.locator("#editPostCheckbox").uncheck();
    await page.locator("#useLabelsCheckbox").check();
    await page.locator("#useLabelsCheckbox").uncheck();
    await page.getByPlaceholder("label").click();
    await page.getByPlaceholder("label").fill("restrictivelabel");
    await page.getByPlaceholder("member").click();
    await page.getByPlaceholder("member").fill("thomasguntenaar.near");
    const addMemberButton = await page.waitForSelector(
      "button.btn.btn-success.add-member"
    );
    await addMemberButton.click();
    await page.getByPlaceholder("member").nth(1).click();
    await page.getByPlaceholder("member").nth(1).fill("theori.near");
    addMemberButton.click();

    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("should hide team configurator when hit cancel", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="create-team"]`;
    // Wait for the first post history button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });

    await page.getByRole("button", { name: " Edit team" }).first().click();
    await page.locator("div:nth-child(10) > .btn").click();
    await page.locator("div:nth-child(9) > .btn").click();
    await page.getByRole("button", { name: "" }).nth(4).click();
    await page.getByRole("button", { name: "" }).nth(3).click();
    await page.getByRole("button", { name: "" }).nth(2).click();
    await page.getByRole("button", { name: "" }).nth(1).click();
    await page.getByRole("button", { name: "Cancel" }).click();
  });

  test("should be able to toggle the manage featured communities section", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="manage-featured"]`;
    // Wait for the first post history button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });

    // This part removes 2 of the featured communities and clicks cancel
    // They should appear again
    await page.getByTestId("manage-featured").click();
    await page.getByRole("button", { name: "Cancel" }).first().click();
    await page.getByTestId("manage-featured").click();
    await page.locator("div:nth-child(5) > .btn").click();
    await page.getByRole("button", { name: "" }).nth(2).click();
    await page.getByRole("button", { name: "Cancel" }).first().click();
    await page.getByTestId("manage-featured").click();
    await page.locator("div:nth-child(5) > .btn").click();
    await page.getByRole("button", { name: "Cancel" }).first().click();
  });

  test("shouldn't be able to add a none existing community handle without a warning", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="manage-featured"]`;
    // Wait for the first post history button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
    await page.getByTestId("manage-featured").click();
    await page.getByPlaceholder("zero-knowledge").click();
    await page
      .getByPlaceholder("zero-knowledge")
      .fill("arandomnonsensehandlethatwouldnotexist");
    await page.getByRole("button", { name: "" }).click();
    await page
      .getByText(
        "This community handle does not exist, make sure you use an existing handle."
      )
      .click();
  });
});

test.describe("Wallet is not connect", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });
  test("should show banner that the user doesn't have access", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = "h2.alert.alert-danger";
    // Wait for the first post history button to be visible

    const banner = await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
    const bannerText = await banner.textContent();
    expect(bannerText.trim()).toBe(
      "Your account does not have administration permissions."
    );
  });
});
