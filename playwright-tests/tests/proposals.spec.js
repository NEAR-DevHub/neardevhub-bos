import { test, expect } from "@playwright/test";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import { pauseIfVideoRecording } from "../testUtils.js";
import { setDontAskAgainCacheValues } from "../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });
  test("should create a prosal", async ({ page }) => {
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

    await page
      .getByPlaceholder("Enter title here.")
      .fill("Test proposal 123456");
    await page
      .getByPlaceholder("Enter summary here.")
      .fill("Test proposal summary 123456789");

    const descriptionArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionArea.focus();
    await descriptionArea.fill("The test proposal description.");

    await pauseIfVideoRecording(page);

    await page.getByPlaceholder("Enter amount").fill("1000");
    await pauseIfVideoRecording(page);
    await page.getByRole("checkbox").first().click();
    await pauseIfVideoRecording(page);
    await page.getByRole("checkbox").nth(1).click();
    await pauseIfVideoRecording(page);

    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        if (postData.params?.method_name === "get_proposals") {
          const response = await route.fetch();
          const json = await response.json();

          if (transaction_completed) {
            console.log(
              "transaction completed, modifying get_proposals result"
            );
            const resultObj = decodeResultJSON(json.result.result);
            resultObj.push({
              proposal_version: "V0",
              id: 8,
              author_id:
                "8566fc4bb16e1a7446b5e9b1b8aea94b5751d5f8c658d7af18d8cdf642d7b31d",
              social_db_post_block_height: "114956244",
              snapshot: {
                editor_id:
                  "8566fc4bb16e1a7446b5e9b1b8aea94b5751d5f8c658d7af18d8cdf642d7b31d",
                timestamp: "1710767750951688236",
                labels: [],
                proposal_body_version: "V0",
                name: "Test proposal ",
                category: "Universities & Bootcamps",
                summary: "Test proposal summary",
                description: "the description",
                linked_proposals: [],
                requested_sponsorship_usd_amount: "3200",
                requested_sponsorship_paid_in_currency: "USDC",
                receiver_account:
                  "8566fc4bb16e1a7446b5e9b1b8aea94b5751d5f8c658d7af18d8cdf642d7b31d",
                requested_sponsor: "neardevdao.near",
                supervisor: "bpolania.near",
                timeline: {
                  status: "REVIEW",
                  sponsor_requested_review: false,
                  reviewer_completed_attestation: false,
                },
              },
              snapshot_history: [],
            });
            json.result.result = encodeResultJSON(resultObj);
          }
          await route.fulfill({ response, json });
        }

        await route.continue();
      }
    );

    const submitButton = await page.getByText("Submit Draft");
    await submitButton.scrollIntoViewIfNeeded();
    await expect(await page.locator(".submit-draft-button")).not.toHaveClass(
      "disabled"
    );

    await submitButton.click();
    const loadingIndicator = await page.locator(
      ".submit-proposal-draft-loading-indicator"
    );
    await expect(loadingIndicator).toBeVisible();
    await expect(
      await page.locator(".submit-draft-button.disabled")
    ).toBeVisible();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method add_proposal"
    );
    await expect(transaction_toast).toBeVisible();

    await transaction_toast.waitFor({ state: "detached", timeout: 10000 });
    await expect(transaction_toast).not.toBeVisible();
    //await loadingIndicator.waitFor({ state: "detached", timeout: 10000 });
    //await expect(loadingIndicator).not.toBeVisible();

    await page.waitForTimeout(100);
    await pauseIfVideoRecording(page);
  });
});
