import { test, expect } from "@playwright/test";

test.describe("Non authenticated user's wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("compose does not show for unauthenticated user", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );

    const composeTextareaSelector = await page.$(
      `textarea[data-testid="compose"]`
    );
    expect(composeTextareaSelector).not.toBeTruthy();
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("compose shows for admins and moderators users", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );

    const composeTextareaSelector = `textarea[data-testid="compose-announcement"]`;
    await page.waitForSelector(composeTextareaSelector, {
      state: "visible",
    });
  });

  test("contract call is correct after commit", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    const composeTextareaSelector = `textarea[data-testid="compose-announcement"]`;
    // Wait for the compose area to be visible
    await page.waitForSelector(composeTextareaSelector, {
      state: "visible",
    });
    page.type(composeTextareaSelector, "Annoncements is live!");
    const postButtonSelector = `button[data-testid="post-btn"]`;
    // Wait for the post button to be visible
    await page.waitForSelector(postButtonSelector, {
      state: "visible",
    });
    await page.click(postButtonSelector);
    await expect(page.locator("div.modal-body code")).toHaveText(
      JSON.stringify(
        {
          handle: "webassemblymusic",
          data: {
            post: {
              main: '{"type":"md","text":"Annoncements is live!"}',
            },
            index: {
              post: '{"key":"main","value":{"type":"md"}}',
            },
          },
        },
        null,
        2
      )
    );
  });

  test("comment button is visible", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    const commentButtonSelector = `button[title="Add Comment"]`;
    await page.waitForSelector(commentButtonSelector, {
      state: "visible",
    });
  });

  test("like button is visible", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    const likeButtonSelector = `button[title="Like"]`;
    await page.waitForSelector(likeButtonSelector, {
      state: "visible",
    });
  });

  test("a post shows in feed", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });

  // SKIPPING
  test.skip("a comment shows on post in feed", async ({ page }) => {
    // This test needs to be revisited if we modify the post / comment
    // At this time comments occur within "near" accountId's widgets with no discernable traits for testing
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    // only comments have a row class
    const commentsDivSelector = `i[class="bi-chat"]`;
    await page.waitForSelector(commentsDivSelector, {
      state: "visible",
    });
  });
});
