import { expect, test } from "@playwright/test";
import {
  pauseIfVideoRecording,
  generateRandom6CharUUID,
} from "../testUtils.js";
import { mockDefaultTabs } from "../util/addons.js";
import { mockBlogs } from "../util/blogs.js";
import { setDontAskAgainCacheValues } from "../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";

const baseUrl =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=first-blog";

const otherInstance =
  "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=second-blog";

const communityAccount = "webassemblymusic.community.devhub.near";

// This blog is mocked in addons.js
const blogPage =
  "/devhub.near/widget/app?page=blogv2&id=published-w5cj1y&community=webassemblymusic";

test.beforeEach(async ({ page }) => {
  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    await mockDefaultTabs(route);
  });

  await page.route("https://api.near.social/get", async (route) => {
    await mockBlogs(route);
  });

  // Navigate to the blog page
  await page.goto(baseUrl);

  const configureButton = page.getByTestId("configure-addon-button");
  await configureButton.click();
  await page.waitForSelector("#edit-blog-selector-published-w5cj1y", {
    state: "visible",
  });
  // Go to the settings page
  await page.getByRole("link", { name: "Settings" }).click();
  await pauseIfVideoRecording(page);
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is not connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-not-connected.json",
  });

  test.skip("test the before each", async ({ page }) => {
    // TODO
  });
});

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);

    // TODO update widgetSrc
    const widgetSrc =
      "devhub.near/widget/devhub.entity.addon.blogv2.editor.provider";
    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "set_community_addon",
      contractId: "devhub.near",
    });

    await pauseIfVideoRecording(page);
  });
});

test.describe("Admin wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test.skip("should show the settings", async ({ page }) => {
    await page.goto(baseUrl);
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Settings" }).click();
  });
});
