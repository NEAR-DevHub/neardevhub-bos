import { expect, test } from "@playwright/test";

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test.setTimeout(120000);

  test("should comment to a long thread with don't ask again feature enabled", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=post&id=1033");
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
