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

const fourthInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=fourth-blog";

const communityAccount = "webassemblymusic.community.devhub.near";

// This blog is mocked in util/addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

const blogPageOtherInstance =
  "/devhub.near/widget/app?page=blogv2&id=first-blog-of-instance-2-nhasab&community=webassemblymusic";

const blogPageThirdInstance =
  "/devhub.near/widget/app?page=blogv2&community=webassemblymusic&id=this-is-the-blog-title-xfxkzh";

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
    const widgetSrc = "devhub.near/widget/devhub.page.addon";
    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "set_community_addon",
      contractId: "devhub.near",
    });

    await pauseIfVideoRecording(page);
  });

  test("Save blog configuration", async ({ page }) => {
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.getByTestId("settings-button").click();
    await page.getByPlaceholder("Title", { exact: true }).click();
    await page
      .getByPlaceholder("Title", { exact: true })
      .fill("Mocked configured blog page title 2");
    await page.getByText("Provide a brief subtitle for").click();
    await page.getByPlaceholder("Subtitle").click();
    await page
      .getByPlaceholder("Subtitle")
      .fill("Mocked configured subtitle 2");
    await page.getByLabel("Author Enabled").getByText("Disabled").click();
    await page.getByLabel("Author Enabled").getByText("Enabled").click();
    await page.getByLabel("Search").getByText("Disabled").click();
    await page.getByLabel("Search").getByText("Enabled").click();
    await page.getByText("Newest to oldest", { exact: true }).click();
    await page.getByTestId("post-per-page-input").click();
    await page.getByTestId("post-per-page-input").fill("8");
    await page.getByText("Required", { exact: true }).click();

    // Mock transaction here
    let is_transaction_completed = false;
    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const requestPostData = request.postDataJSON();
        const args_base64 = requestPostData.params?.args_base64;

        if (transaction_completed) {
          is_transaction_completed = true;
        }

        if (
          requestPostData.params.account_id === "social.near" &&
          requestPostData.params.method_name === "get" &&
          args_base64 &&
          JSON.parse(atob(args_base64)).keys[0] ===
            `${communityAccount}/blog/**`
        ) {
          const response = await route.fetch();
          const json = await response.json();

          const resultObj = decodeResultJSON(json.result.result);

          let id = `the-blog-title-${generateRandom6CharUUID()}`;
          let publishedAt = new Date(publishedDate).toISOString().slice(0, 10);

          let metadata = {
            title: "the-blog-title",
            publishedAt,
            status: "PUBLISH",
            subtitle: "Subtitle",
            description: descriptionText,
            author: author,
            category: "news",
            updatedAt: new Date().toISOString().slice(0, 10),
          };

          metadata.createdAt = new Date().toISOString().slice(0, 10);
          metadata.communityAddonId = "blogv2";

          resultObj[communityAccount]["blog"][id] = {
            "": content,
            metadata: metadata,
          };

          json.result.result = encodeResultJSON(resultObj);

          await route.fulfill({ response, json });
          return;
        } else if (
          // Make sure the addons are enabled
          requestPostData.params &&
          requestPostData.params.account_id === "devhub.near" &&
          requestPostData.params.method_name === "get_community"
        ) {
          const response = await route.fetch();
          const json = await response.json();

          const resultObj = decodeResultJSON(json.result.result);
          if (
            !resultObj.addons
              .map((addon) => addon.addon_id)
              .includes("blogv2") ||
            !resultObj.addons
              .map((addon) => addon.addon_id)
              .includes("blogv2instance2")
          ) {
            resultObj.addons = [
              ...resultObj.addons,
              {
                addon_id: "blogv2",
                display_name: "First Blog",
                enabled: true,
                id: "blogv2",
                // After the transactions with updated parameters
                parameters:
                  '{"title":"Mocked configured blog page title",\
                "subtitle":"Mocked configured subtitle",\
                "authorEnabled": "enabled",\
                "searchEnabled": "enabled",\
                "orderBy": "timeasc",\
                "postPerPage": 5,\
                "categoriesEnabled": "enabled",\
                "categories": [{"category":"News","value":"news"},\
                {"category":"Guide","value":"guide"},\
                {"category":"Reference","value":"reference"}],\
                "categoryRequired": "required"}',
              },
            ];
          }

          json.result.result = encodeResultJSON(resultObj);

          await route.fulfill({ response, json });
          return;
        }

        await route.continue();
      }
    );

    const saveSettingsButton = page.getByTestId("save-settings-button").nth(1);

    // Save the settings
    await saveSettingsButton.click();

    // expect(saveSettingsButton.innerText()).toBe("Loading...");

    await expect(saveSettingsButton).toBeDisabled();

    await expect(page.locator("div.modal-body code")).not.toBeVisible();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method set_community_addon"
    );
    await expect(transaction_toast).toBeVisible();

    await pauseIfVideoRecording(page);
    // Maybe longer?
    await page.waitForTimeout(5000);
    // Wait for the transaction to complete
    await expect(transaction_toast).not.toBeVisible();

    await pauseIfVideoRecording(page);
    await expect(is_transaction_completed).toBe(true);
  });
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

    const saveSettingsButton = page.getByTestId("save-settings-button").first();
    await saveSettingsButton.scrollIntoViewIfNeeded();
    await expect(saveSettingsButton).toBeVisible();
  });

  test("can edit and submit the blog settings of a not yet configured blog", async ({
    page,
  }) => {
    // Go to the settings page of a not yet configured blog
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();
    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);
    // Navigate to the settings page
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    expect(await settingsButton.isVisible()).toBe(true);
    await settingsButton.click();
  });

  test("can edit and submit the blog settings of a configured blog", async ({
    page,
  }) => {
    // Navigate to the settings page
    const settingsButton = page.getByTestId("settings-button");
    await settingsButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    expect(await settingsButton.isVisible()).toBe(true);
    await settingsButton.click();
    await page.getByPlaceholder("Title", { exact: true }).click();
    await page
      .getByPlaceholder("Title", { exact: true })
      .fill("New mocked configured blog page title!");
    await page.getByPlaceholder("Title", { exact: true }).press("Tab");
    await page.getByPlaceholder("Subtitle").click();
    await page
      .getByPlaceholder("Subtitle")
      .fill("New mocked configured subtitle!");
    await page.getByLabel("Author Enabled").getByText("Disabled").click();
    await page.getByLabel("Search").getByText("Disabled").click();
    await page.getByText("Newest to oldest", { exact: true }).click();
    await page.getByTestId("post-per-page-input").click();
    await page.getByTestId("post-per-page-input").fill("6");

    await page.getByText("Not Required").click();
    await page.getByTestId("save-settings-button").nth(1).click();

    await expect(page.locator("div.modal-body code")).toBeVisible();
    const transactionObj = JSON.parse(
      await page.locator("div.modal-body code").innerText()
    );

    const parameters = JSON.parse(transactionObj.community_addon.parameters);
    expect(parameters.title).toBe("New mocked configured blog page title!");
    expect(parameters.subtitle).toBe("New mocked configured subtitle!");
    expect(parameters.authorEnabled).toBe("disabled");
    expect(parameters.searchEnabled).toBe("disabled");
    expect(parameters.orderBy).toBe("timedesc");
    expect(parameters.postPerPage).toBe("6");
    expect(parameters.categoryRequired).toBe("not_required");
    expect(parameters.categoriesEnabled).toBe("enabled");
    expect(parameters.categories).toEqual([
      { category: "News", value: "news" },
      { category: "Guide", value: "guide" },
      { category: "Reference", value: "reference" },
    ]);
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
    await page.goto(blogPageThirdInstance);
    // In which case the author is removed from the blog page
    await waitForTestIdToBeVisible(page, "blog-date");
    const blogAuthor = page.getByTestId("blog-author");
    await expect(blogAuthor).not.toBeVisible();
    // And also from the blog editor
    await page.goto(thirdInstance);
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

  test("can configure how the blog posts are ordered", async ({ page }) => {
    // Go to the Viewer and check if the default is timedesc
    await page.goto(otherInstance); // timedesc

    // Get all the blog posts
    await pauseIfVideoRecording(page);
    const blogCards = page.locator(`[id^="blog-card-"]`);
    const elements = await page.$$(`[data-testid="blog-card-date"]`);
    const numberOfBlogCards = await blogCards.count();

    await waitForTestIdToBeVisible(page, "blog-card-date");

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

  test("can configure the number of blogs to display per page", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // Go to the first blog instance
    // Go to the Viewer
    const configureButton = page.getByTestId("configure-addon-button-x");
    await configureButton.click();
    // this instance has 5 posts per page
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    const blogCards = page.locator(`[id^="blog-card-"]`);
    await blogCards.first().scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    const numberOfBlogCards = await blogCards.count();
    expect(numberOfBlogCards).toBe(5);

    await page.waitForTimeout(2000);

    // Go to the second blog instance
    await page.goto(otherInstance);
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    const blogCardsSecondInstance = page.locator(`[id^="blog-card-"]`);
    await blogCardsSecondInstance.first().scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    // this instance has 100 posts per page
    const numberOfBlogCardsSecondInstance =
      await blogCardsSecondInstance.count();
    expect(numberOfBlogCardsSecondInstance).toBeGreaterThan(10);
    expect(numberOfBlogCardsSecondInstance).toBeLessThanOrEqual(100);

    await page.waitForTimeout(2000);

    // Go to the third blog instance
    await page.goto(thirdInstance);
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    const blogCardsThirdInstance = page.locator(`[id^="blog-card-"]`);

    await blogCardsThirdInstance.first().scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    // this instance has 10 posts per page
    const numberOfBlogCardsThirdInstance = await blogCardsThirdInstance.count();
    expect(numberOfBlogCardsThirdInstance).toBe(10);
  });

  test("should hide categories in the cards by default and when disabled", async ({
    page,
  }) => {
    test.setTimeout(60000);

    // Check that categories are visible in the first blog instance
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    const categoryFieldInCard = page.getByTestId("card-category").first();
    expect(categoryFieldInCard).toBeVisible();

    // Go to the second viewer
    // It is not configured so should not be visible
    await page.goto(otherInstance);
    await pauseIfVideoRecording(page);
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    // Check if the categories are not visible
    expect(categoryFieldInCard).not.toBeVisible();

    // Go tot the third viewer
    await page.goto(thirdInstance);
    await pauseIfVideoRecording(page);
    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);
    // Check if the categories are not visible
    expect(categoryFieldInCard).not.toBeVisible();
  });

  test("should hide the category on the blog page by default and when disabled", async ({
    page,
  }) => {
    await page.goto(blogPage);
    await waitForTestIdToBeVisible(page, "blog-title");
    const category = page.getByTestId("blog-category");
    expect(category).toBeVisible();

    // Go to the second viewer
    await page.goto(blogPageOtherInstance);
    await waitForTestIdToBeVisible(page, "blog-title");
    // Check if the categories are not visible
    expect(category).not.toBeVisible();

    // Go to the third viewer
    await page.goto(blogPageThirdInstance);
    await waitForTestIdToBeVisible(page, "blog-title");
    // Check if the categories are not visible
    expect(category).not.toBeVisible();
  });

  test("should be hidden from the form when categories isn't enabled in the instance", async ({
    page,
  }) => {
    test.setTimeout(60000);

    const firstRow = page.getByTestId("edit-blog-row").first();
    await firstRow.click();

    const categoryDropdown = page.getByTestId("category-dropdown");
    await categoryDropdown.scrollIntoViewIfNeeded();
    expect(categoryDropdown).toBeVisible();

    // Check if the category dropdown is hidden by default
    await page.goto(otherInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();
    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);

    await firstRow.click();

    const descriptionField = page.getByTestId("description-input-field");
    await descriptionField.scrollIntoViewIfNeeded();
    expect(categoryDropdown).not.toBeVisible();

    // Check if the category dropdown is hidden when disabled
    await page.goto(thirdInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");
    await configureButton.click();
    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);

    await firstRow.click();
    await descriptionField.scrollIntoViewIfNeeded();
    expect(categoryDropdown).not.toBeVisible();
  });

  test("should show the configured categories in the form", async ({
    page,
  }) => {
    const firstRow = page.getByTestId("edit-blog-row").first();
    await firstRow.click();

    const categoryDropdown = page.getByTestId("category-dropdown");
    await categoryDropdown.scrollIntoViewIfNeeded();

    await categoryDropdown.click();

    const option = page.locator(`[data-testid^="category-option-"]`);
    const options = await page.$$(`[data-testid^="category-option-"]`);
    const numberOfOptions = await option.count();
    expect(numberOfOptions).toBe(3);

    const categories = ["News", "Guide", "Reference"];

    // check that the innertext of the options is the same as the categories
    const categoryTexts = await Promise.all(
      options.map(async (option) => {
        return await option.innerText();
      })
    );

    expect(categoryTexts).toEqual(categories);
  });

  test("should be require the category to be selected when required", async ({
    page,
  }) => {
    // Click on new blog post button
    const firstRow = page.getByTestId("edit-blog-row").first();
    await firstRow.click();

    const categoryDropdown = page.getByTestId("category-dropdown");
    await categoryDropdown.scrollIntoViewIfNeeded();

    await categoryDropdown.click();

    const option = page.locator(`[data-testid^="category-option-"]`);
    const options = await page.$$(`[data-testid^="category-option-"]`);
    const numberOfOptions = await option.count();
    expect(numberOfOptions).toBe(3);

    // check that the innertext of the options is the same as the categories
    const categoryTexts = await Promise.all(
      options.map(async (option) => {
        return await option.innerText();
      })
    );

    expect(categoryTexts).not.toContain("None");

    await page.goto(fourthInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await waitForSelectorToBeVisible(page, `[id^="edit-blog-selector-"]`);

    // Click on new blog post button
    await firstRow.click();

    await categoryDropdown.scrollIntoViewIfNeeded();

    await categoryDropdown.click();

    const optionsSecondInstance = await page.$$(
      `[data-testid^="category-option-"]`
    );

    // check that the innertext of the options is the same as the categories
    const categoryTextsSecondInstance = await Promise.all(
      optionsSecondInstance.map(async (option) => {
        return await option.innerText();
      })
    );

    expect(categoryTextsSecondInstance).toContain("None");
  });

  test("should not show the categories that are no longer a option", async ({
    page,
  }) => {
    await page.goto(fourthInstance);
    await pauseIfVideoRecording(page);

    await waitForTestIdToBeVisible(page, "configure-addon-button");

    // Check if a category that falls outside of the available categories is hidden
    await waitForTestIdToBeVisible(page, "card-category");

    const categoriesInViewer = page.locator(`[data-testid="card-category"]`);
    const categoriesViewed = await page.$$(`[data-testid="card-category"]`);
    const numberOfCategories = await categoriesInViewer.count();
    // expect(numberOfCategories).toBe(1);

    // check that the innertext of the options is the same as the categories
    const categoryTexts = await Promise.all(
      categoriesViewed.map(async (option) => {
        return await option.innerText();
      })
    );

    console.log({ categoryTexts });
    // expect(categoryTexts).not.toContain("None");
  });
});
