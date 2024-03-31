import { test, expect } from "@playwright/test";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import { pauseIfVideoRecording } from "../testUtils.js";
import { setDontAskAgainCacheValues } from "../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is connected, but not KYC verified", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-not-kyc-verified-account.json",
  });
  test("should be able to blur 'get verified' drop-down", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=create-proposal");

    const titleArea = await page.getByRole("textbox").first();
    await titleArea.fill("Test proposal 123456");
    await titleArea.blur();
    await pauseIfVideoRecording(page);

    await expect(await page.getByText("notkycverified.near")).toBeVisible();

    const getVerifiedButton = await page.locator("#getVerifiedButton");
    await getVerifiedButton.scrollIntoViewIfNeeded();
    await getVerifiedButton.click();

    const getVerifiedDropDown = await page.getByText(
      "KYC Choose this if you are an individual. KYB Choose this if you are a business"
    );
    await expect(getVerifiedDropDown).toBeVisible();
    await pauseIfVideoRecording(page);
    await getVerifiedButton.blur();
    await pauseIfVideoRecording(page);
    await expect(getVerifiedDropDown).not.toBeVisible();
    await pauseIfVideoRecording(page);
  });
});
test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });
  test("should create a prosal", async ({ page }) => {
    test.setTimeout(120000);
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );
    await page.goto("/devhub.near/widget/app?page=proposals");

    const widgetSrc = "devhub.near/widget/devhub.entity.proposal.Editor";

    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "add_proposal",
      contractId: "devhub.near",
    });

    await page.getByRole("button", { name: " New Proposal" }).click();

    const titleArea = await page.getByRole("textbox").first();
    await titleArea.fill("Test proposal 123456");
    await titleArea.blur();
    await pauseIfVideoRecording(page);

    const categoryDropdown = await page.locator(".dropdown-toggle").first();
    await categoryDropdown.click();
    await page.locator(".dropdown-menu > div > div:nth-child(2) > div").click();

    const disabledSubmitButton = await page.locator(
      ".submit-draft-button.disabled"
    );

    const summary = await page.locator('textarea[type="text"]');
    await summary.fill("Test proposal summary 123456789");
    await summary.blur();
    await pauseIfVideoRecording(page);

    const descriptionArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionArea.focus();
    await descriptionArea.fill("The test proposal description.");
    await descriptionArea.blur();
    await pauseIfVideoRecording(page);

    await page.locator('input[type="text"]').nth(2).fill("1000");
    await pauseIfVideoRecording(page);
    await page.getByRole("checkbox").first().click();
    await pauseIfVideoRecording(page);
    await expect(disabledSubmitButton).toBeAttached();
    await page.getByRole("checkbox").nth(1).click();
    await pauseIfVideoRecording(page);
    await expect(disabledSubmitButton).not.toBeAttached();

    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        if (
          transaction_completed &&
          postData.params?.method_name === "get_all_proposal_ids"
        ) {
          const response = await route.fetch();
          const json = await response.json();

          console.log(
            "transaction completed, modifying get_proposal_ids result"
          );
          const resultObj = decodeResultJSON(json.result.result);
          resultObj.push(1);
          console.log(JSON.stringify(resultObj));
          json.result.result = encodeResultJSON(resultObj);

          await route.fulfill({ response, json });
        } else {
          await route.continue();
        }
      }
    );

    const submitButton = await page.getByText("Submit Draft");
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.hover();
    await pauseIfVideoRecording(page);
    await submitButton.click();
    await expect(disabledSubmitButton).toBeAttached();

    const loadingIndicator = await page.locator(
      ".submit-proposal-draft-loading-indicator"
    );
    await expect(loadingIndicator).toBeAttached();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method add_proposal"
    );
    await expect(transaction_toast).toBeVisible();

    await transaction_toast.waitFor({ state: "detached", timeout: 10000 });
    await expect(transaction_toast).not.toBeVisible();
    await loadingIndicator.waitFor({ state: "detached", timeout: 10000 });
    await expect(loadingIndicator).not.toBeVisible();

    await page.waitForTimeout(1000);
    await pauseIfVideoRecording(page);
  });
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });
  test("editing proposal should not be laggy", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=create-proposal");

    const titleArea = await page.getByRole("textbox").first();
    await expect(titleArea).toBeEditable();
    await titleArea.pressSequentially("Test proposal 123456", { delay: 200 });

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
      delay: 200,
    });

    await pauseIfVideoRecording(page);

    const descriptionArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionArea.focus();
    await descriptionArea.fill(`The test proposal description.`);

    await pauseIfVideoRecording(page);

    await page
      .locator('input[type="text"]')
      .nth(2)
      .pressSequentially("12345", { delay: 200 });
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
            description: "The test proposal description.",
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
        },
        null,
        1
      )
    );

    await pauseIfVideoRecording(page);
  });
});
