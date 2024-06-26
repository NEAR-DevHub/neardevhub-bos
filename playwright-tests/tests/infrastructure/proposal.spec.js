import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils";

test.describe("Wallet is connected as admin", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });
  test("should show proposal feed", async ({ page }) => {
    await page.goto("/infrastructure-committee.near/widget/app?page=proposals");

    await expect(await page.locator(".proposal-card").first()).toBeVisible();
  });
  test("should create proposal", async ({ page }) => {
    await page.goto("/infrastructure-committee.near/widget/app?page=proposals");

    await page.getByRole("button", { name: " Submit Proposal" }).click();
    await page.getByText("Select Category").click();
    await expect(await page.getByText("Indexers")).toBeVisible({
      timeout: 10000,
    });

    await pauseIfVideoRecording(page);
    await page.getByText("Search RFP").click();
    await page.getByText("# 2 : A Cool RFP").click();
    await expect(
      await page.getByRole("link", { name: "# 2 : A Cool RFP" })
    ).toBeVisible();

    await expect(await page.getByText("Indexers")).not.toBeVisible();
    await expect(page.locator(".badge").first()).toHaveText("Oracles");

    await page.getByRole("textbox").first().fill("The title");

    await page
      .locator('textarea[type="text"]')
      .fill("The excellent proposal summary");
    await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea")
      .pressSequentially("The proposal description. This proposal should win.");

    await page.getByRole("textbox").nth(3).fill("2000");
    await page.getByRole("checkbox").first().click();
    await page.getByText("Submit Draft").click();

    const transactionText = JSON.stringify(
      JSON.parse(await page.locator("div.modal-body code").innerText()),
      null,
      1
    );
    await expect(transactionText).toEqual(
      JSON.stringify(
        {
          labels: [],
          body: {
            proposal_body_version: "V1",
            linked_rfp: 2,
            category: "Infrastructure Committee",
            name: "The title",
            description: "The proposal description. This proposal should win.",
            summary: "The excellent proposal summary",
            linked_proposals: [],
            requested_sponsorship_usd_amount: "2000",
            requested_sponsorship_paid_in_currency: "USDC",
            receiver_account: "frol.near",
            requested_sponsor: "infrastructure-committee.near",
            supervisor: null,
            timeline: {
              status: "DRAFT",
            },
          },
        },
        null,
        1
      )
    );

    await pauseIfVideoRecording(page);
  });
});
