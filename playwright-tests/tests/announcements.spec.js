import { test, expect } from "@playwright/test";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import { setDontAskAgainCacheValues } from "../util/cache.js";
import { pauseIfVideoRecording } from "../testUtils";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test.beforeEach(async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );
  });

  test("Post announcement", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    const widgetSrc =
      "devhub.near/widget/devhub.entity.community.Announcements";
    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "set_community_socialdb",
      contractId: "devhub.near",
    });

    const composeTextarea = await page.locator(
      `textarea[data-testid="compose-announcement"]`
    );
    await expect(composeTextarea).toBeVisible();
    const announcementText =
      "Announcements is live, though this is only an automated test!";
    await composeTextarea.fill(announcementText);

    const postButton = await page.locator(`button[data-testid="post-btn"]`);
    await expect(postButton).toBeVisible();

    await pauseIfVideoRecording(page);
    const communityHandle = "webassemblymusic.community.devhub.near";
    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        const args_base64 = postData.params?.args_base64;
        if (transaction_completed && args_base64) {
          const args = atob(args_base64);
          if (
            postData.params.account_id === "social.near" &&
            postData.params.method_name === "get" &&
            args === `{"keys":["${communityHandle}/post/**"]}`
          ) {
            const response = await route.fetch();
            const json = await response.json();

            const resultObj = decodeResultJSON(json.result.result);
            resultObj[communityHandle].post.main = JSON.stringify({
              text: announcementText,
            });
            json.result.result = encodeResultJSON(resultObj);

            await route.fulfill({ response, json });
            return;
          }
        }
        await route.continue();
      }
    );
    await postButton.click();

    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();

    await expect(loadingIndicator).toBeVisible();

    await expect(postButton).toBeDisabled();

    await expect(page.locator("div.modal-body code")).not.toBeVisible();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();

    await expect(transaction_toast).not.toBeVisible();

    await expect(loadingIndicator).not.toBeVisible();
    await expect(postButton).toBeEnabled();
    await expect(composeTextarea).toBeEmpty();
    await pauseIfVideoRecording(page);
  });
});
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
    await page.waitForTimeout(1000);
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
