import { test, expect } from "@playwright/test";

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });
  test("should go to homepage and click header links", async ({ page }) => {
    await page.goto("/infrastructure-committee.near/widget/app");

    const aboutHeaderLink = await page.getByRole("link", { name: "About" });
    await expect(aboutHeaderLink).toBeVisible();
    await aboutHeaderLink.click();
    await expect(await page.locator(".content-container")).toContainText(
      "Introduction"
    );

    const proposalsHeaderLink = await page.getByRole("link", {
      name: "Proposals",
    });
    await expect(proposalsHeaderLink).toBeVisible();
    await proposalsHeaderLink.click();
    await expect(await page.locator(".content-container")).toContainText(
      "Feed"
    );

    const rfpsHeaderLink = await page.getByRole("link", { name: "RFPs" });
    await expect(rfpsHeaderLink).toBeVisible();
    await rfpsHeaderLink.click();
    await expect(await page.locator(".content-container")).toContainText("RFP");

    await expect(
      await page.getByRole("link", { name: "Admin" })
    ).not.toBeAttached();
  });
});

test.describe("Wallet is connected as admin", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });
  test("should go to homepage and click admin header links", async ({
    page,
  }) => {
    await page.goto("/infrastructure-committee.near/widget/app");

    const adminHeaderLink = await page.getByRole("link", { name: "Admin" });
    await expect(adminHeaderLink).toBeVisible();
    await adminHeaderLink.click();
    await expect(
      await page.getByRole("tab", { name: "Moderators" })
    ).toBeVisible();
  });
});
