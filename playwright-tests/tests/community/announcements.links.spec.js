import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording, showPageURLInTest } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockSocialIndexResponses } from "../../util/socialapi.js";
import { MOCK_RPC_URL } from "../../util/rpcmock.js";

test.beforeEach(async ({ page }) => {
  await page.route(MOCK_RPC_URL, async (route) => {
    await mockDefaultTabs(route);
  });
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Clipboard permissions", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
  });

  const cleanUrlForAnnouncementsTest = async ({ page, lag }) => {
    let socialIndexBlockHeight;
    await mockSocialIndexResponses(page, ({ requestPostData, json }) => {
      if (
        requestPostData &&
        requestPostData.action === "post" &&
        requestPostData.key === "main"
      ) {
        socialIndexBlockHeight = json[0].blockHeight;
      }
      return json;
    });
    await page.route(
      // TODO sunset
      "https://near-queryapi.api.pagoda.co/v1/graphql",
      async (route) => {
        const request = route.request();
        const requestPostData = request.postDataJSON();

        if (
          requestPostData?.query.includes(
            "dataplatform_near_social_feed_posts"
          ) &&
          requestPostData?.query.match("{[ \n]*block_height[ \n]*}") !== null
        ) {
          const response = await route.fetch();
          const json = await response.json();
          json.data.dataplatform_near_social_feed_posts[0].block_height =
            socialIndexBlockHeight - lag;
          await route.fulfill({ json });
        } else {
          await route.continue();
        }
      }
    );
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=announcements"
    );
    const copyUrlButton = await page
      .locator('[data-component="near/widget/CopyUrlButton"]')
      .first();
    await expect(copyUrlButton).toBeVisible({ timeout: 20000 });
    await copyUrlButton.hover();
    await expect(await page.getByText("Copy URL to clipboard")).toBeVisible();
    await copyUrlButton.click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );

    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page/community/webassemblymusic/announcements?accountId=webassemblymusic.community.devhub.near&blockHeight=116026696"
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);

    await showPageURLInTest(page);
    await expect(await page.getByText("WebAssembly Music")).toBeVisible({
      timeout: 10000,
    });
  };

  test.skip("should share clean URL for announcements, using indexer ( no lag )", async ({
    page,
  }) => {
    await cleanUrlForAnnouncementsTest({ page, lag: 0 });
  });

  test.skip("should share clean URL for announcements, using fallback ( big lag )", async ({
    page,
  }) => {
    await cleanUrlForAnnouncementsTest({ page, lag: 1_000_000 });
  });

  test.skip("should handle direct links to the post widget", async ({
    page,
  }) => {
    const directUrlPath =
      "/devhub.near/widget/devhub.components.organism.Feed.Posts.Post?accountId=webassemblymusic.community.devhub.near&blockHeight=115859669";
    await page.goto(directUrlPath);

    const copyUrlButton = await page
      .locator('[data-component="near/widget/CopyUrlButton"]')
      .first();
    await expect(copyUrlButton).toBeVisible({ timeout: 10000 });
    await copyUrlButton.hover();
    await expect(await page.getByText("Copy URL to clipboard")).toBeVisible();
    await copyUrlButton.click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );

    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page" + directUrlPath
    );
  });

  test.skip("announcement should scroll into view and be highlighted", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=announcements&accountId=webassemblymusic.community.devhub.near&blockHeight=112244156"
    );
    await showPageURLInTest(page);

    const viewer = await page.locator("near-social-viewer");
    const announcementElement = await viewer.locator(
      "css=div#webassemblymusiccommunitydevhubnear112244156"
    );
    await expect(announcementElement).toBeVisible({ timeout: 20000 });

    await expect(announcementElement).toContainText(
      "WebAssembly Music is the concept of storing a full length track of music in a tiny file"
    );
    await expect(announcementElement).toBeInViewport({ timeout: 10000 });
    await expect(announcementElement).toHaveCSS(
      "border",
      "2px solid rgb(0, 0, 0)"
    );
  });
});
