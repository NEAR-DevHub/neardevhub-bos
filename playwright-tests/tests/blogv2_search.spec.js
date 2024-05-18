import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=blogv2";

async function setupBlogContentResponses(page) {
  const topics = [
    "cows",
    "cars",
    "sheep",
    "birds",
    "computers",
    "blockchain technology",
    "Artificial intelligence",
    "search for extra terrestrial life",
    "the meaning of life",
  ];
  const categories = ["Animals", "Tech", "Vehicle", "Philosophy"];

  await page.route("https://api.near.social/get", async (route) => {
    const request = route.request();
    const requestBody = request.postDataJSON();

    if (
      requestBody.keys[0] === "webassemblymusic.community.devhub.near/blog/**"
    ) {
      const blogPosts = {};
      for (let n = 0; n < 100; n++) {
        const topic = topics[n % topics.length];
        const blogDate = new Date(2024, 0, 1);
        blogDate.setDate(n);
        blogPosts["new-blog-post-cg" + n] = {
          "": `# Blog post ${n + 1}
This is an article about ${topic}.
`,
          metadata: {
            title: "New Blog Post" + n,
            createdAt: blogDate.toJSON(),
            updatedAt: blogDate.toJSON(),
            publishedAt: blogDate.toJSON(),
            status: "PUBLISH",
            subtitle: `${topic.substring(0, 1).toUpperCase()}${topic.substring(
              1
            )}`,
            description: "Description" + n,
            author: "Author",
            communityAddonId: "blogv2",
            category: categories[n % categories.length],
          },
        };
      }

      const blogResults = {
        "webassemblymusic.community.devhub.near": {
          blog: blogPosts,
        },
      };
      await route.fulfill({
        headers: { "content-type": "application/json" },
        body: JSON.stringify(blogResults, null, 1),
      });
    } else {
      await route.continue();
    }
  });
  return { categories, topics };
}

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should filter blog posts from search criteria", async ({ page }) => {
    const { topics } = await setupBlogContentResponses(page);
    await page.goto(baseUrl);

    await page.waitForSelector(".nav-item", {
      state: "visible",
    });

    await pauseIfVideoRecording(page);

    const searchField = await page.getByPlaceholder("search blog posts");
    await expect(searchField).toBeAttached();
    await searchField.scrollIntoViewIfNeeded();

    while (true) {
      const blogCards = await page.locator("a div").all();
      try {
        await expect(blogCards.length).toBeGreaterThan(3);
        break;
      } catch (e) {}
    }
    for (const topic of topics) {
      const startTime = new Date().getTime();
      const delayBetweenKeypress = 50;
      await searchField.press("Control+a");
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
      expect(endTime - startTime).toBeLessThan(5000);
    }
  });
  test("should filter blog posts from category", async ({ page }) => {
    const { categories, topics } = await setupBlogContentResponses(page);
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
});
