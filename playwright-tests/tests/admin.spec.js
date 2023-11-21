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

    const createTeamButtonSelector = "button.post-control";
    // Wait for the first post history button to be visible
    await page.waitForSelector(createTeamButtonSelector, {
      state: "visible",
    });

    // Click on the first post history button
    await page.click(createTeamButtonSelector);
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
    await page
      .getByText(
        "NEAR BOS embeddable custom element /communities /activity feed /about ↓ Admin mo"
      )
      .press("Escape");
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("should hide posts editor when hit cancel", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const createTeamButtonSelector = "button.post-control";
    // Wait for the first post history button to be visible
    await page.waitForSelector(createTeamButtonSelector, {
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
});

test.describe("Wallet is not connect", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });
  test("should show banner that the user doesn't have access", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const createTeamButtonSelector = "h2.alert.alert-danger";
    // Wait for the first post history button to be visible

    const banner = await page.waitForSelector(createTeamButtonSelector, {
      state: "visible",
    });
    const bannerText = await banner.textContent();
    expect(bannerText.trim()).toBe(
      "Your account does not have administration permissions."
    );
  });
});
