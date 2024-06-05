import { test, describe, expect } from "@playwright/test";

describe("unauthenticated visitor", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test("should track visiting page visits", async ({ page }) => {
    let trackingRequestSent = false;
    let trackingRequestPostData;
    await page.route("https://eu.posthog.com/capture/", async (route) => {
      const request = await route.request();
      trackingRequestPostData = request.postDataJSON();
      trackingRequestSent = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ status: 1 }) });
    });

    await page.goto("/devhub.near/widget/app");
    while (!trackingRequestSent) {
      await page.waitForTimeout(500);
    }
    expect(trackingRequestSent).toBe(true);
    expect(trackingRequestPostData.api_key).toEqual(
      "01234567890123456789012345678901234567890123456"
    );
    expect(trackingRequestPostData.properties.distinct_id).toEqual(
      "unauthenticated"
    );
  });
});

describe("authenticated visitor", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should track visiting page visits to home", async ({ page }) => {
    let trackingRequestSent = false;
    let trackingRequestPostData;
    await page.route("https://eu.posthog.com/capture/", async (route) => {
      const request = await route.request();
      trackingRequestPostData = request.postDataJSON();
      trackingRequestSent = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ status: 1 }) });
    });

    await page.goto("/devhub.near/widget/app");
    while (!trackingRequestSent) {
      await page.waitForTimeout(500);
    }
    expect(trackingRequestSent).toBe(true);
    expect(trackingRequestPostData.api_key).toEqual(
      "01234567890123456789012345678901234567890123456"
    );
    expect(trackingRequestPostData.properties.distinct_id).toEqual(
      "05e4a3f804a13c08385cc9b8d73cef94e4db2f73c8cbbc89dcee0c8067c91b6a238bf16be5749d6b904749c5a0a8ac7971634b9ee986ac196ddf698c314b6806"
    );
    expect(trackingRequestPostData.properties.page).toEqual("home");
  });

  test("should track visiting page visits to proposals", async ({ page }) => {
    let trackingRequestSent = false;
    let trackingRequestPostData;
    await page.route("https://eu.posthog.com/capture/", async (route) => {
      const request = await route.request();
      trackingRequestPostData = request.postDataJSON();
      trackingRequestSent = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ status: 1 }) });
    });

    await page.goto("/devhub.near/widget/app?page=proposals");
    while (!trackingRequestSent) {
      await page.waitForTimeout(500);
    }
    expect(trackingRequestSent).toBe(true);
    expect(trackingRequestPostData.api_key).toEqual(
      "01234567890123456789012345678901234567890123456"
    );
    expect(trackingRequestPostData.properties.distinct_id).toEqual(
      "05e4a3f804a13c08385cc9b8d73cef94e4db2f73c8cbbc89dcee0c8067c91b6a238bf16be5749d6b904749c5a0a8ac7971634b9ee986ac196ddf698c314b6806"
    );
    expect(trackingRequestPostData.properties.page).toEqual("proposals");
  });

  test("should track visiting page visits to webassembly music community", async ({
    page,
  }) => {
    let trackingRequestSent = false;
    let trackingRequestPostData;
    await page.route("https://eu.posthog.com/capture/", async (route) => {
      const request = await route.request();
      trackingRequestPostData = request.postDataJSON();
      trackingRequestSent = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ status: 1 }) });
    });

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic"
    );
    while (!trackingRequestSent) {
      await page.waitForTimeout(500);
    }
    expect(trackingRequestSent).toBe(true);
    expect(trackingRequestPostData.api_key).toEqual(
      "01234567890123456789012345678901234567890123456"
    );
    expect(trackingRequestPostData.properties.distinct_id).toEqual(
      "05e4a3f804a13c08385cc9b8d73cef94e4db2f73c8cbbc89dcee0c8067c91b6a238bf16be5749d6b904749c5a0a8ac7971634b9ee986ac196ddf698c314b6806"
    );
    expect(trackingRequestPostData.properties.page).toEqual("community");
    expect(trackingRequestPostData.properties.handle).toEqual(
      "webassemblymusic"
    );
  });
});
