import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording, showPageURLInTest } from "../../testUtils.js";

test.describe("share links", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
  });

  test("community share button should create a clean URL", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    await showPageURLInTest(page);

    const shareButton = await page.locator("button", { hasText: "Share" });
    await expect(shareButton).toBeVisible();

    await shareButton.hover();
    await pauseIfVideoRecording(page);
    await shareButton.click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page/community/webassemblymusic"
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);

    await showPageURLInTest(page);
    await expect(await page.getByText("WebAssembly Music")).toBeVisible({
      timeout: 10000,
    });
    await pauseIfVideoRecording(page);
  });
});
