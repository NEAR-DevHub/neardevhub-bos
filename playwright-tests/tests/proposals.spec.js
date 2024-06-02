import { test, expect } from "@playwright/test";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import { pauseIfVideoRecording } from "../testUtils.js";
import {
  setCommitWritePermissionDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
} from "../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";
import { mockRpcRequest } from "../util/rpcmock.js";

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
  test("should create a proposal", async ({ page }) => {
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
  test("should add comment on a proposal", async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );
    await page.goto("/devhub.near/widget/app?page=proposal&id=17");
    const widgetSrc =
      "devhub.near/widget/devhub.entity.proposal.ComposeComment";

    const delay_milliseconds_between_keypress_when_typing = 0;
    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    const text = "Comment testing";
    await commentArea.pressSequentially(text, {
      delay: delay_milliseconds_between_keypress_when_typing,
    });
    await commentArea.blur();
    await pauseIfVideoRecording(page);

    const account = "petersalomonsen.near";
    await setCommitWritePermissionDontAskAgainCacheValues({
      page,
      widgetSrc,
      accountId: account,
    });

    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        const args_base64 = postData.params?.args_base64;
        if (transaction_completed && args_base64) {
          const args = atob(args_base64);
          if (
            postData.params.account_id === "social.near" &&
            postData.params.method_name === "get" &&
            args === `{"keys":["${account}/post/**"]}`
          ) {
            const response = await route.fetch();
            const json = await response.json();
            const resultObj = decodeResultJSON(json.result.result);
            resultObj[account].post.main = JSON.stringify({
              text: text,
            });
            json.result.result = encodeResultJSON(resultObj);
            await route.fulfill({ response, json });
            return;
          } else {
            await route.continue();
          }
        } else {
          await route.continue();
        }
      }
    );
    const commentButton = await page.getByRole("button", { name: "Comment" });
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click();
    await expect(
      await page.frameLocator("iframe").locator(".CodeMirror")
    ).toContainText(text);
    const loadingIndicator = await page.locator(".comment-btn-spinner");
    await expect(loadingIndicator).toBeAttached();
    await loadingIndicator.waitFor({ state: "detached", timeout: 10000 });
    await expect(loadingIndicator).not.toBeVisible();
    const transaction_successful_toast = await page.getByText(
      "Comment Submitted Successfully",
      { exact: true }
    );
    await expect(transaction_successful_toast).toBeVisible();

    await expect(transaction_successful_toast).not.toBeAttached();
    await expect(
      await page.frameLocator("iframe").locator(".CodeMirror")
    ).not.toContainText(text);
    await expect(
      await page.frameLocator("iframe").locator(".CodeMirror")
    ).toContainText("Add your comment here...");
    await pauseIfVideoRecording(page);
  });
});
test.describe('Moderator with "Don\'t ask again" enabled', () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-moderator-access-key.json",
  });
  test("should edit proposal timeline", async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(
      page
    );
    await mockRpcRequest({
      page,
      filterParams: {
        method_name: "get_proposal",
      },
      modifyOriginalResultFunction: (originalResult) => {
        originalResult.snapshot.timeline.status = "REVIEW";
        return originalResult;
      },
    });

    await mockTransactionSubmitRPCResponses(
      page,
      async ({
        route,
        request,
        transaction_completed,
        last_receiver_id,
        requestPostData,
      }) => {
        console.log("RPC mock", requestPostData);
        await route.fallback();
      }
    );

    await page.goto("/devhub.near/widget/app?page=proposal&id=17");
    await setDontAskAgainCacheValues({
      page,
      contractId: "devhub.near",
      widgetSrc: "devhub.near/widget/devhub.entity.proposal.Proposal",
      methodName: "edit_proposal_timeline",
    });

    await page.locator(".d-flex > div > .bi").click();
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await page.getByText("Approved", { exact: true }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    const callContractToast = await page.getByText("Sending transaction");
    await expect(callContractToast).toBeVisible();
    await expect(callContractToast).not.toBeAttached();
  });
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });
  test("editing proposal should not be laggy, even if mentioning someone", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=create-proposal");

    const delay_milliseconds_between_keypress_when_typing = 0;
    const titleArea = await page.getByRole("textbox").first();
    await expect(titleArea).toBeEditable();
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
      `The test proposal description. And mentioning @petersal`,
      {
        delay: delay_milliseconds_between_keypress_when_typing,
      }
    );

    await pauseIfVideoRecording(page);

    await page.frameLocator("iframe").getByText("petersalomonsen.near").click();

    await descriptionArea.pressSequentially(`. Also mentioning @m`, {
      delay: delay_milliseconds_between_keypress_when_typing,
    });

    await pauseIfVideoRecording(page);
    await descriptionArea.press("Backspace");
    await pauseIfVideoRecording(page);
    await descriptionArea.press("m");
    await pauseIfVideoRecording(page);
    await descriptionArea.pressSequentially(`egha19.`, {
      delay: delay_milliseconds_between_keypress_when_typing,
    });

    await page.frameLocator("iframe").getByText("megha19.near").click();

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
              "The test proposal description. And mentioning @petersalomonsen.near. Also mentioning @megha19.near",
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

  test("should create a proposal, autolink reference to existing proposal", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=create-proposal");

    const delay_milliseconds_between_keypress_when_typing = 0;
    const titleArea = await page.getByRole("textbox").first();
    await expect(titleArea).toBeEditable();
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
      `The test proposal description. And referencing #2`,
      {
        delay: delay_milliseconds_between_keypress_when_typing,
      }
    );

    await pauseIfVideoRecording(page);

    await page
      .frameLocator("iframe")
      .getByText(
        "#2 DevHub Developer Contributor report by Thomas for 03/11/2024 – 04/12/2024"
      )
      .click();

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
        },
        null,
        1
      )
    );

    await pauseIfVideoRecording(page);
  });
});
