import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";

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

  test("should share clean URL for announcements", async ({ page }) => {
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
