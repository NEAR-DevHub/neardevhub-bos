import { test, expect } from "@playwright/test";

test("should show post history for posts in the feed", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/app");

  // Click on /proposals feed
  await page.getByRole("link", { name: "/proposals feed" }).click();

  // now the url should include app?page=proposal.feed
  const url = await page.url();
  expect(url).toContain("app?page=proposal.feed");
});
