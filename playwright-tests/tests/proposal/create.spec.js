import { test, expect } from "@playwright/test";

test("should load the proposal create page", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/app?page=proposal.create");

  // Click on /proposals feed
});
