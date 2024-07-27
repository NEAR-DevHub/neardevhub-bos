import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockSocialIndexResponses } from "../../util/socialapi.js";

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:20000/", async (route) => {
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
    await expect(copyUrlButton).toBeVisible({ timeout: 10000 });
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

    await expect(await page.getByText("WebAssembly Music")).toBeVisible({
      timeout: 10000,
    });
  };

  test("should share clean URL for announcements, using indexer ( no lag )", async ({
    page,
  }) => {
    await cleanUrlForAnnouncementsTest({ page, lag: 0 });
  });

  test("should share clean URL for announcements, using fallback ( big lag )", async ({
    page,
  }) => {
    await cleanUrlForAnnouncementsTest({ page, lag: 1_000_000 });
  });

  test("should handle direct links to the post widget", async ({ page }) => {
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
});
