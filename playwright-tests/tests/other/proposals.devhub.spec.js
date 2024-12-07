import { test as base, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { MOCK_RPC_URL } from "../../util/rpcmock.js";

const test = base.extend({
  // Define an option and provide a default value.
  // We can later override it in the config.
  account: ["devhub.near", { option: true }],
  proposalAuthorAccountId: ["megha19.near", { option: true }],
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

let acceptedTermsVersion = 122927956;
async function getCurrentBlockHeight(page) {
  // set current block height for accepted terms and conditions
  await page.route(MOCK_RPC_URL, async (route) => {
    const request = route.request();
    const requestPostData = request.postDataJSON();
    if (
      requestPostData?.method === "block" &&
      requestPostData?.params?.finality === "optimistic"
    ) {
      const response = await route.fetch();
      const json = await response.json();
      json.result.header.height = acceptedTermsVersion;
      await route.fulfill({ response, json });
    } else {
      await route.continue();
    }
  });
}

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test("should show relevant users in mention autocomplete", async ({
    page,
    account,
  }) => {
    await page.goto(`/${account}/widget/app?page=proposal&id=112`);

    await page.waitForSelector(`iframe`, {
      state: "visible",
    });

    const comment = page.getByRole("link", { name: "geforcy.near" });
    await comment.scrollIntoViewIfNeeded();
    await expect(comment).toBeVisible();
    await page.waitForTimeout(5000);

    const delay_milliseconds_between_keypress_when_typing = 0;
    const commentEditor = page
      .frameLocator("iframe")
      .last()
      .locator(".CodeMirror textarea");
    await commentEditor.focus();
    await commentEditor.pressSequentially(
      `Make sure relevant users show up in a mention. @`,
      {
        delay: delay_milliseconds_between_keypress_when_typing,
      }
    );

    await pauseIfVideoRecording(page);
    const iframe = page.frameLocator("iframe").last();
    const liFrameLocators = iframe.frameLocator(
      'ul[id="mentiondropdown"] > li'
    );
    const liLocators = await liFrameLocators.owner().all();
    const expected = [
      "thomasguntenaar.near", // author,
      "theori.near", // supervisor,
      "neardevdao.near", //  requested_sponsor,
      "geforcy.near", // comment author,
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

  test("should show only valid input in amount field and show error for invalid", async ({
    page,
    account,
  }) => {
    test.setTimeout(120000);
    const delay_milliseconds_between_keypress_when_typing = 0;
    await page.goto(`/${account}/widget/app?page=create-proposal`);
    const input = page.locator('input[type="text"]').nth(2);
    const errorText = await page.getByText(
      "Please enter the nearest positive whole number."
    );
    await input.pressSequentially("12345de", {
      delay: delay_milliseconds_between_keypress_when_typing,
    });
    await expect(errorText).toBeVisible();
    // clear input field
    for (let i = 0; i < 7; i++) {
      await input.press("Backspace", {
        delay: delay_milliseconds_between_keypress_when_typing,
      });
    }
    await input.pressSequentially("12334", {
      delay: delay_milliseconds_between_keypress_when_typing,
    });
    await expect(errorText).toBeHidden();
    await pauseIfVideoRecording(page);
  });

  test("should create a proposal, autolink reference to existing proposal", async ({
    page,
    account,
  }) => {
    test.setTimeout(120000);
    await getCurrentBlockHeight(page);
    await page.goto(`/${account}/widget/app?page=create-proposal`);

    const delay_milliseconds_between_keypress_when_typing = 0;
    const titleArea = await page.getByRole("textbox").first();
    await expect(titleArea).toBeEditable({ timeout: 10_000 });
    await titleArea.pressSequentially("Test proposal 123456", {
      delay: delay_milliseconds_between_keypress_when_typing,
    });

    await pauseIfVideoRecording(page);

    const categoryDropdown = await page.locator(".dropdown-toggle").first();
    await categoryDropdown.click();
    await page.locator(".dropdown-menu > div > div:nth-child(2) > div").click();

    const disabledSubmitButton = await page.locator(
      ".submit-draft-button.disabled"
    );

    const summary = await page.locator('textarea[type="text"]');
    await expect(summary).toBeEditable();
    await summary.pressSequentially("Test proposal summary 123456789", {
      delay: delay_milliseconds_between_keypress_when_typing,
    });

    await pauseIfVideoRecording(page);

    const descriptionArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionArea.focus();
    await descriptionArea.pressSequentially(
      `The test proposal description. And referencing #`,
      {
        delay: delay_milliseconds_between_keypress_when_typing,
      }
    );
    await descriptionArea.pressSequentially("2", { delay: 10 });
    await pauseIfVideoRecording(page);

    await page
      .frameLocator("iframe")
      .getByText(
        "#2 DevHub Developer Contributor report by Thomas for 03/11/2024 – 04/12/2024"
      )
      .click({ timeout: 10000 });

    await page.locator('input[type="text"]').nth(2).pressSequentially("12345", {
      delay: delay_milliseconds_between_keypress_when_typing,
    });
    await pauseIfVideoRecording(page);
    await page.getByRole("checkbox").first().click();
    await pauseIfVideoRecording(page);
    await expect(disabledSubmitButton).toBeAttached();
    await page.getByRole("checkbox").nth(1).click();
    await pauseIfVideoRecording(page);
    await expect(disabledSubmitButton).not.toBeAttached();

    const submitButton = await page.getByText("Submit Draft");
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.hover();
    await pauseIfVideoRecording(page);
    await submitButton.click();
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
            proposal_body_version: "V0",
            name: "Test proposal 123456",
            description:
              "The test proposal description. And referencing [#2 DevHub Developer Contributor report by Thomas for 03/11/2024 – 04/12/2024](https://near.social/devhub.near/widget/app?page=proposal&id=2)",
            category: "DevDAO Platform",
            summary: "Test proposal summary 123456789",
            linked_proposals: [],
            requested_sponsorship_usd_amount: "12345",
            requested_sponsorship_paid_in_currency: "USDC",
            receiver_account: "efiz.near",
            supervisor: null,
            requested_sponsor: "neardevdao.near",
            timeline: {
              status: "DRAFT",
            },
          },
          accepted_terms_and_conditions_version: acceptedTermsVersion,
        },
        null,
        1
      )
    );

    await pauseIfVideoRecording(page);
  });

  test.describe("filter proposals using different mechanism", () => {
    test.beforeEach(async ({ page, account }) => {
      await page.goto(`/${account}/widget/app?page=proposals`);
      expect(page.locator(".proposal-card").first()).toBeVisible({
        timeout: 10000,
      });
    });
    test("should filter proposals by categories", async ({ page, account }) => {
      test.setTimeout(60000);
      const category = "DevDAO Operations";
      await page.getByRole("button", { name: "Category" }).click();
      await page.getByRole("list").getByText(category).click();
      await expect(
        page.getByRole("button", { name: `Category : ${category}` })
      ).toBeVisible();
      const loader = page.getByRole("img", { name: "loader" });
      expect(loader).toBeHidden({ timeout: 10000 });
      const categoryTag = await page.locator(".purple-bg").first();
      await expect(categoryTag).toContainText(category);
    });

    test("should filter proposals by timeline", async ({ page }) => {
      test.setTimeout(60000);
      const stage = "Funded";
      await page.getByRole("button", { name: "Stage" }).click();
      await page.getByRole("list").getByText(stage).click();
      await expect(
        page.getByRole("button", { name: `Stage : ${stage}` })
      ).toBeVisible();
      const loader = page.getByRole("img", { name: "loader" });
      expect(loader).toBeHidden({ timeout: 10000 });
      const timelineTag = await page.locator(".green-tag").first();
      await expect(timelineTag).toContainText(stage.toUpperCase());
    });

    test("should filter proposals by author", async ({ page }) => {
      test.setTimeout(60000);
      const accountId = "megha19.near";
      const profileName = "Megha";
      await page.getByRole("button", { name: "Author" }).click();
      await page.getByRole("list").getByText(accountId).click();
      await expect(
        page.getByRole("button", { name: `Author : ${accountId}` })
      ).toBeVisible();
      const loader = page.getByRole("img", { name: "loader" });
      expect(loader).toBeHidden({ timeout: 10000 });
      await expect(page.getByText(`By ${profileName} ･`).first()).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should filter proposals by search text", async ({ page }) => {
      test.setTimeout(60000);
      const term = "DevHub Developer Contributor report by Megha";
      const input = await page.getByPlaceholder("Search by content");
      await input.click();
      await input.fill(term);
      await input.press("Enter");
      const loader = page.getByRole("img", { name: "loader" });
      expect(loader).toBeHidden({ timeout: 10000 });
      const element = page.locator(`:has-text("${term}")`).nth(1);
      await expect(await element.innerText()).toContain(term);
      await expect(element).toBeVisible({ timeout: 10_000 });
    });
  });
});
