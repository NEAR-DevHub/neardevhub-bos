import { test } from "@playwright/test";

// LEGACY
test("LEGACY: should show post history for posts in the feed", async ({
  page,
}) => {
  await page.goto("/devgovgigs.near/widget/gigs-board.pages.Feed");

  const firstPostHistoryButtonSelector = 'a.card-link[title="Post History"]';
  // Wait for the first post history button to be visible
  await page.waitForSelector(firstPostHistoryButtonSelector, {
    state: "visible",
  });

  // Click on the first post history button
  await page.click(firstPostHistoryButtonSelector);

  // Wait for the next sibling element to be visible
  const siblingSelector = `${firstPostHistoryButtonSelector} + *`;
  await page.waitForSelector(siblingSelector, { state: "visible" });

  // Check that inside that sibling element there's an element with the class: bi-file-earmark-diff
  const desiredChildSelector = `${siblingSelector} .bi-file-earmark-diff`;
  await page.waitForSelector(desiredChildSelector, { state: "visible" });
});

test("should show post history for posts in the feed", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/devhub.page.feed");

  const firstPostHistoryButtonSelector = 'a.card-link[title="Post History"]';
  // Wait for the first post history button to be visible
  await page.waitForSelector(firstPostHistoryButtonSelector, {
    state: "visible",
  });

  // Click on the first post history button
  await page.click(firstPostHistoryButtonSelector);

  // Wait for the next sibling element to be visible
  const siblingSelector = `${firstPostHistoryButtonSelector} + *`;
  await page.waitForSelector(siblingSelector, { state: "visible" });

  // Check that inside that sibling element there's an element with the class: bi-file-earmark-diff
  const desiredChildSelector = `${siblingSelector} .bi-file-earmark-diff`;
  await page.waitForSelector(desiredChildSelector, { state: "visible" });
});
