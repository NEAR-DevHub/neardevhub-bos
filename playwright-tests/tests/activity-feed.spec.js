import { test, expect } from "@playwright/test";

test.describe("Non authenticated user's wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("showing posts when not authenticated", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("compose shows for admins and moderators users", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
  });

  test("announcements tab is clickable", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    await page.getByText("Announcements").click();
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });

  test("discussions tab is clickable", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    await page.getByText("Discussions", { exact: true }).click();
    await page.locator(".text-muted > svg").first().click();
  });

  test("sort is has at least two options", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    await page.locator("#sort").selectOption("recentcommentdesc");
    await page.locator("#sort").selectOption("desc");
  });

  test("a post shows in feed", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });

  // SKIPPING
  test.skip("a comment shows on post in feed", async ({ page }) => {
    // This test needs to be revisited if we modify the post / comment
    // At this time comments occur within "near" accountId's widgets with no discernable traits for testing
    await page.goto("/devhub.near/widget/app?page=announcements");
    // only comments have a row class
    const commentsDivSelector = `i[class="bi-chat"]`;
    await page.waitForSelector(commentsDivSelector, {
      state: "visible",
    });
  });
});
