import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockBlogs, blogs } from "../../util/blogs.js";
import { setDontAskAgainCacheValues } from "../../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../../util/transaction.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

const communityAccount = "webassemblymusic.community.devhub.near";

test.beforeEach(async ({ page }) => {
  await page.route(MOCK_RPC_URL, async (route) => {
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

  test("Create a blog", async ({ page }) => {
    // Start configuring the blog addon
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await pauseIfVideoRecording(page);
    // Click new blog button
    await page.getByTestId("new-blog-post-button").click();
    // Fill the title
    await page.getByPlaceholder("Title", { exact: true }).click();
    const blogTitle = "the-blog-title";
    await page.getByPlaceholder("Title", { exact: true }).fill(blogTitle);
    await page.getByPlaceholder("Title", { exact: true }).press("Tab");
    // Fill the subtitle
    await page.getByPlaceholder("Subtitle").click();
    await page.getByPlaceholder("Subtitle").fill("Subtitle");
    // Choose the category
    await page.getByPlaceholder("Description").scrollIntoViewIfNeeded();
    await page.getByText("News").first().click();
    await page.getByText("Guide", { exact: true }).click();
    // Fill the description
    await page.getByPlaceholder("Description").click();
    const descriptionText = "A very specific description";
    await page.getByPlaceholder("Description").fill(descriptionText);
    await page.getByPlaceholder("Description").press("Tab");
    // Fill the author
    const author = "thomasguntenaar.near";
    await page.getByPlaceholder("Author").fill(author);
    await page.getByPlaceholder("Author").press("Tab");
    // Fill the date
    const publishedDate = "1998-05-03";
    await page.locator('input[name="date"]').fill("1998-05-03");
    await page.locator('input[name="date"]').press("Tab");
    // Fill the content
    const content = "# Content";
    await page.frameLocator("iframe").getByRole("textbox").fill(content);

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
                parameters:
                  '{"title":"Mocked configured blog page title",\
                  "subtitle":"Mocked configured subtitle",\
                  "authorEnabled": "enabled",\
                  "searchEnabled": "enabled",\
                  "orderBy": "timeasc",\
                  "postPerPage": 5,\
                  "categoriesEnabled": "enabled",\
                  "categories": ["news", "guide", "reference"],\
                  "categoryRequired": false}',
              },
              {
                addon_id: "blogv2",
                display_name: "Second Blog",
                enabled: true,
                id: "blogv2instance2",
                parameters: "{}",
              },
              {
                addon_id: "blogv2",
                display_name: "Third Blog",
                enabled: true,
                id: "g1709r",
                parameters:
                  '{"title": "WebAssemblyMusic",\
                    "subtitle": "Stay up to date with the community blog",\
                    "authorEnabled": "disabled",\
                    "searchEnabled": "disabled",\
                    "orderBy": "alpha",\
                    "postPerPage": 10,\
                    "categoriesEnabled": "enabled",\
                    "categories": [{\
                            "category": "News",\
                            "value": "news"},\
                        {\
                          "category": "Olivier",\
                          "value": "olivier"}],\
                    "categoryRequired": "not_required"\
                  }',
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
    // Switch to publish instead of draft
    await page.getByTestId("toggle-dropdown").click();

    // Expect the indicator to not be visible
    const loadingIndicator = page
      .locator(".submit-blog-loading-indicator")
      .first();

    await expect(loadingIndicator).not.toBeVisible();

    // Click on publish
    await page
      .getByTestId("submit-button-option-PUBLISH")
      .locator("div")
      .first()
      .click();

    await expect(loadingIndicator).toBeVisible();

    // Expect the post button to be disabled
    const parentDiv = page.getByTestId("parent-submit-blog-button");
    const parentDivClasses =
      "select-header d-flex gap-1 align-items-center submit-draft-button disabled";
    await expect(parentDiv).toHaveClass(parentDivClasses);

    await expect(page.locator("div.modal-body code")).not.toBeVisible();

    const transaction_toast = page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();

    await pauseIfVideoRecording(page);
    // Wait for the transaction to complete
    await expect(transaction_toast).not.toBeVisible();
    await expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
    expect(is_transaction_completed).toBe(true);
  });

  test("Update a blog", async ({ page }) => {
    // test before each

    // Start configuring the blog addon
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await pauseIfVideoRecording(page);

    // Click a blog to edit
    await page.getByRole("cell", { name: "PublishedBlog" }).click();
    // Change the category
    await page.getByText("News", { exact: true }).click();
    await page.getByText("Reference").click();

    // Mock transaction here
    let is_transaction_completed = false;
    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const requestPostData = request.postDataJSON();
        const args_base64 = requestPostData.params?.args_base64;

        if (transaction_completed && args_base64) {
          // Check if the transaction is completed
          is_transaction_completed = true;
        }
        // This is to intercept the asyncView call to get the blog data
        // It's different from the Social.get call because they use different endpoints
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

          resultObj[communityAccount].blog[
            "published-w5cj1y"
          ].metadata.category = "reference";

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
                parameters: "{categories:['news','guide','reference']}",
              },
              {
                addon_id: "blogv2",
                display_name: "Second Blog",
                enabled: true,
                id: "blogv2instance2",
                parameters: "{categories:['news','guide','reference']}",
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

    // Click post button
    const postButton = page
      .getByTestId("submit-blog-button")
      .getByText("Publish");
    const loadingIndicator = await page
      .locator(".submit-blog-loading-indicator")
      .first();

    await expect(loadingIndicator).not.toBeVisible();

    // Show loading indicator
    await postButton.click();

    await expect(loadingIndicator).toBeVisible();

    // Expect the post button to be disabled
    const parentDiv = page.getByTestId("parent-submit-blog-button");
    const parentDivClasses =
      "select-header d-flex gap-1 align-items-center submit-draft-button disabled";
    await expect(parentDiv).toHaveClass(parentDivClasses);

    await expect(page.locator("div.modal-body code")).not.toBeVisible();

    const transaction_toast = page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();

    // Wait for the transaction to complete
    await expect(transaction_toast).not.toBeVisible();
    await expect(loadingIndicator).not.toBeVisible({ timeout: 10000 });

    await pauseIfVideoRecording(page);
    await expect(is_transaction_completed).toBe(true);
  });

  test("Delete a blog", async ({ page }) => {
    // test before each

    // Start configuring the blog addon
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await pauseIfVideoRecording(page);

    // Click a blog to edit
    const blogRowSelector = '[id^="edit-blog-selector-"]';
    await page.waitForSelector(blogRowSelector);
    const row = page.locator(blogRowSelector).first();
    await row.click();

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
          resultObj[communityAccount].blog = blogs;

          const blogId = "published-w5cj1y2";

          if (is_transaction_completed) {
            resultObj[communityAccount].blog[blogId] = null;
          }
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
                parameters: "{categories:['news','guide','reference']}",
              },
              {
                addon_id: "blogv2",
                display_name: "Second Blog",
                enabled: true,
                id: "blogv2instance2",
                parameters: "{categories:['news','guide','reference']}",
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

    // Click delete button
    const deleteButton = await page.getByTestId("delete-blog-button");
    await expect(deleteButton).toBeAttached();
    await deleteButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await deleteButton.click();

    await page.getByRole("button", { name: "Ready to Delete" }).click();
    // Show loading indicator
    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();
    await expect(deleteButton).toBeDisabled();

    await pauseIfVideoRecording(page);

    await page.waitForSelector("button[data-testid='new-blog-post-button']", {
      state: "visible",
    });

    expect(is_transaction_completed).toBe(true);
  });
});
