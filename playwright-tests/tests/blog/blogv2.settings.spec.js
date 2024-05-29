import { expect, test } from "@playwright/test";
import {
  pauseIfVideoRecording,
  waitForTestIdToBeVisible,
  waitForSelectorToBeVisible,
  fmtDate,
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

const thirdInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=third-blog";

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
    expect(await title.innerText()).toBe("");
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

    await waitForTestIdToBeVisible(page, "blog-date");
    await expect(page.getByTestId("blog-author")).not.toBeVisible();
  });

  test("can configure how to blog posts are ordered", async ({ page }) => {
    // Go to the Viewer and check if the default is timedesc
    await page.goto(otherInstance); // timedesc

    // Get all the blog posts
    await pauseIfVideoRecording(page);
    const blogCards = page.locator(`[id^="blog-card-"]`);
    const elements = await page.$$(`[data-testid="blog-card-date"]`);
    const numberOfBlogCards = await blogCards.count();
    expect(numberOfBlogCards).toBeGreaterThan(3);

    let lastDate = new Date();

    // Extract the innerText of each element
    const dateTextsDesc = await Promise.all(
      elements.map(async (element) => {
        return await element.innerText();
      })
    );
    dateTextsDesc.map((dateText) => {
      const date = new Date(dateText);
      expect(
        date <= lastDate,
        `Expected ${date} to be less than or equal to ${lastDate}`
      ).toBe(true);
      lastDate = date;
    });

    // Go to other instance to check if the order it timeasc
    await page.goto(baseUrl); // timeasc
    await pauseIfVideoRecording(page);
    const elements2 = await page.$$(`[data-testid="blog-card-date"]`);

    let firstDate = new Date("December 17, 1995");

    // Extract the innerText of each element
    const dateTextsAsc = await Promise.all(
      elements2.map(async (element) => {
        return await element.innerText();
      })
    );
    dateTextsAsc.map((dateText) => {
      const date = new Date(dateText);
      expect(
        date >= firstDate,
        `Expected ${fmtDate(date)} to be greater than or equal to ${fmtDate(
          firstDate
        )}`
      ).toBe(true);
      firstDate = date;
    });
  });

  test("Can configure to sort the blog posts alphabetically", async ({
    page,
  }) => {
    // Go to third instance to check if the order is alpha
    await page.goto(thirdInstance); // alpha
    await pauseIfVideoRecording(page);
    const titleElements = await page.$$(`[data-testid="blog-card-title"]`);

    let firstTitle = "AAAAAAA";

    // Extract the innerText of each element
    const titleTextAlpha = await Promise.all(
      titleElements.map(async (element) => {
        return await element.innerText();
      })
    );
    titleTextAlpha.map((titleText) => {
      if (firstTitle === "AAAAAAA") {
        firstTitle = titleText;
        return;
      }
      expect(
        firstTitle.localeCompare(titleText),
        `Expect '${firstTitle}' to come before '${titleText}'`
      ).toBe(-1);
      firstTitle = titleText;
    });
  });

  test.skip("can configure the number of blogs to display per page", async ({
    page,
  }) => {});

  test("can disable categories", async ({ page }) => {});

  test.skip("should be able to configure the settings of the blogv2 addon instance", async ({
    page,
  }) => {});
});
