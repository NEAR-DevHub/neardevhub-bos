import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import { mockDefaultTabs } from "../util/addons.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

const otherInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=second-blog";

// This blog is mocked in addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

test.beforeEach(async ({ page }) => {
  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    await mockDefaultTabs(route);
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
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    const span1 = await page.waitForSelector('h5:has-text("Published")', {
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

  test("Create blog", async ({ page }) => {
    await page.goto(baseUrl);

    await pauseIfVideoRecording(page);

    // const config = await page.waitForSelector(".bi.bi-gear");

    const tab = await page.getByRole("link", { name: "First Blog" });

    await tab.waitFor({ state: "visible" });

    await tab.click();

    // await page.getByRole("button", { name: "" }).click();

    await page.waitForTimeout(4000);
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

    await page.getByRole("button", { name: " New Blog Post" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("cell", { name: "Published" }).click();
    await page.getByPlaceholder("Title", { exact: true }).click();
  });

  test("should have an empty form if select new blog", async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector("#blog-card-published-w5cj1y", {
      state: "visible",
    });

    const configureButton = page.getByTestId("configure-addon-button");
    await configureButton.click();

    // Create a new blog
    await page.getByRole("button", { name: " New Blog Post" }).click();

    await pauseIfVideoRecording(page);
    await page.waitForTimeout(2000);

    const formSelector = `[id^="blog-editor-form"]`;
    await page.waitForSelector(formSelector, {
      state: "visible",
    });

    const inputFieldSelectors = [
      'input[name="title"]',
      'input[name="subtitle"]',
      'input[name="description"]',
      'input[name="author"]',
      'input[name="date"]',
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
      await page.getByRole("button", { name: " New Blog Post" }).click();

      await page.getByPlaceholder("Title", { exact: true }).click();
      await page.getByPlaceholder("Title", { exact: true }).fill("Title");
      await page.getByPlaceholder("Title", { exact: true }).press("Tab");
      await page.getByPlaceholder("Subtitle").fill("Subtitle");
      await page.getByPlaceholder("Subtitle").press("Tab");
      await page.getByRole("combobox").press("Tab");
      await page.getByPlaceholder("Description").fill("Description");
      await page.getByPlaceholder("Description").press("Tab");
      await page.getByPlaceholder("Author").fill("Author");
      await page.getByPlaceholder("Author").press("Tab");
      await page.locator('input[name="date"]').fill("1998-05-03");
      await page.locator('input[name="date"]').press("Tab");
      await page.frameLocator("iframe").getByRole("textbox").fill("# Content");
      await page.getByText("Save Draft").click();

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
    });

    test("should be able to cancel editing a blog", async ({ page }) => {
      // Click on the first row this blog title is called "Published"
      await page.getByRole("cell", { name: "Published" }).click();

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
      await page.getByRole("button", { name: " New Blog Post" }).click();
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
      await page.getByRole("button", { name: " New Blog Post" }).click();

      await page.getByPlaceholder("Title", { exact: true }).click();
      await page.getByPlaceholder("Title", { exact: true }).fill("Title");
      await page.getByPlaceholder("Title", { exact: true }).press("Tab");
      await page.getByPlaceholder("Subtitle").fill("Subtitle");
      await page.getByPlaceholder("Subtitle").press("Tab");
      await page.getByRole("combobox").press("Tab");
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

    await page.getByRole("cell", { name: "Published" }).click();

    const deleteButton = page.getByRole("button", { name: " Delete" });
    deleteButton.scrollIntoViewIfNeeded();
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
