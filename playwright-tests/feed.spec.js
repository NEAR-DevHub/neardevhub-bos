import { test, expect } from "@playwright/test";

test("should show post history for posts in the feed", async ({ page }) => {
  await page.goto("https://near.org/");
  await page.evaluate(() => {
    localStorage.setItem(
      "flags",
      JSON.stringify({ bosLoaderUrl: "http://127.0.0.1:3030" })
    );
  });

  await page.goto(
    "https://near.org/devgovgigs.near/widget/gigs-board.pages.Feed"
  );
  const bodyText = await page.textContent("body");
  expect(bodyText).not.toContain("BOS Loader fetch error");

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
