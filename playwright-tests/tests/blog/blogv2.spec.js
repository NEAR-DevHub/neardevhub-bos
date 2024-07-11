import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { mockDefaultTabs } from "../../util/addons.js";
import { mockBlogs } from "../../util/blogs.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

// This blog is mocked in addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:20000/", async (route) => {
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
    const blogCardSelector = '[id^="blog-card-"]';
    await page.waitForSelector(blogCardSelector);

    const card = page.locator(blogCardSelector).first();

    expect(await card.isVisible()).toBeTruthy();

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

    const span1 = await page.waitForSelector('h5:has-text("Test Subscribe")', {
      state: "visible",
      timeout: 10000,
    });

    // Find the first published blog
    const published = page.getByTestId("test-subscribe-mujrt8");
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

  test("should show developer-dao blog via navigation", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=blogv2");
    await page.waitForSelector(`[data-testid^="card-category"]`);

    const categories = await page.$$(`[data-testid^="card-category"]`);

    expect(categories.length).toBeGreaterThan(0);
  });
});
