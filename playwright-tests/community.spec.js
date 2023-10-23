import { test, expect } from "@playwright/test";

test("should load metadata on the communities page", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/app?page=communities");

  // Using the <Link> that wraps the card to identify a community
  const communityCardSelector = `a[href^="/devgovgigs.near/widget/app?page=community&handle="]`;

  // Wait for at least one card to be visible
  await page.waitForSelector(communityCardSelector, {
    state: "visible",
  });

  // Find all matching elements
  const communityCards = await page.$$(communityCardSelector);

  // Assert that at more than one card was found
  expect(communityCards.length).toBeGreaterThan(1);
});

// TODO: we need a way to have an account login to playwright tests

// test("should show spawner when user clicks create community", async ({
//   page,
// }) => {
//   await page.goto("/devgovgigs.near/widget/app?page=communities");

//   const createCommunityButtonSelector = 'button:has-text("Create Community")';

//   await page.waitForSelector(createCommunityButtonSelector, {
//     state: "visible",
//   });
//   await page.click(createCommunityButtonSelector);

//   const communitySpawnerSelector = 'div:has-text("Community information")';
//   await page.waitForSelector(communitySpawnerSelector, { state: "visible" });
// });

test("should load a community page if handle exists", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/app?page=community&handle=devhub-test");

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
  await page.goto("/devgovgigs.near/widget/app?page=community&handle=devhub-faketest");

  // Using the <Link> that wraps the card to identify a community
  const communityNotFoundSelector = 'h2:has-text("Community with handle devhub-faketest not found.")';;

  // Find the matching element
  const communityNotFound = await page.$$(communityNotFoundSelector);

  expect(communityNotFound).not.toBeNull();
});

