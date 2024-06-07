import { test } from "@playwright/test";

test("should show post history for posts in the feed", async ({ page }) => {
  await page.goto("/devhub.near/widget/app?page=feed");

  // Fill the search by content by to
  const searchInputSelector = 'input.form-control[type="search"]';
  let searchInput = await page.waitForSelector(searchInputSelector, {
    state: "visible",
  });
  await searchInput.fill("zero knowledge");

  await page.waitForSelector('span:has-text("zero knowledge")', {
    state: "visible",
    timeout: 10000,
  });
});
