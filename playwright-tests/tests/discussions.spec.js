import { test, expect } from "@playwright/test";

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should post to a discussion and validate content match", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions"
    );
    const discussionPostEditor = await page.getByTestId("compose-announcement");
    await discussionPostEditor.scrollIntoViewIfNeeded();
    await discussionPostEditor.fill("A test discussion post");

    await page.getByTestId("post-btn").click();

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions&transactionHashes=mi2a1KwagRFZhpqBNKhKaCTkHVj98J8tZnxSr1NpxSQ"
    );
    await page.waitForTimeout(4000);
  });
});
