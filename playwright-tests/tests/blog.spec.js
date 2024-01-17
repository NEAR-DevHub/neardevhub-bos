import { expect, test } from "@playwright/test";

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

test("should prepopulate the form when a blog is selected from the left", async ({
  page,
}) => {
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

    const inputValue = await inputElement.evaluate((element) => element.value);

    expect(inputValue).not.toBeNull();
  }
});

test("should have an empty form if select new blog", async ({ page }) => {
  await page.goto("/devhub.near/widget/devhub.entity.addon.blog.Configurator");

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

    const inputValue = await inputElement.evaluate((element) => element.value);

    expect(inputValue).toBe("");
  }
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
