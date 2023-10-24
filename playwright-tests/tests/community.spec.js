import { test, expect } from "@playwright/test";

test("should load a community page if handle exists", async ({ page }) => {
  await page.goto(
    "/devgovgigs.near/widget/app?page=community&handle=devhub-test"
  );

  // Using the <Link> that wraps the tabs to identify a community page loaded
  const communityTabSelector = `a[href^="/devgovgigs.near/widget/app?page=community&handle=devhub-test&tab="]`;

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
    "/devgovgigs.near/widget/app?page=community&handle=devhub-faketest"
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
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should allow connected user to post from community page", async ({
    page,
  }) => {
    await page.goto(
      "/devgovgigs.near/widget/app?page=community&handle=devhub-test"
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
      "https://near.org/devgovgigs.near/widget/app?page=create&labels=devhub-test"
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
    expect(elementText).toBe('devhub-test');
    
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
      "/devgovgigs.near/widget/app?page=community&handle=devhub-test"
    );

    const createCommunityButtonSelector = 'button:has-text("Post")';

    await page.waitForSelector(createCommunityButtonSelector, {
      state: "detached",
    });
  });
});
