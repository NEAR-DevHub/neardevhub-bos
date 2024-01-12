import { test, expect } from "@playwright/test";

test("should show the proposal page", async ({ page }) => {
  await page.goto("/devgovgigs.near/widget/app?page=proposal");

  // Check if loaded

  await page.goto("/devgovgigs.near/widget/app?page=proposal.index");

  // Check if loaded
});
