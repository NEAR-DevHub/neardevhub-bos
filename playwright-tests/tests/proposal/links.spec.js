import test, { expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";

test.describe("share links", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
  });
  test("copy link button should create a clean URL link", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=proposal&id=127");

    await expect(await page.getByText("#127")).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    await page.getByRole("button", { name: "Copy link to proposal" }).click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page/proposal/127"
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);

    await expect(await page.getByText("#127")).toBeVisible({
      timeout: 10000,
    });
  });

  test("share on X should create a clean URL link", async ({
    page,
    context,
  }) => {
    await page.goto("/devhub.near/widget/app?page=proposal&id=127");

    await expect(await page.getByText("#127")).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    const shareOnXLink = await page.getByRole("link", { name: " Share on X" });
    const shareOnXUrl = await shareOnXLink.getAttribute("href");
    await expect(shareOnXUrl).toEqual(
      "https://x.com/intent/post?text=Check+out+this+proposal+on+%40NEARProtocol%0A%23NEAR+%23BOS%0Ahttps%3A%2F%2Fdevhub.near.page%2Fproposal%2F127"
    );
    await shareOnXLink.click();
    const twitterPage = await context.waitForEvent("page");
    await twitterPage.waitForURL(shareOnXUrl);
  });

  test("comment links should scroll into view", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(
      "/devhub.near/widget/app?page=proposal&id=127&accountId=theori.near&blockHeight=121684702"
    );
    const viewer = await page.locator("near-social-viewer");
    const commentElement = await viewer.locator("css=div#theorinear121684702");
    await expect(commentElement).toBeVisible({ timeout: 30000 });
    await expect(commentElement).toBeInViewport({ timeout: 30000 });
  });

  test("copying comment links should have clean URLs", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=proposal&id=127&accountId=theori.near&blockHeight=121684702"
    );
    const viewer = await page.locator("near-social-viewer");
    const commentElement = await viewer.locator("css=div#theorinear121684702");
    await expect(commentElement).toBeVisible({ timeout: 20000 });
    await page
      .locator("#theorinear121684702")
      .getByLabel("Copy URL to clipboard")
      .click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page/proposal/127?accountId=theori.near&blockHeight=121684702"
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);
  });
});
