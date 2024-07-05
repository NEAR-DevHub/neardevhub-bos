import { expect, test } from "@playwright/test";
import {
  pauseIfVideoRecording,
  waitForSelectorToBeVisible,
  waitForTestIdToBeVisible,
} from "../../testUtils.js";
import { setupBlogContentResponses } from "../../util/blogs.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

async function configureSearchAndCategoriesEnabled({
  page,
  categoriesEnabled,
  searchEnabled,
}) {
  await page.route("http://localhost:20000", async (route) => {
    const postData = route.request().postDataJSON();

    if (
      postData.params.account_id === "devhub.near" &&
      postData.params.method_name === "get_community"
    ) {
      const response = await route.fetch();
      const json = await response.json();
      const result = JSON.parse(
        new TextDecoder().decode(new Uint8Array(json.result.result))
      );
      result.addons = [
        ...result.addons,
        {
          addon_id: "blogv2",
          display_name: "First Blog",
          enabled: true,
          id: "blogv2",
          parameters: JSON.stringify({
            title: "Mocked configured blog page title",
            subtitle: "Mocked configured subtitle",
            authorEnabled: "enabled",
            searchEnabled,
            orderBy: "timedesc",
            postPerPage: 100,
            categoriesEnabled,
            categories: [
              { category: "News", value: "news" },
              { category: "Guide", value: "guide" },
              { category: "Reference", value: "reference" },
              { category: "Vehicle", value: "Vehicle" },
              { category: "Tech", value: "Tech" },
              { category: "Philosophy", value: "Philosophy" },
              { category: "Animals", value: "Animals" },
            ],
            categoryRequired: "required",
          }),
        },
      ];

      json.result.result = Array.from(
        new TextEncoder().encode(JSON.stringify(result))
      );
      await route.fulfill({ response, json });
    } else {
      await route.continue();
    }
  });
}

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should filter blog posts from search criteria", async ({ page }) => {
    test.setTimeout(60000);

    const { topics } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      searchEnabled: "enabled",
      categoriesEnabled: "disabled",
    });
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);

    await page.waitForSelector("[placeholder='search blog posts']", {
      state: "visible",
    });

    const searchField = page.getByPlaceholder("search blog posts");
    await expect(searchField).toBeAttached();
    await searchField.scrollIntoViewIfNeeded();

    await waitForSelectorToBeVisible(page, `[id^="blog-card-"]`);

    const blogCards = page.locator(`[id^="blog-card-"]`);
    await blogCards.first().scrollIntoViewIfNeeded();
    const numberOfBlogCards = await blogCards.count();
    expect(numberOfBlogCards).toBeGreaterThan(3);

    for (const topic of topics) {
      const startTime = new Date().getTime();
      const delayBetweenKeypress = 50;
      await searchField.fill("");
      await searchField.pressSequentially(topic, {
        delay: delayBetweenKeypress,
      });

      await page.waitForTimeout(500);
      const blogCards = await page.locator("a div").all();
      await expect(blogCards.length).toBeGreaterThan(3);
      await Promise.all(
        blogCards.map(
          async (blogCard) =>
            await expect(blogCard).toContainText(topic, { ignoreCase: true })
        )
      );
      const endTime = new Date().getTime();
      expect(endTime - startTime).toBeLessThan(8000);
    }
  });
  test("should filter blog posts from category", async ({ page }) => {
    const { categories, topics } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      searchEnabled: "enabled",
      categoriesEnabled: "enabled",
    });
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);
    const categoryDropdown = await page.getByRole("button", {
      name: "Category",
    });
    await categoryDropdown.scrollIntoViewIfNeeded();

    const blogCards = await page.locator("a div").all();
    await expect(blogCards.length).toBeGreaterThan(3);

    for (const category of categories) {
      await categoryDropdown.click();
      await page.locator("li").filter({ hasText: category }).click();
      const blogCards = await page.locator("a div").all();
      await expect(blogCards.length).toBeGreaterThan(3);
      await Promise.all(
        blogCards.map(
          async (blogCard) =>
            await expect(blogCard).toContainText(category, { ignoreCase: true })
        )
      );
    }
    await pauseIfVideoRecording(page);
  });
  test("should be possible to select no category", async ({ page }) => {
    const { categories, blogPosts } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      searchEnabled: "enabled",
      categoriesEnabled: "enabled",
    });
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);
    const categoryDropdown = await page.getByRole("button", {
      name: "Category",
    });
    await categoryDropdown.scrollIntoViewIfNeeded();

    let blogCards = await page.locator("a div").all();
    await expect(blogCards.length).toBeGreaterThan(3);

    const category = categories[1];
    await categoryDropdown.click();
    await page.locator("li").filter({ hasText: category }).click();

    blogCards = await page.locator("span.category").all();

    await expect(blogCards.length).toBeGreaterThan(3);
    await Promise.all(
      blogCards.map(
        async (blogCard, ndx) =>
          await expect(blogCard).toHaveText(category, { ignoreCase: true })
      )
    );

    await categoryDropdown.click();
    await page.locator("li").filter({ hasText: "None" }).click();

    await page.waitForTimeout(500);

    blogCards = await page.locator("span.category").all();
    const blogPostsValues = Object.values(blogPosts);
    expect(
      blogCards.length,
      "Expect to show the amount of blogs that pagination allows for."
    ).toEqual(blogPostsValues.length);

    await Promise.all(
      blogCards.map(
        async (blogCard, ndx) =>
          await expect(blogCard).toHaveText(
            blogPostsValues[blogPostsValues.length - 1 - ndx].metadata.category,
            { ignoreCase: true }
          )
      )
    );

    await pauseIfVideoRecording(page);
  });
  test("should search and limit to a category", async ({ page }) => {
    await configureSearchAndCategoriesEnabled({
      page,
      searchEnabled: "enabled",
      categoriesEnabled: "enabled",
    });
    const { categories, blogPosts } = await setupBlogContentResponses(page);
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);
    const categoryDropdown = await page.getByRole("button", {
      name: "Category",
    });
    await categoryDropdown.scrollIntoViewIfNeeded();

    const searchField = await page.getByPlaceholder("search blog posts");
    const searchCriteria = "The meaning of life";
    await searchField.fill(searchCriteria);

    let blogCards = await page.locator("a div").all();
    await expect(blogCards.length).toBeGreaterThan(3);

    const category = categories[1];
    await categoryDropdown.click();
    await page.locator("li").filter({ hasText: category }).click();

    await page.waitForTimeout(500);
    blogCards = await page.locator("a div").all();

    await expect(blogCards.length).toBeGreaterThan(3);
    await Promise.all(
      blogCards.map(async (blogCard, ndx) => {
        await expect(blogCard).toContainText(category, { ignoreCase: true });
        await expect(blogCard).toContainText(searchCriteria, {
          ignoreCase: true,
        });
      })
    );

    await pauseIfVideoRecording(page);
  });
  test("should search title", async ({ page }) => {
    const { categories } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      searchEnabled: "enabled",
      categoriesEnabled: "enabled",
    });
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);

    const searchField = await page.getByPlaceholder("search blog posts");
    await searchField.scrollIntoViewIfNeeded();
    const searchCriteria = "New Blog Post55";
    await searchField.fill(searchCriteria);

    await page.waitForTimeout(500);
    let blogCards = await page.locator("a div h5").all();

    expect(blogCards.length).toBeGreaterThan(0);

    await Promise.all(
      blogCards.map(async (blogCard, ndx) => {
        await expect(blogCard).toHaveText(searchCriteria, {
          ignoreCase: true,
        });
      })
    );

    await pauseIfVideoRecording(page);
  });
  test("search enabled but not categories", async ({ page }) => {
    const { topics } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      categoriesEnabled: "disabled",
      searchEnabled: "enabled",
    });
    await page.goto(baseUrl);

    await waitForTestIdToBeVisible(page, "search-blog-posts");
    const searchField = page.getByPlaceholder("search blog posts");
    await expect(searchField).toBeAttached();
    await searchField.scrollIntoViewIfNeeded();

    const categoryDropdown = await page.getByRole("button", {
      name: "Category",
    });
    await expect(categoryDropdown).not.toBeAttached();
  });
  test("categories enabled but not search", async ({ page }) => {
    const { topics } = await setupBlogContentResponses(page);
    await configureSearchAndCategoriesEnabled({
      page,
      categoriesEnabled: "enabled",
      searchEnabled: "disabled",
    });
    await page.goto(baseUrl);
    await waitForTestIdToBeVisible(page, "dropdown");
    const categoryDropdown = await page.getByRole("button", {
      name: "Category",
    });
    await expect(categoryDropdown).toBeAttached();
    await categoryDropdown.scrollIntoViewIfNeeded();

    const searchField = await page.getByPlaceholder("search blog posts");
    await expect(searchField).not.toBeAttached();
  });
});
