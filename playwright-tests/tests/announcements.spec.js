import { test, expect } from "@playwright/test";

test.describe("Non authenticated user's wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("compose does not show for unauthenticated user", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=devhub-test"
    );

    const composeTextarea = await page.$(`textarea[data-testid="compose"]`);
    expect(composeTextarea).not.toBeTruthy();
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("compose shows for admins and moderators users", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=devhub-test"
    );

    const composeTextarea = `textarea[data-testid="compose-announcement"]`;
    await page.waitForSelector(composeTextarea, {
      state: "visible",
    });
  });

  test("contract call is correct after commit", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=devhub-test"
    );
    const composeTextarea = `textarea[data-testid="compose-announcement"]`;
    // Wait for the compose area to be visible
    await page.waitForSelector(composeTextarea, {
      state: "visible",
    });
    page.type(composeTextarea, "Annoncements is live!");
    const postButtonSelector = `button[data-testid="post-btn"]`;
    // Wait for the post button to be visible
    await page.waitForSelector(postButtonSelector, {
      state: "visible",
    });
    await page.click(postButtonSelector);
    await expect(page.locator("div.modal-body code")).toHaveText(
      JSON.stringify(
        {
          handle: "devhub-test",
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
      "/devhub.near/widget/app?page=community&handle=devhub-test"
    );
    const commentDiv = `div[title="Comment"]`;
    await page.waitForSelector(commentDiv, {
      state: "visible",
    });
  });

  test("like button is visible", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=devhub-test"
    );
    const likeDiv = `div[title="Like"]`;
    await page.waitForSelector(likeDiv, {
      state: "visible",
    });
  });

  //   test("a post shows in feed (socialdb query)", async ({ page }) => {
  //     await page.goto(
  //       "/devhub.near/widget/app?page=community&handle=devhub-test"
  //     );
  //   });

  //   test("a comment shows on post in feed (socialdb query)", async ({ page }) => {
  //     await page.goto(
  //       "/devhub.near/widget/app?page=community&handle=devhub-test"
  //     );
  //   });

  //   test("a post shows in feed (near-query-api query)", async ({ page }) => {
  //     await page.goto(
  //       "/devhub.near/widget/app?page=community&handle=devhub-test"
  //     );
  //   });

  //   test("a comment shows on post in feed (near-query-api query)", async ({
  //     page,
  //   }) => {
  //     await page.goto(
  //       "/devhub.near/widget/app?page=community&handle=devhub-test"
  //     );
  //   });
});
