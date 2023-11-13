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
  await page.goto("/devgovgigs.near/widget/app?page=feed");

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

test.describe("Wallet is connected", () => {
  // sign in to wallet
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should hide posts editor when hit cancel", async ({ page }) => {
    // go to feed with logged in user account
    await page.goto("/devhub.near/widget/app?page=feed&author=efiz.near");

    // find first post with edit button
    const firstPostWithEditButton = 'a.card-link[title="Edit post"]';
    await page.waitForSelector(firstPostWithEditButton, {
      state: "visible"
    })

    // open edit post menu
    await page.click(firstPostWithEditButton);

    // select first option to edit as idea
    const editAsIdeaLink = 'a.dropdown-item:has-text("Edit as an idea")';
    await page.waitForSelector(editAsIdeaLink, {
      state: "visible"
    });
    await page.click(editAsIdeaLink)

    // check if the editor is visible
    const editAsIdea = 'div.card-header:has-text("Edit Idea")';
    await page.waitForSelector(editAsIdea, {
      state: "visible"
    })

    // find and click cancel button
    const cancelButton = 'button.btn:has-text("Cancel")';
    await page.waitForSelector(cancelButton, {
      state: "visible"
    });
    await page.click(cancelButton);

    // check if editor is hidden
    await page.waitForSelector(editAsIdea, {
      state: "hidden"
    })
  })
})