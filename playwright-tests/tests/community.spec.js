import { test, expect } from "@playwright/test";

test("should load a community page if handle exists", async ({ page }) => {
  await page.goto(
    "/devhub.near/widget/app?page=community&handle=webassemblymusic"
  );

  // Using the <Link> that wraps the tabs to identify a community page loaded
  const communityTabSelector = `a[href^="/devhub.near/widget/app?page=community&handle=webassemblymusic&tab="]`;

  // Wait for the tab to be visible
  await page.waitForSelector(communityTabSelector, {
    state: "visible",
  });

  // Find all matching elements
  const communityTabs = await page.$$(communityTabSelector);

  // Assert that at at least one tab was found
  expect(communityTabs.length).toBeGreaterThan(0);
});

test("should load an error page if handle does not exist", async ({ page }) => {
  await page.goto(
    "/devhub.near/widget/app?page=community&handle=devhub-faketest"
  );

  // Using the <Link> that wraps the card to identify a community
  const communityNotFoundSelector =
    'h2:has-text("Community with handle devhub-faketest not found.")';

  // Find the matching element
  const communityNotFound = await page.$$(communityNotFoundSelector);

  expect(communityNotFound).not.toBeNull();
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should allow connected user to post from community page", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=activity"
    );

    const postButtonSelector = 'a:has-text("Post")';

    await page.waitForSelector(postButtonSelector, {
      state: "visible",
    });

    // Click the Post button and wait for the load state to be 'networkidle'
    await Promise.all([
      page.click(postButtonSelector),
      page.waitForLoadState("networkidle"),
    ]);

    // Verify that the URL is the expected one.
    expect(page.url()).toBe(
      "http://localhost:8080/devhub.near/widget/app?page=create&labels=webassemblymusic"
    );

    // Wait for the Typeahead field to render.
    const typeaheadSelector = ".rbt-input-main";
    await page.waitForSelector(typeaheadSelector, { state: "visible" });

    const typeaheadValueSelector = ".rbt-token-label";

    // Wait for prepoluated label to appear.
    await page.waitForSelector(typeaheadValueSelector, { state: "visible" });

    // Fetch the element and its text content.
    const element = await page.$(typeaheadValueSelector);
    const elementText = await element.textContent();

    expect(element).toBeTruthy();
    expect(elementText).toBe("webassemblymusic");
  });
});

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should not allow unconnected user to post from community page", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );

    const createCommunityButtonSelector = 'button:has-text("Post")';

    await page.waitForSelector(createCommunityButtonSelector, {
      state: "detached",
    });
  });
});

test.describe("Is community admin", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-community-admin.json",
  });
  test("should edit a community", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community.configuration&handle=webassemblymusic"
    );
    await page.locator('h5:has-text("Community Information")').waitFor();
    await page.getByRole("button", { name: " Edit" }).first().click();

    await page
      .getByTestId("1-description--editable")
      .fill("Music written in stone on NEAR");

    await page.getByRole("button", { name: " Submit" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    const transactionObj = JSON.parse(
      await page.locator("div.modal-body code").innerText()
    );
    expect(transactionObj.community.description).toBe(
      "Music written in stone on NEAR"
    );
  });
});
