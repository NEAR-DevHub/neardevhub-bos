import { test } from "../../util/multiinstance.js";
import { expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";

test.describe("share links", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
  });
  test("copy link button should create a clean URL link", async ({
    page,
    account,
    linksTestProposalId,
  }) => {
    await page.goto(
      `/${account}/widget/app?page=proposal&id=${linksTestProposalId}`
    );

    await expect(await page.getByText(`#${linksTestProposalId}`)).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    await page.getByRole("button", { name: "Copy link to proposal" }).click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      `https://${account}.page/proposal/${linksTestProposalId}`
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);

    await expect(await page.getByText(`#${linksTestProposalId}`)).toBeVisible({
      timeout: 10000,
    });
  });

  test("share on X should create a clean URL link", async ({
    page,
    account,
    linksTestProposalId,
    context,
  }) => {
    await page.goto(
      `/${account}/widget/app?page=proposal&id=${linksTestProposalId}`
    );

    await expect(await page.getByText(`#${linksTestProposalId}`)).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    const shareOnXLink = await page.getByRole("link", { name: " Share on X" });
    const shareOnXUrl = await shareOnXLink.getAttribute("href");
    await expect(shareOnXUrl).toEqual(
      `https://x.com/intent/post?text=Check+out+this+proposal+on+%40NEARProtocol%0A%23NEAR+%23BOS%0Ahttps%3A%2F%2F${account}.page%2Fproposal%2F${linksTestProposalId}`
    );
    await shareOnXLink.click();
    const twitterPage = await context.waitForEvent("page");
    await twitterPage.waitForURL(shareOnXUrl);
  });

  test("comment links should scroll into view", async ({
    page,
    account,
    linksTestProposalId,
    linksTestCommentAuthorId,
    linksTestCommentBlockHeight,
  }) => {
    test.setTimeout(60000);
    await page.goto(
      `/${account}/widget/app?page=proposal&id=${linksTestProposalId}&accountId=${linksTestCommentAuthorId}&blockHeight=${linksTestCommentBlockHeight}`
    );
    const viewer = await page.locator("near-social-viewer");
    const commentElement = await viewer.locator(
      `css=div#${linksTestCommentAuthorId.replaceAll(
        /[^0-9a-z]/g,
        ""
      )}${linksTestCommentBlockHeight}`
    );
    await expect(commentElement).toBeVisible({ timeout: 30000 });
    await expect(commentElement).toBeInViewport({ timeout: 30000 });
  });

  test("copying comment links should have clean URLs", async ({
    page,
    account,
    linksTestProposalId,
    linksTestCommentAuthorId,
    linksTestCommentBlockHeight,
  }) => {
    await page.goto(
      `/${account}/widget/app?page=proposal&id=${linksTestProposalId}&accountId=${linksTestCommentAuthorId}&blockHeight=${linksTestCommentBlockHeight}`
    );
    const viewer = await page.locator("near-social-viewer");
    const commentElement = await viewer.locator(
      `css=div#${linksTestCommentAuthorId.replaceAll(
        /[^0-9a-z]/g,
        ""
      )}${linksTestCommentBlockHeight}`
    );
    await expect(commentElement).toBeVisible({ timeout: 20000 });
    await page
      .locator(
        `#${linksTestCommentAuthorId.replaceAll(
          /[^0-9a-z]/g,
          ""
        )}${linksTestCommentBlockHeight}`
      )
      .getByLabel("Copy URL to clipboard")
      .click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      `https://${account}.page/proposal/${linksTestProposalId}?accountId=${linksTestCommentAuthorId}&blockHeight=${linksTestCommentBlockHeight}`
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);
  });
});
