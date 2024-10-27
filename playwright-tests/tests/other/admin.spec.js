import { test, expect } from "@playwright/test";
import { mockMainnetRpcRequest } from "../../util/rpcmock";

const adminPageRoute = "/devhub.near/widget/app?page=admin";
const adminButtonSelector = `button[data-testid="preview-homepage"]`;

async function navigateToAdminPage(page) {
  await page.goto(adminPageRoute);
  await page.waitForSelector(adminButtonSelector, { state: "visible" });
}

async function fillCommunityHandle(page, handle) {
  const communityHandleInputSelector = "input[placeholder='Community handle']";
  await page.locator(communityHandleInputSelector).nth(4).click();
  await page.locator(communityHandleInputSelector).nth(4).fill(handle);
}

async function mockNearBalance(page, balanceLeft) {
  const storageUsage = (55 - balanceLeft) * 100000; // 0.00001 NEAR per byte
  await mockMainnetRpcRequest({
    page,
    filterParams: {
      request_type: "view_account",
    },
    mockedResult: {
      amount: "55000000000000000000000000", // balance on account 55 NEAR
      block_hash: "2KiPPwUK6MakeWt9cRgHdVKfsJcHX8HkhL9tGYCwHDDA",
      block_height: 131251870,
      code_hash: "AUHmE71SPjnq8S3EW7m8ompfVBJxwCt4YfVvFLHtvVnr",
      locked: "0",
      storage_paid_at: 0,
      storage_usage: storageUsage,
    },
  });
}

test.describe("Wallet is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("should be able to manage featured communities from home page settings tab", async ({
    page,
  }) => {
    test.setTimeout(60000);

    await page.goto(adminPageRoute);

    await fillCommunityHandle(page, "thomasguntenaar");

    await page.getByTestId("add-to-list").click();
    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByText("Close").click();
    await page.getByRole("button", { name: "" }).nth(3).click();
    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByText("Can't set fewer than 4 communities").click();
    await page.getByLabel("Close").click();

    await page.getByRole("button", { name: "Cancel" }).click();

    await page.getByTestId("preview-homepage").click();
    await page.getByRole("heading", { name: "/connect" }).click();
    await page.getByTestId("preview-homepage").click();
  });

  test("should be able to manage moderators", async ({ page }) => {
    await navigateToAdminPage(page);
    await page.getByRole("tab", { name: "Moderators" }).click();
    await page.getByTestId("edit-members").click();
    const inputElement = page.locator(
      ".flex-grow-1 > div > div > div > .input-group > .form-control"
    );
    expect(inputElement).toBeVisible();
    await inputElement.click();
    await inputElement.fill("test.near");
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.getByLabel("Close").click();
    await page.getByTestId("edit-members").click();
  });

  test("should be able to manage restricted labels", async ({ page }) => {
    await navigateToAdminPage(page);
    await page.getByRole("tab", { name: "Restricted labels" }).click();
    await page.getByTestId("create-team").click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByTestId("create-team").click();
    await page
      .getByLabel("This team is allowed to edit-post with this / these labels")
      .check();
    await page
      .getByLabel("Only this team and moderators are allowed to use this label")
      .check();
    await page.getByPlaceholder("Team name").click();
    await page.getByPlaceholder("Team name").fill("tom");
    await page.getByPlaceholder("Team name").press("Tab");
    await page.getByLabel("Select type").press("Tab");
    await page.getByPlaceholder("label").fill("thom");
    await page.getByPlaceholder("label").press("Tab");
    await page
      .getByLabel("This team is allowed to edit-post with this / these labels")
      .press("Tab");
    await page
      .getByLabel("Only this team and moderators are allowed to use this label")
      .press("Tab");
    await page.getByPlaceholder("member").fill("tom.near");
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByLabel("Close").click();
    await page
      .getByRole("row", {
        name: "mnw Multiple labels with common prefix No members in this group  Edit",
      })
      .getByRole("button")
      .click();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  Cancel  Submit",
      })
      .getByPlaceholder("member")
      .click();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  Cancel  Submit",
      })
      .getByPlaceholder("member")
      .fill("thomas.near");
    await page.getByRole("table").getByRole("button", { name: "" }).click();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByLabel("This team is allowed to edit-post with this / these labels")
      .uncheck();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByLabel("This team is allowed to edit-post with this / these labels")
      .uncheck();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByLabel("Only this team and moderators are allowed to use this label")
      .uncheck();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByPlaceholder("label")
      .click();
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByPlaceholder("Team name")
      .click({
        clickCount: 3,
      });
    await page
      .getByRole("rowheader", {
        name: "Create label Group name Team name Would you like this group to limit their restrictions to a single label, or would you prefer them to restrict it with any label that follows a similar convention? Select type What would you like the restricted label to be? starts-with: label Select label permissions This team is allowed to edit-post with this / these labels Only this team and moderators are allowed to use this label member member  member member  Cancel  Submit",
      })
      .getByPlaceholder("Team name")
      .fill("new-group-name");
    await page
      .getByRole("table")
      .getByRole("button", { name: " Submit" })
      .click();
    await page.getByLabel("Close").click();
  });

  test("shouldn't be able to add a non-existing community handle without a warning", async ({
    page,
  }) => {
    await navigateToAdminPage(page);
    await fillCommunityHandle(page, "arandomnonsensehandlethatwouldnotexist");
    await page.getByTestId("add-to-list").click();
    await page.getByTestId("add-to-list").click();
    await page
      .getByText(
        "This community handle does not exist, make sure you use an existing handle."
      )
      .click();
  });

  test("should be able to see contract balance if the balance is lower than 2 NEAR", async ({
    page,
  }) => {
    await navigateToAdminPage(page);
    await mockNearBalance(page, 5);

    const contractBalanceWrapper = await page.getByTestId(
      "contract-balance-wrapper"
    );
    expect(contractBalanceWrapper).toBeDefined();
    await page.waitForTimeout(1000);
    const balance = await page.getByTestId("contract-balance");
    expect(await balance.isVisible()).toBe(false);

    // Under 2 NEAR
    await mockNearBalance(page, 1.9);
    await navigateToAdminPage(page);

    expect(contractBalanceWrapper).toBeDefined();
    await page.waitForTimeout(1000);
    expect(await balance.isVisible()).toBe(true);
  });
});

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });
  test("should show banner that the user doesn't have access", async ({
    page,
  }) => {
    await page.goto(adminPageRoute);
    const buttonSelector = "h2.alert.alert-danger";
    const banner = await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
    const bannerText = await banner.textContent();
    expect(bannerText.trim()).toBe(
      "Your account does not have administration permissions."
    );
  });
});
