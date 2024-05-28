import { expect, test } from "@playwright/test";
import {
  pauseIfVideoRecording,
  generateRandom6CharUUID,
  waitForTestIdToBeVisible,
  waitForSelectorToBeVisible,
} from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockBlogs } from "../../util/blogs.js";
import { setDontAskAgainCacheValues } from "../../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../../util/transaction.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

const otherInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=second-blog";

const communityAccount = "webassemblymusic.community.devhub.near";

// This blog is mocked in util/addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

const blogPageOtherInstance =
  "/devhub.near/widget/app?page=blogv2&id=first-blog-of-instance-2-nhasab&community=webassemblymusic";

test.beforeEach(async ({ page }) => {
  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    await mockDefaultTabs(route);
  });

  await page.route("https://api.near.social/get", async (route) => {
    await mockBlogs(route);
  });
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(baseUrl);
    const widgetSrc =
      "devhub.near/widget/devhub.entity.addon.blogv2.editor.provider";
    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "set_community_socialdb",
      contractId: "devhub.near",
    });

    await pauseIfVideoRecording(page);
  });

  test.skip("Save blog configuration", async ({ page }) => {});
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);
  });

  test("can navigate to the settings page", async ({ page }) => {
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    expect(await settingsButton.isVisible()).toBe(true);
    await settingsButton.click();
  });

  test("can configure the title of the blog view widget", async ({ page }) => {
    // Go to the Viewer and check the configured title
    const configureButton = page.getByTestId("configure-addon-button-x");
    await configureButton.click();

    const title = page.getByTestId("blog-instance-title");
    await title.scrollIntoViewIfNeeded();
    expect(await title.innerText()).toBe("Mocked configured blog page title");

    // Go to the other Viewer where it is not configured and see the default title
    await page.goto(otherInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");

    await title.scrollIntoViewIfNeeded();
    expect(await title.innerText()).toBe("Latest Blog Posts");
  });

  test("can configure the subtitle of the blog view widget", async ({
    page,
  }) => {
    // Go to the Viewer and check the configured title
    const configureButton = page.getByTestId("configure-addon-button-x");
    await configureButton.click();

    const subTitle = page.getByTestId("blog-instance-subtitle");
    await subTitle.scrollIntoViewIfNeeded();
    expect(await subTitle.innerText()).toBe("Mocked configured subtitle");
    // Go to the other Viewer where it is not configured and see the default title
    await page.goto(otherInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");

    await subTitle.scrollIntoViewIfNeeded();
    expect(await subTitle.innerText()).toBe("");
  });

  test("can enable/disable search functionality", async ({ page }) => {
    // Go to the Viewer and check the if search is visible
    const configureButton = page.getByTestId("configure-addon-button-x");
    await configureButton.click();

    const searchIcon = page.getByTestId("search-blog-posts");
    await searchIcon.scrollIntoViewIfNeeded();
    expect(await searchIcon.isVisible()).toBe(true);
    await pauseIfVideoRecording(page);

    // Go to the other Viewer where it is not configured and see it is hidden by default
    await page.goto(otherInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");

    await expect(searchIcon).not.toBeVisible();
  });

  test("can enable/disable author functionality", async ({ page }) => {
    // Author is default enabled
    // In which case it is on the blog..
    await page.goto(blogPageOtherInstance);
    console.log("0");
    await waitForTestIdToBeVisible(page, "blog-author");
    expect(await page.getByTestId("blog-author").isVisible()).toBe(true);
    // And also in the blog form
    await page.goto(otherInstance);
    await waitForTestIdToBeVisible(page, "configure-addon-button");
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();
    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);
    // Create a new blog
    await page.getByTestId("new-blog-post-button").click();
    await pauseIfVideoRecording(page);
    await waitForSelectorToBeVisible(page, `[id^="blog-editor-form"]`);
    const authorInputField = page.getByTestId("author-input-field");
    await authorInputField.scrollIntoViewIfNeeded();
    await expect(authorInputField).toBeVisible();
    // And also in the blog preview
    const blogPreviewPageButton = page.getByTestId("preview-page-blog-toggle");
    await blogPreviewPageButton.click();
    console.log("1");
    await waitForTestIdToBeVisible(page, "blog-author");
    expect(await page.getByTestId("blog-author").isVisible()).toBe(true);

    // However it can be disabled
    await page.goto(blogPage);
    // In which case the author is removed from the blog page
    await waitForTestIdToBeVisible(page, "blog-date");
    const blogAuthor = page.getByTestId("blog-author");
    await expect(blogAuthor).not.toBeVisible();
    // And also from the blog editor
    await page.goto(baseUrl);
    await waitForTestIdToBeVisible(page, "configure-addon-button");
    await configureButton.click();
    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);
    await page.getByTestId("new-blog-post-button").click();
    await pauseIfVideoRecording(page);
    await waitForSelectorToBeVisible(page, `[id^="blog-editor-form"]`);
    await expect(page.getByTestId("author-input-field")).not.toBeVisible();
    // And also in the blog preview page
    await blogPreviewPageButton.click();
    console.log("2");

    await waitForTestIdToBeVisible(page, "blog-date");
    await expect(page.getByTestId("blog-author")).not.toBeVisible();
  });

  test("can configure how to blog posts are ordered", async ({ page }) => {
    // Go to the Viewer and check the if search is visible
    const configureButton = page.getByTestId("configure-addon-button-x");
    await configureButton.click();
  });

  test.skip("can configure the number of blogs to display per page", async ({
    page,
  }) => {});

  test.skip("should be able to configure the settings of the blogv2 addon instance", async ({
    page,
  }) => {});
});
