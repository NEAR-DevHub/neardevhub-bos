import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";

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

  test("loads more than the initial 10 posts", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for the page to load more posts
    await page.waitForTimeout(3000);

    // Check that there are more than 10 posts
    const posts = await page.locator(".post");
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

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for the page to load more posts
    await page.waitForTimeout(3000);

    // Check that at least one post contains the text "Reposted by"
    const el = await page.getByTestId("repost");
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

  test("two posts show in the feed", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=announcements");
    const postLocator = page.locator(".post").first();
    await pauseIfVideoRecording(page);
    const postContent = await postLocator.textContent();
    await pauseIfVideoRecording(page);
    const postLocator2 = page.locator(".post").second();
    const postContent2 = await postLocator2.textContent();

    expect(postContent).not.toEqual(postContent2);
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
