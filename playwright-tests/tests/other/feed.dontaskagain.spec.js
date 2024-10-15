import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import {
  getDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
  findKeysInCache,
} from "../../util/cache.js";
import { mockTransactionSubmitRPCResponses } from "../../util/transaction.js";

const RECEIVER_ID = "devgovgigs.near";
test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is connected with devhub access key", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("should comment to a post", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=post&id=2731");
    await setDontAskAgainCacheValues({
      page,
      widgetSrc: "devhub.near/widget/devhub.entity.post.PostEditor",
      methodName: "add_post",
    });

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

    await expect(
      await getDontAskAgainCacheValues({
        page,
        widgetSrc: "devhub.near/widget/devhub.entity.post.PostEditor",
        methodName: "add_post",
      })
    ).toEqual({ add_post: true });

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    const cachedValues = await findKeysInCache(page, RECEIVER_ID);
    console.log("cached values", cachedValues);
    await mockTransactionSubmitRPCResponses(page);

    await submitbutton.click();
    await expect(submitbutton).toBeDisabled();

    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();
    await expect(loadingIndicator).toBeVisible();

    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_post`
    );
    await expect(callContractToast.isVisible()).toBeTruthy();
    await callContractToast.waitFor({ state: "detached" });

    await page
      .getByText("Editor Preview Create Comment")
      .waitFor({ state: "detached" });

    await expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
  });

  test("should like a post", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    await setDontAskAgainCacheValues({
      page,
      widgetSrc: "devhub.near/widget/devhub.entity.post.Post",
      methodName: "add_like",
    });

    const likeButton = await page.locator(".bi-heart-fill");
    await likeButton.waitFor({ state: "visible" });
    await mockTransactionSubmitRPCResponses(page);

    await pauseIfVideoRecording(page);
    await likeButton.click();
    const loadingIndicator = await page
      .locator(".like-loading-indicator")
      .first();

    await expect(loadingIndicator).toBeVisible();
    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_like`
    );
    await expect(callContractToast.isVisible()).toBeTruthy();
    await expect(loadingIndicator).toBeVisible();

    await callContractToast.waitFor({ state: "detached" });

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
    test.setTimeout(120000);

    await page.goto("/devhub.near/widget/app?page=post&id=2261");

    await setDontAskAgainCacheValues({
      page,
      widgetSrc: "devhub.near/widget/devhub.entity.post.PostEditor",
      methodName: "add_post",
    });

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
    await page.waitForTimeout(10_000);
    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await page.waitForTimeout(100);
    await commentArea.fill("Some comment");

    await pauseIfVideoRecording(page);
    await mockTransactionSubmitRPCResponses(page);
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
    await expect(callContractToast.isVisible()).toBeTruthy();
    await callContractToast.waitFor({ state: "detached" });
    await expect(loadingIndicator).toBeVisible();

    await page
      .getByText("Editor Preview Create Comment")
      .waitFor({ state: "detached" });

    await expect(loadingIndicator).not.toBeVisible();

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
    test.setTimeout(60000);

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
