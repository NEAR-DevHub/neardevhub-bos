import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockBlogs } from "../../util/blogs.js";
const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

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

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should be able to configure the blogv2 addon", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(baseUrl);

    await pauseIfVideoRecording(page);

    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const card = page.locator(blogCardSelector).first();

    expect(await card.isVisible()).toBeTruthy();

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    await page.getByTestId("new-blog-post-button").click();
    await page.getByRole("button", { name: "Cancel" }).click();

    const blogRowSelector = '[id^="edit-blog-selector-"]';
    await page.waitForSelector(blogRowSelector);

    const row = page.locator(blogRowSelector).first();

    await row.click();
    await page.getByPlaceholder("Title", { exact: true }).click();
  });

  test("should have an empty form if select new blog, except author", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    const blogCardSelector = '[id^="blog-card-"]';

    await page.waitForSelector(blogCardSelector, {
      state: "visible",
    });

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    // Create a new blog
    await page.getByTestId("new-blog-post-button").click();

    await pauseIfVideoRecording(page);

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
      await page.getByText("News").first().click();
      await page.getByText("Guide", { exact: true }).click();
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
      expect(transactionObj.data.blog[blogId].metadata.category).toBe("guide");
    });

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
      await page.getByText("News").first().click();
      await page.getByText("Guide", { exact: true }).click();

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
      await page.getByText("News").first().click();
      await page.getByText("Guide", { exact: true }).click();
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

      const transactionObj = JSON.parse(
        await page.locator("div.modal-body code").innerText()
      );
      const blogId = Object.keys(transactionObj.data.blog)[0];

      expect(transactionObj.data.blog[blogId].metadata.status).toBe("PUBLISH");
    });
  });

  test("should be able to delete a blog", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(baseUrl);

    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const card = page.locator(blogCardSelector).first();

    expect(await card.isVisible()).toBeTruthy();

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    const blogRowSelector = '[id^="edit-blog-selector-"]';
    await page.waitForSelector(blogRowSelector);

    const row = page.locator(blogRowSelector).first();

    await pauseIfVideoRecording(page);
    await row.click();

    const deleteButton = await page.getByTestId("delete-blog-button");
    await expect(deleteButton).toBeAttached();
    await deleteButton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    await deleteButton.click();

    await page.getByRole("button", { name: "Ready to Delete" }).click();

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
                  communityAddonId: null,
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

    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const card = page.locator(blogCardSelector).first();

    expect(await card.isVisible()).toBeTruthy();
    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    const blogRowSelector = '[id^="edit-blog-selector-"]';
    await page.waitForSelector(blogRowSelector);

    const row = page.locator(blogRowSelector).first();

    await row.click();
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
