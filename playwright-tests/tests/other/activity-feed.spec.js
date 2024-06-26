import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";

test.describe("Non authenticated user's wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("showing posts when not authenticated", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
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
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });

  test("sort is has at least two options", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    await page.locator("#sort").selectOption("recentcommentdesc");
    await pauseIfVideoRecording(page);
    await page.locator("#sort").selectOption("desc");
    await pauseIfVideoRecording(page);
  });

  test("initially loads 10 posts", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");

    // Wait for the page to load more posts
    const posts = page.locator(".post");

    await posts.first().scrollIntoViewIfNeeded();

    // Check that there are more than 10 posts
    expect(await posts.count()).toEqual(10);
  });

  test("loads more than the initial 10 posts", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");

    await page.locator(".post").nth(9).scrollIntoViewIfNeeded();

    // Wait for more than 10 posts to be visible
    await page.waitForFunction(() => {
      return document.querySelectorAll(".post").length > 10;
    });

    // Check that there are more than 10 posts
    const posts = page.locator(".post");
    expect(await posts.count()).toBeGreaterThan(10);
  });

  test("loads a repost in the All Feed and shows 'Reposted by' text", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    // Go to discussions
    await page.getByText("Discussions", { exact: true }).click();
    // Go back to All
    await page.getByText("All", { exact: true }).click();

    // Scroll to a lower post
    await page.locator(".post").nth(9).scrollIntoViewIfNeeded();

    // Wait for the page to load more posts and for a repost to be visible
    await page.waitForSelector('[data-testid="repost"]');

    // Check that at least one post contains the text "Reposted by"
    const el = page.getByTestId("repost");
    expect(el).toBeDefined();
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
    const postLocator = page.locator(".post").first();
    await postLocator.focus();
  });

  test("sort is has at least two options", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    await page.locator("#sort").selectOption("recentcommentdesc");
    await pauseIfVideoRecording(page);
    await page.locator("#sort").selectOption("desc");
    await pauseIfVideoRecording(page);
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
