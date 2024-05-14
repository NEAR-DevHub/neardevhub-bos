import { expect, test } from "@playwright/test";
import {
  pauseIfVideoRecording,
  generateRandom6CharUUID,
} from "../testUtils.js";
import { mockDefaultTabs } from "../util/addons.js";
import { mockBlogs } from "../util/blogs.js";
import { setDontAskAgainCacheValues } from "../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

const otherInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=second-blog";

const communityAccount = "webassemblymusic.community.devhub.near";

// This blog is mocked in addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

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

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should not see the configure button only blog cards", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);

    const configureButton = await page.$(".bi.bi-gear");
    expect(configureButton).toBeNull();
  });

  test("should be able to view a blog page", async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);

    await page.goto(blogPage);
    await pauseIfVideoRecording(page);

    const subtitle = ".subtitle";

    await page.waitForSelector(subtitle, {
      state: "visible",
    });
    // await subtitle.scrollIntoViewIfNeeded();
  });

  test("should only view the blogs of the blog instance who's tab is currently active", async ({
    page,
  }) => {
    test.setTimeout(30000);
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    const span1 = await page.waitForSelector('h5:has-text("PublishedBlog")', {
      state: "visible",
    });

    // Find the first published blog
    const published = page.getByTestId("published-w5cj1y");
    await published.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    // Go to the other blog instance by clicking on the tab
    await page.getByRole("link", { name: "Second Blog" }).first().click();
    const span2 = await page.waitForSelector(
      'h5:has-text("First blog of instance")',
      {
        state: "visible",
      }
    );

    // Make sure the other blog instance show the other blog
    const publishedBlogDifferentInstance = page.getByTestId(
      "first-blog-of-instance-2-nhasab"
    );
    await publishedBlogDifferentInstance.scrollIntoViewIfNeeded();

    expect(span1.isVisible()).toBeTruthy();
    expect(span2.isVisible()).toBeTruthy();
  });
});

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
    // test before each

    await page.waitForTimeout(4000);
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
    await page.getByText("Guide").click();
    await page.getByText("News", { exact: true }).click();
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
    // Switch to publish instead of draft
    await page.getByTestId("toggle-dropdown").click();
    await page
      .getByTestId("submit-button-option-PUBLISH")
      .locator("div")
      .first()
      .click();
    const postButton = page
      .getByTestId("submit-blog-button")
      .getByText("Publish");
    // Show loading indicator
    const loadingIndicator = page
      .locator(".submit-blog-loading-indicator")
      .first();

    await expect(loadingIndicator).not.toBeVisible();

    // Click post button
    await postButton.click();
    await expect(loadingIndicator).toBeVisible();
    await pauseIfVideoRecording(page);

    // Expect the post button to be disabled
    const parentDiv = page.getByTestId("parent-submit-blog-button");
    const parentDivClasses =
      "select-header d-flex gap-1 align-items-center submit-draft-button disabled";
    await expect(parentDiv).toHaveClass(parentDivClasses);

    await expect(page.locator("div.modal-body code")).not.toBeVisible();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();

    await pauseIfVideoRecording(page);
    // Maybe longer?
    await page.waitForTimeout(5000);
    // Wait for the transaction to complete
    await expect(transaction_toast).not.toBeVisible();
    await expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
    await expect(is_transaction_completed).toBe(true);
  });

  test("Update a blog", async ({ page }) => {
    // test before each

    await page.waitForTimeout(4000);
    // Start configuring the blog addon
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await pauseIfVideoRecording(page);

    // Click a blog to edit
    await page.getByRole("cell", { name: "PublishedBlog" }).click();
    // Change the category
    await page.getByText("News", { exact: true }).click();
    await page.getByText("Reference").click();

    // Change the content
    // await page.frameLocator("iframe").getByRole("textbox").fill("# Content");
    // TODO Change the status to draft
    // Status to draft ..

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

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method set_community_socialdb"
    );
    await expect(transaction_toast).toBeVisible();

    // Wait for the transaction to complete
    await expect(transaction_toast).not.toBeVisible();
    await expect(loadingIndicator).not.toBeVisible();

    await pauseIfVideoRecording(page);
    await expect(is_transaction_completed).toBe(true);
  });
  test("Delete a blog", async ({ page }) => {
    // test before each

    const idOfBlogToDelete = "published-w5cj1y";
    const blogTitle = "PublishedBlog";

    await page.waitForTimeout(4000);
    // Start configuring the blog addon
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await pauseIfVideoRecording(page);

    // Click a blog to edit
    await page.getByRole("cell", { name: blogTitle }).click();

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

          // Mock the deletion of the first blog id
          resultObj[communityAccount].blog[idOfBlogToDelete] = null;

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
        } else if (
          // Replace the remote components with local developed components
          requestPostData.params &&
          requestPostData.params.account_id === "social.near" &&
          requestPostData.params.method_name === "get"
        ) {
          const social_get_key = JSON.parse(
            atob(requestPostData.params.args_base64)
          ).keys[0];

          const response = await route.fetch({
            url: "https://rpc.mainnet.near.org/",
          });
          const devComponents = (
            await fetch("http://localhost:3030").then((r) => r.json())
          ).components;
          const json = await response.json();

          // Replace component with local component
          if (devComponents[social_get_key]) {
            const social_get_key_parts = social_get_key.split("/");
            const devWidget = {};
            devWidget[social_get_key_parts[0]] = { widget: {} };
            devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] =
              devComponents[social_get_key].code;
            json.result.result = Array.from(
              new TextEncoder().encode(JSON.stringify(devWidget))
            );
          }

          await route.fulfill({ response, json });
          return;
        }

        await route.continue();
      }
    );

    // Click delete button
    const deleteButton = page.getByTestId("delete-blog-button");
    await deleteButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await deleteButton.click();

    // Show loading indicator
    // const loadingIndicator = await page.locator(".delete-blog-spinner").first();
    // await expect(loadingIndicator).toBeVisible();

    // const isDisabled = deleteButton.classList.contains("disabled");
    // await expect(isDisabled).toBe(true);
    await pauseIfVideoRecording(page);

    await page.waitForSelector("button[data-testid='new-blog-post-button']", {
      state: "visible",
    });

    await expect(is_transaction_completed).toBe(true);
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should be able to configure the blogv2 addon", async ({ page }) => {
    await page.goto(baseUrl);

    await pauseIfVideoRecording(page);

    await page.waitForSelector("#blog-card-published-w5cj1y", {
      state: "visible",
    });

    const card = page.getByTestId("published-w5cj1y");

    expect(await card.isVisible()).toBeTruthy();

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.getByTestId("new-blog-post-button").click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("cell", { name: "PublishedBlog" }).click();
    await page.getByPlaceholder("Title", { exact: true }).click();
  });

  test("should have an empty form if select new blog, except author", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.waitForSelector("#blog-card-published-w5cj1y", {
      state: "visible",
    });

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    // Create a new blog
    await page.getByTestId("new-blog-post-button").click();

    await pauseIfVideoRecording(page);
    await page.waitForTimeout(2000);

    const formSelector = `[id^="blog-editor-form"]`;
    await page.waitForSelector(formSelector, {
      state: "visible",
    });

    const inputFieldSelectors = [
      'input[name="title"]',
      'input[name="subtitle"]',
      'textarea[name="description"]',
    ];
    for (const inputSelector of inputFieldSelectors) {
      await page.waitForSelector(inputSelector, {
        state: "visible",
      });
      const inputElement = await page.$(inputSelector);

      const inputValue = await inputElement.evaluate(
        (element) => element.value
      );

      expect(inputValue).toBe("");
    }
    // Check default author
    const authorInputSelector = 'input[name="author"]';
    const authorInputElement = await page.$(authorInputSelector);
    const authorInputValue = await authorInputElement.evaluate(
      (element) => element.value
    );
    expect(authorInputValue).toBe("petersalomonsen.near");
    // Check publish date to be automatically today
    const dateInputSelector = 'input[name="date"]';
    const dateInputElement = await page.$(dateInputSelector);
    const dateInputValue = await dateInputElement.evaluate(
      (element) => element.value
    );
    const publishedAtDate = new Date();
    const year = publishedAtDate.getFullYear();
    const month = (publishedAtDate.getMonth() + 1).toString().padStart(2, "0");
    const day = publishedAtDate.getDate().toString().padStart(2, "0");
    const initialFormattedDate = year + "-" + month + "-" + day;
    expect(dateInputValue).toBe(initialFormattedDate);
  });

  test("should load blogs in the sidebar for a given handle", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(2000);

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.waitForSelector(`[id^="edit-blog-selector-"]`);

    const sidebarBlogSelectors = await page.$$(`[id^="edit-blog-selector-"]`);

    expect(sidebarBlogSelectors.length).toBeGreaterThanOrEqual(1);
  });

  test.describe("should be able to edit a blog", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(2000);

      const configureButton = page.getByTestId("configure-addon-button");
      await configureButton.click();
      await page.waitForSelector(`[id^="edit-blog-selector-"]`, {
        state: "visible",
      });
    });

    test("should be able toggle the admin UI off to see the BlogOverview", async ({
      page,
    }) => {
      const configureButton = page.getByTestId("configure-addon-button-x");
      await configureButton.click();
      await page.waitForSelector(`[id^="blog-card-"]`, {
        state: "visible",
      });
    });
    test("should be able to save blog as DRAFT", async ({ page }) => {
      await page.getByTestId("new-blog-post-button").click();

      await page.getByPlaceholder("Title", { exact: true }).click();
      await page.getByPlaceholder("Title", { exact: true }).fill("Title");
      await page.getByPlaceholder("Title", { exact: true }).press("Tab");
      await page.getByPlaceholder("Subtitle").click();
      await page.getByPlaceholder("Subtitle").fill("Subtitle");
      await page.getByText("Guide").click();
      await page.getByText("News", { exact: true }).click();
      await page.getByPlaceholder("Description").click();
      await page.getByPlaceholder("Description").fill("Description");
      await page.getByPlaceholder("Description").press("Tab");
      await page.getByPlaceholder("Author").fill("Author");
      await page.getByPlaceholder("Author").press("Tab");
      await page.locator('input[name="date"]').fill("1998-05-03");

      await page.locator('input[name="date"]').press("Tab");
      await page.frameLocator("iframe").getByRole("textbox").fill("# Content");

      const submitButton = page.getByTestId("submit-blog-button");
      const parentButton = page.getByTestId("parent-submit-blog-button");

      await submitButton.scrollIntoViewIfNeeded();
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(1000);
      await submitButton.click();
      await parentButton.click();

      const transactionObj = JSON.parse(
        await page.locator("div.modal-body code").innerText()
      );

      const blogId = Object.keys(transactionObj.data.blog)[0];
      expect(transactionObj.data.blog[blogId].metadata.title).toBe("Title");
      expect(transactionObj.data.blog[blogId].metadata.publishedAt).toBe(
        "1998-05-03"
      );
      expect(transactionObj.data.blog[blogId].metadata.createdAt).toBe(
        new Date().toISOString().slice(0, 10)
      );
      expect(transactionObj.data.blog[blogId].metadata.updatedAt).toBe(
        new Date().toISOString().slice(0, 10)
      );
      expect(transactionObj.data.blog[blogId].metadata.subtitle).toBe(
        "Subtitle"
      );
      expect(transactionObj.data.blog[blogId].metadata.description).toBe(
        "Description"
      );
      expect(transactionObj.data.blog[blogId].metadata.author).toBe("Author");
      expect(transactionObj.data.blog[blogId].metadata.communityAddonId).toBe(
        "blogv2"
      );
      expect(transactionObj.data.blog[blogId].metadata.status).toBe("DRAFT");
      expect(transactionObj.data.blog[blogId].metadata.category).toBe("news");
    });

    // TODO test
    test("should not be able to save a blog if any field is missing", async ({
      page,
    }) => {
      await page.getByTestId("new-blog-post-button").click();
      const parentDivClasses =
        "select-header d-flex gap-1 align-items-center submit-draft-button disabled";

      const submitButton = page.getByTestId("submit-blog-button");
      const parentDiv = page.getByTestId("parent-submit-blog-button");
      await expect(parentDiv).toHaveClass(parentDivClasses);

      await page.getByPlaceholder("Title", { exact: true }).click();
      await page.getByPlaceholder("Title", { exact: true }).fill("Title");
      await page.getByPlaceholder("Title", { exact: true }).press("Tab");
      await expect(parentDiv).toHaveClass(parentDivClasses);

      await page.getByPlaceholder("Subtitle").click();
      await page.getByPlaceholder("Subtitle").fill("Subtitle");
      await expect(parentDiv).toHaveClass(parentDivClasses);
      await page.getByText("Guide").click();
      await page.getByText("News", { exact: true }).click();

      await page.getByPlaceholder("Description").click();
      await page.getByPlaceholder("Description").fill("Description");
      await page.getByPlaceholder("Description").press("Tab");
      await expect(parentDiv).toHaveClass(parentDivClasses);

      await page.getByPlaceholder("Author").fill("Author");
      await page.getByPlaceholder("Author").press("Tab");
      await expect(parentDiv).toHaveClass(parentDivClasses);

      await page.locator('input[name="date"]').fill("1998-05-03");
      await page.locator('input[name="date"]').press("Tab");
      await expect(parentDiv).toHaveClass(parentDivClasses);

      await page.frameLocator("iframe").getByRole("textbox").fill("# Content");

      await expect(submitButton).toBeEnabled();

      await page.getByText("Save Draft").click();
    });

    test("should be able to cancel editing a blog", async ({ page }) => {
      // Click on the first row this blog title is called "PublishedBlog"
      await page.getByRole("cell", { name: "PublishedBlog" }).click();

      await page.getByRole("button", { name: "Cancel" }).click();
      await page.waitForSelector(`[id^="edit-blog-selector-"]`, {
        state: "visible",
      });
      const configureButton = page.getByTestId("configure-addon-button-x");
      await configureButton.click();
      await page.waitForSelector(`[id^="blog-card-"]`, {
        state: "visible",
      });
    });
    test("should be able to cancel a new blog", async ({ page }) => {
      await page.getByTestId("new-blog-post-button").click();
      await page.getByRole("button", { name: "Cancel" }).click();
      await page.waitForSelector(`[id^="edit-blog-selector-"]`, {
        state: "visible",
      });
      const configureButton = page.getByTestId("configure-addon-button-x");
      await configureButton.click();
      await page.waitForSelector(`[id^="blog-card-"]`, {
        state: "visible",
      });
    });

    test("should be able to publish a blog", async ({ page }) => {
      await page.getByTestId("new-blog-post-button").click();
      // Fill the title
      await page.getByPlaceholder("Title", { exact: true }).click();
      await page.getByPlaceholder("Title", { exact: true }).fill("Title");
      await page.getByPlaceholder("Title", { exact: true }).press("Tab");
      //  Fill the subtitle
      await page.getByPlaceholder("Subtitle").click();
      await page.getByPlaceholder("Subtitle").fill("Subtitle");
      // Select News category
      await page.getByText("Guide").click();
      await page.getByText("News", { exact: true }).click();
      await page.getByPlaceholder("Description").click();
      await page.getByPlaceholder("Description").fill("Description");
      await page.getByPlaceholder("Description").press("Tab");
      await page.getByPlaceholder("Author").fill("Author");
      await page.getByPlaceholder("Author").press("Tab");
      await page.locator('input[name="date"]').fill("1998-05-03");
      await page.locator('input[name="date"]').press("Tab");
      await page.frameLocator("iframe").getByRole("textbox").fill("# Content");

      const publishToggle = page.getByTestId("toggle-dropdown");
      await publishToggle.scrollIntoViewIfNeeded();
      await pauseIfVideoRecording(page);
      await publishToggle.click();

      const publishOption = page.getByTestId("submit-button-option-PUBLISH");

      await publishOption.click();

      const publishButton = page.getByTestId("submit-blog-button");

      await publishButton.click();

      const transactionObj = JSON.parse(
        await page.locator("div.modal-body code").innerText()
      );
      const blogId = Object.keys(transactionObj.data.blog)[0];

      expect(transactionObj.data.blog[blogId].metadata.status).toBe("PUBLISH");
    });
  });

  test("should be able to delete a blog", async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);

    await page.waitForSelector("#blog-card-published-w5cj1y", {
      state: "visible",
    });

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.getByRole("cell", { name: "PublishedBlog" }).click();

    await pauseIfVideoRecording(page);
    await page.waitForTimeout(2000);

    const deleteButton = page.getByTestId("delete-blog-button");
    await deleteButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await deleteButton.click();

    const transactionObj = JSON.parse(
      await page.locator("div.modal-body code").innerText()
    );
    const blogId = Object.keys(transactionObj.data.blog)[0];

    await expect(page.locator("div.modal-body code")).toHaveText(
      JSON.stringify(
        {
          handle: "webassemblymusic",
          data: {
            blog: {
              [blogId]: {
                "": null,
                metadata: {
                  title: null,
                  createdAt: null,
                  updatedAt: null,
                  publishedAt: null,
                  status: null,
                  subtitle: null,
                  description: null,
                  author: null,
                  id: null,
                  category: null,
                },
              },
            },
          },
        },
        null,
        2
      )
    );
  });

  test("should show 3 timestamps in the BlogOverview", async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForSelector("#blog-card-published-w5cj1y", {
      state: "visible",
    });

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.waitForSelector("#edit-blog-selector-published-w5cj1y", {
      state: "visible",
    });

    const createdAtColumn = page.getByTestId("createdAt");
    const updatedAtColumn = page.getByTestId("updatedAt");
    const publishedAtColumn = page.getByTestId("publishedAt");

    expect(createdAtColumn.isVisible()).toBeTruthy();
    expect(updatedAtColumn.isVisible()).toBeTruthy();
    expect(publishedAtColumn.isVisible()).toBeTruthy();
  });

  test.skip("should show the settings", async ({ page }) => {
    await page.goto(baseUrl);
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Settings" }).click();
  });

  test.skip("should show the analytics", async ({ page }) => {
    await page.goto(baseUrl);
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();
    await page.waitForSelector("#edit-blog-selector-published-w5cj1y", {
      state: "visible",
    });
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Analytics" }).click();
    // Test if it opens a new tab to posthog url
  });
});
