import { expect, test } from "@playwright/test";
import { githubDevHubBOSLabelsCache } from "../util/apicache.js";
import { pauseIfVideoRecording } from "../testUtils";

test.describe("Wallet is connected as community admin", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });

  test("should open github addon configuration", async ({ page }) => {
    await githubDevHubBOSLabelsCache(page);
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=devhub-platform&tab=github"
    );
    await page.getByRole("button", { name: "" }).click();
    await page
      .getByTestId("-repoURL")
      .fill("https://github.com/near/neardevhub-widgets/");
    await pauseIfVideoRecording(page);
    await page.getByTestId("-title").fill("NEAR DevHUB BOS");
    await pauseIfVideoRecording(page);
    await page.getByTestId("-description").fill("NEAR DevHUB Kanban board");
    await pauseIfVideoRecording(page);
    await page.getByLabel("Issue").click();
    await pauseIfVideoRecording(page);
    await page.getByRole("button", { name: " New column" }).click();
    await pauseIfVideoRecording(page);
    await page.getByLabel("Title").nth(1).fill("Bugs");
    await pauseIfVideoRecording(page);
    await page
      .getByPlaceholder("WG-, draft, review, proposal,")
      .pressSequentially("bug");
    await pauseIfVideoRecording(page);
    await page.getByLabel("bug").click();
    await pauseIfVideoRecording(page);
    await page.getByRole("tab", { name: "Preview" }).click();
    const cardheaders = await page.locator(".card-header .card-link");
    await cardheaders.first().waitFor({ state: "visible", timeout: 20000 });
    await expect(await cardheaders.count()).toBeGreaterThan(0);
    await pauseIfVideoRecording(page);
  });
});
