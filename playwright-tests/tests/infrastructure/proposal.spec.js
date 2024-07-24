import { test as base, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils";

const test = base.extend({
  // Define an option and provide a default value.
  // We can later override it in the config.
  account: ["infrastructure-committee.near", { option: true }],
  proposalAuthorAccountId: ["megha19.near", { option: true }],
});

test.describe("Wallet is connected as admin", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-admin.json",
  });
  test("should show proposal feed", async ({ page }) => {
    await page.goto("/infrastructure-committee.near/widget/app?page=proposals");

    await expect(await page.locator(".proposal-card").first()).toBeVisible({
      timeout: 10000,
    });
  });
  test("should create proposal", async ({ page }) => {
    await page.goto("/infrastructure-committee.near/widget/app?page=proposals");

    await page
      .getByRole("button", { name: " Submit Proposal" })
      .click({ timeout: 10000 });
    await page.getByText("Select Category").click();
    await expect(await page.getByText("Indexers")).toBeVisible({
      timeout: 10000,
    });

    await pauseIfVideoRecording(page);
    await page.getByText("Search RFP").click();
    await page.getByText("# 0 : A Cool RFP").click();
    await expect(
      await page.getByRole("link", { name: "# 0 : A Cool RFP" })
    ).toBeVisible();

    await expect(await page.getByText("Indexers")).not.toBeVisible();
    await expect(page.locator(".badge").first()).toHaveText("Other");

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
          labels: ["Other"],
          body: {
            proposal_body_version: "V1",
            linked_rfp: 0,
            category: "Infrastructure Committee",
            name: "The title",
            description: "The proposal description. This proposal should win.",
            summary: "The excellent proposal summary",
            linked_proposals: [],
            requested_sponsorship_usd_amount: "2000",
            requested_sponsorship_paid_in_currency: "USDC",
            receiver_account: "theori.near",
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

  test("should show relevant users in mention autocomplete", async ({
    page,
    account,
  }) => {
    await page.goto(`/${account}/widget/app?page=proposal&id=1`);

    await page.waitForSelector(`iframe`, {
      state: "visible",
    });

    const proposal = page.getByRole("link", { name: "hemera.near" }).first();
    await proposal.waitFor();
    await proposal.scrollIntoViewIfNeeded();

    const comment = page
      .getByRole("link", { name: "trechriron71.near" })
      .first();
    await comment.waitFor();
    await comment.scrollIntoViewIfNeeded();

    const heading = page.getByText("Add a comment");
    await heading.waitFor();
    await heading.scrollIntoViewIfNeeded();

    await page.waitForTimeout(5000);

    const delay_milliseconds_between_keypress_when_typing = 0;
    const commentEditor = page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentEditor.focus();
    await commentEditor.pressSequentially(
      `Make sure relevant users show up in a mention. @`,
      {
        delay: delay_milliseconds_between_keypress_when_typing,
      }
    );

    await pauseIfVideoRecording(page);
    const iframe = page.frameLocator("iframe");
    const liFrameLocators = iframe.frameLocator(
      'ul[id="mentiondropdown"] > li'
    );
    const liLocators = await liFrameLocators.owner().all();
    const expected = [
      "hemera.near", // author,
      "infrastructure-committee.near", //  requested_sponsor,
      "trechriron71.near", // comment author,
      "as2.near",
    ];
    let mentionSuggestions = [];
    for (let i = 0; i < liLocators.length; i++) {
      const text = await liLocators[i].innerText();
      mentionSuggestions.push(text);
    }

    // When I manually test, it shows the correct 4 users
    expect(mentionSuggestions.slice(0, 4)).toEqual(expected);
    await pauseIfVideoRecording(page);
  });
});
