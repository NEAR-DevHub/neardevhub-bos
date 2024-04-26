import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import { mockDefaultTabs } from "../util/addons.js";

const baseUrl =
  "https://near.org/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=blogv2";

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

  test("Should not see the configure button only blog cards", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await pauseIfVideoRecording(page);
    // Can't find a button with a span inside with the class="bi bi-gear"
  });

  test("Should be able to view a blog page", async ({ page }) => {
    // TODO don't use baseUrl
    await page.goto(baseUrl);
    // All cards have a valid date!
  });

  test("Should only view the blogs of 1 blog instance tab", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    // TODO use 2 blog tabs
  });

  test("should load a blog page and its blogs for a given community handle", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/devhub.entity.addon.blog.Viewer?handle=devhub-test"
    );

    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const blogCards = await page.$$(blogCardSelector);

    expect(blogCards.length).toBeGreaterThan(0);
  });

  test("Should show preview card and page", async ({ page }) => {
    await page.goto(baseUrl);
    // TODO previews have broken date!
  });
});

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("Create blog", async ({ page }) => {
    await page.goto(baseUrl);
    // TODO
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("Should be able to configure the blogv2 addon", async ({ page }) => {
    await page.goto(baseUrl);
  });

  test("should prepopulate the form when a blog is selected from the left", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(
      "/devgovgigs.near/widget/devhub.entity.addon.blog.Configurator?handle=devhub-test"
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
      "/devgovgigs.near/widget/devhub.entity.addon.blog.Configurator?handle=devhub-test"
    );

    await page.waitForSelector(`[id^="edit-blog-selector-"]`);

    const sidebarBlogSelectors = await page.$$(`[id^="edit-blog-selector-"]`);

    expect(sidebarBlogSelectors.length).toBeGreaterThanOrEqual(1);
  });

  test.describe("Should be able to edit a blog", () => {
    test("Should be able toggle the admin UI", async ({ page }) => {
      await page.goto(baseUrl);
    });
    test("Should be able to save blog as DRAFT", async ({ page }) => {
      await page.goto(baseUrl);
    });

    test("Should be able to cancel editing a blog", async ({ page }) => {
      await page.goto(baseUrl);
    });
    test("Should be able to cancel a new blog", async ({ page }) => {
      await page.goto(baseUrl);
    });

    test("Should be able to publish a blog", async ({ page }) => {
      await page.goto(baseUrl);
    });
  });

  test("Should be able to delete a blog", async ({ page }) => {
    await page.goto(baseUrl);
  });

  test("Should show 3 timestamps in the blogoverview", async ({ page }) => {
    await page.goto(baseUrl);
    // TODO There is no row that says "invalid date"
  });

  test("Should have a big button when there is no blog data", async ({
    page,
  }) => {
    await page.goto(baseUrl);
  });

  test.skip("Should show the settings", async ({ page }) => {
    await page.goto(baseUrl);
  });

  test.skip("Should show the analytics", async ({ page }) => {
    await page.goto(baseUrl);
  });
});
