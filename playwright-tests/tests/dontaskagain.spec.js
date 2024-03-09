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
    await setDontAskAgainCacheValues(page);

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
    expect(await getDontAskAgainCacheValues(page)).toEqual({ add_post: true });

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    const cachedValues = await findKeysInCache(page, RECEIVER_ID);
    console.log("cached values", cachedValues);
    await mockTransactionSubmitRPCResponses(page, RECEIVER_ID);

    await submitbutton.click();
    await pauseIfVideoRecording(page);
    await submitbutton.waitFor({ state: "detached", timeout: 500 });

    const callContractToast = await page.getByText(
      `Calling contract ${RECEIVER_ID} with method add_post`
    );
    expect(callContractToast.isVisible()).toBeTruthy();
    await callContractToast.waitFor({ state: "detached" });
    await page
      .getByText("Editor Preview Create Comment")
      .waitFor({ state: "detached" });
    await pauseIfVideoRecording(page);
  });

  test("should like a post", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    const likeButton = await page.getByRole("button", {
      name: " Peter Salomonsen @petersalomonsen.near",
    });
    await likeButton.click();
    await page.waitForTimeout(2000);
  });

  test("should comment to a long thread with don't ask again feature enabled", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=post&id=1033");

    await setDontAskAgainCacheValues(page);

    const postToReplyButton = await page
      .locator("#collapseChildPosts1041")
      .getByRole("button", { name: "↪ Reply" })
      .nth(1);
    await postToReplyButton.scrollIntoViewIfNeeded();
    await postToReplyButton.click();

    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click();

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.scrollIntoViewIfNeeded();
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await page.getByTestId("submit-create-post").click();
    await page.waitForTimeout(5000);
  });
});
