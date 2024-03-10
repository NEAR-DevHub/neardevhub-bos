import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import {
  getDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
  findKeysInCache,
} from "../util/cache.js";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import { mockTransactionSubmitRPCResponses } from "../util/transaction.js";

const RECEIVER_ID = "devgovgigs.near";

test.describe("Wallet is connected with devhub access key", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("should comment to a post", async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );

    await page.goto("/devhub.near/widget/app?page=post&id=2731");
    await setDontAskAgainCacheValues(
      page,
      "devhub.near/widget/devhub.entity.post.PostEditor",
      "add_post"
    );

    await pauseIfVideoRecording(page);
    const postToReplyButton = await page.getByRole("button", {
      name: "↪ Reply",
    });
    await postToReplyButton.click();

    await pauseIfVideoRecording(page);
    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });

    await commentButton.click();
    await pauseIfVideoRecording(page);

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await pauseIfVideoRecording(page);
    expect(
      await getDontAskAgainCacheValues(
        page,
        "devhub.near/widget/devhub.entity.post.PostEditor"
      )
    ).toEqual({ add_post: true });

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    const cachedValues = await findKeysInCache(page, RECEIVER_ID);
    console.log("cached values", cachedValues);
    await mockTransactionSubmitRPCResponses(page, RECEIVER_ID);

    await submitbutton.click();
    await expect(submitbutton).toBeDisabled();
    await pauseIfVideoRecording(page);

    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();
    await expect(loadingIndicator).toBeVisible();
    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_post`
    );
    expect(callContractToast.isVisible()).toBeTruthy();
    await callContractToast.waitFor({ state: "detached" });
    await expect(loadingIndicator).toBeVisible();

    await page
      .getByText("Editor Preview Create Comment")
      .waitFor({ state: "detached" });

    await expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
  });

  test("should like a post", async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );

    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    await setDontAskAgainCacheValues(
      page,
      "devhub.near/widget/devhub.entity.post.Post",
      "add_like"
    );

    const likeButton = await page.locator(".bi-heart-fill");
    await likeButton.waitFor({ state: "visible" });
    await mockTransactionSubmitRPCResponses(page, RECEIVER_ID);

    await pauseIfVideoRecording(page);
    await likeButton.click();
    const loadingIndicator = await page
      .locator(".like-loading-indicator")
      .first();

    await expect(loadingIndicator).toBeVisible();
    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_like`
    );
    expect(callContractToast.isVisible()).toBeTruthy();
    await expect(loadingIndicator).toBeVisible();

    await callContractToast.waitFor({ state: "detached" });

    await expect(loadingIndicator).toBeVisible();

    await page
      .getByRole("link", {
        name: "WebAssembly Music @webassemblymusic.near",
      })
      .waitFor({ state: "visible" });

    await expect(loadingIndicator).not.toBeVisible();

    await page.waitForTimeout(500);
  });

  test("should comment to a long thread with don't ask again feature enabled", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );

    await page.goto("/devhub.near/widget/app?page=post&id=2261");

    await setDontAskAgainCacheValues(
      page,
      "devhub.near/widget/devhub.entity.post.PostEditor",
      "add_post"
    );

    const postToReplyButton = await page
      .getByRole("button", { name: "↪ Reply" })
      .nth(0);
    await postToReplyButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await postToReplyButton.click();
    await pauseIfVideoRecording(page);

    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click();

    await pauseIfVideoRecording(page);
    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.scrollIntoViewIfNeeded();
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await pauseIfVideoRecording(page);
    await mockTransactionSubmitRPCResponses(page, RECEIVER_ID);
    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await submitbutton.click();
    await expect(submitbutton).toBeDisabled();

    await pauseIfVideoRecording(page);
    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();
    await expect(loadingIndicator).toBeVisible();
    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_post`
    );
    expect(callContractToast.isVisible()).toBeTruthy();
    await callContractToast.waitFor({ state: "detached" });
    expect(loadingIndicator).toBeVisible();

    await page
      .getByText("Editor Preview Create Comment")
      .waitFor({ state: "detached" });

    expect(loadingIndicator).not.toBeVisible();

    await page.waitForTimeout(500);
  });
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });
  test("should comment to a post and cancel the transaction, and get the submit button back again", async ({
    page,
  }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );

    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    await pauseIfVideoRecording(page);
    const postToReplyButton = await page.getByRole("button", {
      name: "↪ Reply",
    });
    await postToReplyButton.click();

    await pauseIfVideoRecording(page);
    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });

    await commentButton.click();
    await pauseIfVideoRecording(page);

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await pauseIfVideoRecording(page);

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    await submitbutton.click();
    await pauseIfVideoRecording(page);
    await expect(submitbutton).toBeDisabled();
    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();
    expect(loadingIndicator).toBeVisible();

    const closeButton = await page.getByText("Close");
    expect(closeButton).toBeVisible();
    await page.waitForTimeout(1000);

    await closeButton.click();

    // There is unfortunately no way to achieve this as long as the VM does not have a callback
    // that says the transaction confirmation dialog was closed

    // expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
  });
});
