import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import { mockDefaultTabs } from "../util/addons.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=blog-instance-1";

const otherInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=blog-instance-2";

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

    // const editAddonButton = await page
    //   .getByRole("button", { name: " Edit" })
    //   .nth(3);

    // await editAddonButton.scrollIntoViewIfNeeded();

    // Can't find a button with a span inside with the class="bi bi-gear"
    const configureButton = await page.$(".bi.bi-gear");
    expect(configureButton).toBeNull();
  });

  test("should be able to view a blog page", async ({ page }) => {
    await page.goto(blogPage);
    // All cards have a valid date!
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);
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

    const span1 = await page.waitForSelector('span:has-text("Published")', {
      state: "visible",
    });

    const published = page.getByTestId("published-w5cj1y");
    await published.scrollIntoViewIfNeeded();

    const span2 = await page.waitForSelector(
      'span:has-text("First blog of instance 2")',
      {
        state: "visible",
      }
    );

    const publishedBlogDifferentInstance = page.getByTestId(
      "first-blog-of-instance-2-nhasab"
    );
    await publishedBlogDifferentInstance.scrollIntoViewIfNeeded();

    expect(span1.isVisible()).toBeTruthy();
    expect(span2.isVisible()).toBeTruthy();

    await span2.click();

    const blogTitleOfPublishedBlog = await page.waitForSelector(
      'h5:has-text("Published")',
      {
        state: "visible",
      }
    );

    expect(blogTitleOfPublishedBlog.isVisible()).toBeTruthy();

    await span2.click();

    const blogTitleOfAnotherBlogInstance = await page.$(
      'h5:has-text("First blog of instance 2")'
    );

    expect(blogTitleOfAnotherBlogInstance.isVisible()).toBeTruthy();

    // TODO use 2 blog tabs
  });

  test("should load a blog page and its blogs for a given community handle", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/devhub.entity.addon.blog.Viewer?handle=webassemblymusic"
    );

    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const blogCards = await page.$$(blogCardSelector);

    expect(blogCards.length).toBeGreaterThan(0);
  });

  test("should show preview card and page", async ({ page }) => {
    await page.goto(baseUrl);
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

    const tab = await page.getByRole("link", { name: "Blog Instance 1" });

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
    await page.waitForTimeout(6000);

    await page.waitForSelector("#blog-card-published-w5cj1", {
      state: "visible",
    });

    const card = page.getByTestId("published-w5cj1");

    expect(await card.isVisible()).toBeTruthy();

    await page.goto(otherInstance);
  });

  test("should prepopulate the form when a blog is selected from the left", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(
      "/devgovgigs.near/widget/devhub.entity.addon.blog.Configurator?handle=webassemblymusic"
    );

    await page.waitForSelector(`[id^="edit-blog-selector-"]`);

    const blogSelector = `[id^="edit-blog-selector-1993"]`;
    await page.waitForSelector(blogSelector, {
      state: "visible",
    });

    await page.click(blogSelector);

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

      expect(inputValue).not.toBeNull();
    }
  });

  test("should have an empty form if select new blog", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/devhub.entity.addon.blog.Configurator"
    );
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);

    const newBlogSelector = `[id^="create-new-blog"]`;
    await page.waitForSelector(newBlogSelector, {
      state: "visible",
    });
    await page.click(newBlogSelector);

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
    await page.goto(
      "/devgovgigs.near/widget/devhub.entity.addon.blog.Configurator?handle=webassemblymusic"
    );
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);

    await page.waitForSelector(`[id^="edit-blog-selector-"]`);

    const sidebarBlogSelectors = await page.$$(`[id^="edit-blog-selector-"]`);

    expect(sidebarBlogSelectors.length).toBeGreaterThanOrEqual(1);
  });

  test.describe("should be able to edit a blog", () => {
    test("should be able toggle the admin UI", async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(6000);
    });
    test("should be able to save blog as DRAFT", async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(6000);
    });

    test("should be able to cancel editing a blog", async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(6000);
    });
    test("should be able to cancel a new blog", async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(6000);
    });

    test("should be able to publish a blog", async ({ page }) => {
      await page.goto(baseUrl);
      await pauseIfVideoRecording(page);
      await page.waitForTimeout(6000);
    });
  });

  test("should be able to delete a blog", async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);
  });

  test("should show 3 timestamps in the blogoverview", async ({ page }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);
    // TODO There is no row that says "invalid date"
  });

  test("should have a big button when there is no blog data", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(6000);
  });

  test.skip("should show the settings", async ({ page }) => {
    await page.goto(baseUrl);
  });

  test.skip("should show the analytics", async ({ page }) => {
    await page.goto(baseUrl);
  });
});
