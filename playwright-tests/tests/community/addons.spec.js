const { test, expect } = require("@playwright/test");
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";

test.beforeEach(async ({ page }) => {
  await page.route("https://near.lava.build/", async (route) => {
    await mockDefaultTabs(route);
  });
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  const baseUrl =
    "/devhub.near/widget/app?page=community.configuration&handle=webassemblymusic";

  test("should not find any buttons with the name ' Edit'", async ({
    page,
  }) => {
    await page.goto(baseUrl);

    // Try to find a button with the name ' Edit'
    const editButtons = await page.locator('button:has-text(" Edit")');
    await pauseIfVideoRecording(page);
    // Check that no such button exists
    expect(await editButtons.count()).toBe(0);
  });

  test("should load teams addon", async ({ page }) => {
    await page.route("https://near.lava.build/", async (route) => {
      await mockDefaultTabs(route);
    });

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=teams"
    );

    const teamsAddonSelector = 'span:has-text("Teams")';

    await page.waitForSelector(teamsAddonSelector, {
      state: "visible",
    });

    // Admins card is visible
    await page.getByText("Community Admins").click();
    // First admin row
    await page.getByText("Admin #1").click();
    // First admin
    await page.locator(".col-9").first().click();
  });
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test.describe("AddonsConfigurator", () => {
    const baseUrl =
      "/devhub.near/widget/app?page=community.configuration&handle=webassemblymusic";
    // const dropdownSelector =
    //   'input[data-component="near/widget/DIG.InputSelect"]';
    // const addButtonSelector = "button.btn-success:has(i.bi.bi-plus)";
    // const toggleButtonSelector = 'button[role="switch"]';
    // const moveUpButtonSelector = "button.btn-secondary:has(i.bi.bi-arrow-up)";
    // const removeButtonSelector =
    //   "button.btn-outline-danger:has(i.bi.bi-trash-fill)";

    test("Addons configuration section comes up on load", async ({ page }) => {
      await page.goto(baseUrl);

      const addonsConfiguratorSelector = 'span:has-text("Add-Ons")';

      await page.waitForSelector(addonsConfiguratorSelector, {
        state: "visible",
      });
    });

    test("Can add an addon to the list", async ({ page }) => {
      await page.goto(baseUrl);

      const editAddonButton = await page
        .getByRole("button", { name: " Edit" })
        .nth(3);
      await editAddonButton.scrollIntoViewIfNeeded();
      await editAddonButton.click();

      await pauseIfVideoRecording(page);

      const tbody = await page.getByTestId("addon-table");
      const trs = await tbody.locator("tr");
      const numberOfAddons = await trs.count();

      await page.getByRole("combobox").selectOption("blog");

      // Click on the plus
      await page.getByRole("button", { name: "" }).click();

      const trs2 = await tbody.locator("tr");

      expect(await trs2.count()).toBe(numberOfAddons + 1);
    });

    test("Can reorder addons in the list", async ({ page }) => {
      await page.goto(baseUrl);
      const editAddonButton = await page
        .getByRole("button", { name: " Edit" })
        .nth(3);
      await editAddonButton.scrollIntoViewIfNeeded();
      await editAddonButton.click();

      // Check if there is an addon
      const tbody = await page.getByTestId("addon-table");

      await page.getByRole("combobox").selectOption("blog");
      await page.getByRole("button", { name: "" }).click();
      await page.getByRole("combobox").selectOption("telegram");
      await page.getByRole("button", { name: "" }).click();

      // Get the initial order of addons
      const initialOrder = await tbody
        .locator("tr")
        .evaluateAll((trs) => trs.map((tr) => tr.innerText));

      await page
        .getByRole("cell", { name: "", exact: true })
        .getByRole("button")
        .click();

      // Get the order of addons after reordering
      const newOrder = await tbody
        .locator("tr")
        .evaluateAll((trs) => trs.map((tr) => tr.innerText));
      // Check that the order of addons has changed
      expect(newOrder).not.toEqual(initialOrder);

      await page
        .getByRole("cell", { name: "", exact: true })
        .getByRole("button")
        .click();
      const sameOrderAsInitial = await tbody
        .locator("tr")
        .evaluateAll((trs) => trs.map((tr) => tr.innerText));

      expect(sameOrderAsInitial).toEqual(initialOrder);
    });

    test("Can remove an addon from the list", async ({ page }) => {
      await page.goto(baseUrl);

      const editAddonButton = await page
        .getByRole("button", { name: " Edit" })
        .nth(3);
      await editAddonButton.scrollIntoViewIfNeeded();
      await editAddonButton.click();

      // Add the blog
      await page.getByRole("combobox").selectOption("blog");
      await page.getByRole("button", { name: "" }).click();

      const tbody = await page.getByTestId("addon-table");
      const trs = await tbody.locator("tr");
      const numberOfAddons = await trs.count();

      // Remove a blog
      await page.locator("tr > td:nth-child(5) > div > .btn").first().click();

      const numberOfAddons2 = await trs.count();

      expect(numberOfAddons2).toBe(numberOfAddons - 1);
    });

    test("Can enable/disable an addon from the list", async ({ page }) => {
      await page.goto(baseUrl);

      const editAddonButton = await page
        .getByRole("button", { name: " Edit" })
        .nth(3);
      await editAddonButton.scrollIntoViewIfNeeded();
      await editAddonButton.click();

      // Add the blog addon in case there is 0
      await page.getByRole("combobox").selectOption("blog");
      await page.getByRole("button", { name: "" }).click();

      const tbody = await page.getByTestId("addon-table");

      // Toggle the first addon
      const toggle = await tbody
        .getByRole("row")
        .first()
        .getByRole("cell")
        .nth(3)
        .locator("#toggle-");
      const textbox = await tbody
        .getByRole("row")
        .first()
        .getByRole("cell")
        .nth(2)
        .getByRole("textbox");

      expect(textbox).toBeEnabled();
      await toggle.click();

      expect(textbox).toBeDisabled();
    });
  });
});
