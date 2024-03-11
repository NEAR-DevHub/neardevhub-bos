import { test, expect } from "@playwright/test";

test.describe("Wallet is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("should be able to manage featured communities from home page settings tab", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");

    const buttonSelector = `button[data-testid="preview-homepage"]`;
    // Wait for the preview homepage to appear
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });

    // Click on Community handle input
    await page.getByPlaceholder("Community handle").nth(4).click();
    await page
      .getByPlaceholder("Community handle")
      .nth(4)
      .fill("thomasguntenaar");
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
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="preview-homepage"]`;
    // Wait for the first post button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
    await page.getByRole("tab", { name: "Moderators" }).click();
    await page.getByTestId("edit-members").click();
    let inputSelector = `input[data-testid="membernew-list-item"]`;
    await page.waitForSelector(inputSelector, {
      state: "visible",
    });
    await page.locator(inputSelector).click();
    await page.locator(inputSelector).fill("test.near");
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.getByLabel("Close").click();
    await page.getByTestId("edit-members").click();
  });

  test("should be able to manage restricted labels", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="preview-homepage"]`;
    // Wait for the first post button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
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

  test("shouldn't be able to add a none existing community handle without a warning", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=admin");
    const buttonSelector = `button[data-testid="preview-homepage"]`;
    // Wait for the first post  button to be visible
    await page.waitForSelector(buttonSelector, {
      state: "visible",
    });
    await page.getByPlaceholder("Community handle").nth(4).click();
    await page
      .getByPlaceholder("Community handle")
      .nth(4)
      .fill("arandomnonsensehandlethatwouldnotexist");
    await page.getByTestId("add-to-list").click();
    await page.getByTestId("add-to-list").click();
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
