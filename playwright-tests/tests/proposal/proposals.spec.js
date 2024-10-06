import { test as base, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { setCacheValue, setDontAskAgainCacheValues } from "../../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../../util/transaction.js";
import { MOCK_RPC_URL, mockRpcRequest } from "../../util/rpcmock.js";

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

test.describe("Wallet is connected, but not KYC verified", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-not-kyc-verified-account.json",
  });
  test("should be able to blur 'get verified' drop-down", async ({
    page,
    account,
  }) => {
    test.setTimeout(120000);
    await page.goto(`/${account}/widget/app?page=create-proposal`);

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
  test("should create a proposal", async ({ page, account }) => {
    test.setTimeout(120000);

    const proposalSubmitterAccount = "petersalomonsen.near";

    await page.goto(`/${account}/widget/app?page=proposals`);

    const widgetSrc =
      account === "infrastructure-committee.near"
        ? `${account}/widget/components.proposals.Editor`
        : `${account}/widget/devhub.entity.proposal.Editor`;

    await setCacheValue({
      page,
      key: JSON.stringify({
        action: "ViewCall",
        contractId: account,
        methodName: "get_all_proposal_ids",
      }),
      value: [0, 1, 2, 3, 4],
    });

    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "add_proposal",
      contractId: account,
    });

    await page.getByRole("button", { name: " Submit Proposal" }).click();

    const proposalTitle = "Test proposal 123456";
    const proposalDescription = "The test proposal description.";
    const titleArea = await page.getByRole("textbox").first();
    await titleArea.fill(proposalTitle);
    await titleArea.blur();
    await pauseIfVideoRecording(page);

    const categoryDropdown = await page.locator(".dropdown-toggle", {
      hasText: "Select Category",
    });
    await categoryDropdown.click();
    await page.locator(".dropdown-menu > div > div:nth-child(2) > div").click();

    const summary = await page.locator('textarea[type="text"]');
    await summary.fill("Test proposal summary 123456789");
    await summary.blur();
    await pauseIfVideoRecording(page);

    const descriptionArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await descriptionArea.focus();
    await descriptionArea.fill(proposalDescription);
    await descriptionArea.blur();
    await pauseIfVideoRecording(page);

    const proposalAmount = "1000";
    await page.locator('input[type="text"]').nth(2).fill(proposalAmount);
    await pauseIfVideoRecording(page);
    const consentCheckBoxes = await page.getByRole("checkbox");
    await consentCheckBoxes.first().click();
    await pauseIfVideoRecording(page);

    const disabledSubmitButton = await page.locator(
      ".submit-draft-button.disabled"
    );
    if ((await consentCheckBoxes.count()) === 2) {
      await expect(disabledSubmitButton).toBeAttached();
      await page.getByRole("checkbox").nth(1).click();
      await pauseIfVideoRecording(page);
    }
    await expect(disabledSubmitButton).not.toBeAttached();

    let newProposalId = 0;
    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        if (postData.params?.method_name === "get_all_proposal_ids") {
          const response = await route.fetch();
          const json = await response.json();

          await new Promise((resolve) => setTimeout(() => resolve(), 4000));
          const resultObj = decodeResultJSON(json.result.result);
          newProposalId = resultObj[resultObj.length - 1] + 1;
          if (transaction_completed) {
            resultObj.push(newProposalId);
          }
          json.result.result = encodeResultJSON(resultObj);

          await route.fulfill({ response, json });
        } else if (
          postData.params?.method_name === "get_proposal" &&
          postData.params.args_base64 ===
            btoa(JSON.stringify({ proposal_id: newProposalId }))
        ) {
          postData.params.args_base64 = btoa(
            JSON.stringify({ proposal_id: newProposalId - 1 })
          );
          const response = await route.fetch({
            postData: JSON.stringify(postData),
          });
          const json = await response.json();

          let resultObj = decodeResultJSON(json.result.result);

          resultObj = {
            proposal_version: "V0",
            id: newProposalId,
            author_id: proposalSubmitterAccount,
            social_db_post_block_height: "128860426",
            snapshot: {
              editor_id: proposalSubmitterAccount,
              timestamp: "1727265468109441208",
              labels: [],
              proposal_body_version: "V2",
              name: proposalTitle,
              category: "DevDAO Platform",
              summary: "summary",
              description: proposalDescription,
              linked_proposals: [],
              requested_sponsorship_usd_amount: proposalAmount,
              requested_sponsorship_paid_in_currency: "USDT",
              receiver_account: proposalSubmitterAccount,
              requested_sponsor: "neardevdao.near",
              supervisor: "theori.near",
              timeline: {
                timeline_version: "V1",
                status: "DRAFT",
                sponsor_requested_review: false,
                reviewer_completed_attestation: false,
                kyc_verified: false,
              },
              linked_rfp: null,
            },
            snapshot_history: [
              {
                editor_id: proposalSubmitterAccount,
                timestamp: "1727265421865873611",
                labels: [],
                proposal_body_version: "V0",
                name: proposalTitle,
                category: "DevDAO Platform",
                summary: "summary",
                description: proposalDescription,
                linked_proposals: [],
                requested_sponsorship_usd_amount: proposalAmount,
                requested_sponsorship_paid_in_currency: "USDT",
                receiver_account: proposalSubmitterAccount,
                requested_sponsor: "neardevdao.near",
                supervisor: "theori.near",
                timeline: {
                  status: "DRAFT",
                },
              },
            ],
          };

          json.result.result = encodeResultJSON(resultObj);

          await route.fulfill({ response, json });
        } else if (
          postData.params?.method_name === "is_allowed_to_edit_proposal" &&
          postData.params.args_base64 ===
            btoa(
              JSON.stringify({
                proposal_id: newProposalId,
                editor: proposalSubmitterAccount,
              })
            )
        ) {
          await route.fulfill({
            json: {
              jsonrpc: "2.0",
              result: {
                result: encodeResultJSON(true),
                logs: [],
                block_height: 17817336,
                block_hash: "4qkA4sUUG8opjH5Q9bL5mWJTnfR4ech879Db1BZXbx6P",
              },
              id: "dontcare",
            },
          });
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
      `Calling contract ${account} with method add_proposal`
    );
    await expect(transaction_toast).toBeVisible();

    await transaction_toast.waitFor({ state: "detached", timeout: 10000 });
    await expect(transaction_toast).not.toBeVisible();
    await loadingIndicator.waitFor({ state: "detached", timeout: 10000 });
    await expect(loadingIndicator).not.toBeVisible();

    if (account === "infrastructure-committee.near") {
      await page.getByRole("button", { name: "View Proposal" }).click();
    }
    await expect(await page.getByText(`#${newProposalId}`)).toBeVisible();
    await expect(await page.getByText("DRAFT", { exact: true })).toBeVisible();

    await expect(
      await page.getByRole("button", { name: "Edit" })
    ).toBeVisible();

    await pauseIfVideoRecording(page);
  });
});

test.describe('Moderator with "Don\'t ask again" enabled', () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-moderator-access-key.json",
  });
  test("should edit proposal timeline from review to decision stage with KYC verified", async ({
    page,
    account,
  }) => {
    test.setTimeout(70000);
    let isTransactionCompleted = false;
    const isInfrastructureCommittee =
      account === "infrastructure-committee.near";

    await mockRpcRequest({
      page,
      filterParams: {
        method_name: "get_proposal",
      },
      modifyOriginalResultFunction: (originalResult) => {
        originalResult.snapshot.timeline.status = "REVIEW";

        if (isTransactionCompleted) {
          const lastSnapshot =
            originalResult.snapshot_history[
              originalResult.snapshot_history.length - 1
            ];
          lastSnapshot.timeline.status = "REVIEW";

          const newSnapshot = Object.assign({}, originalResult.snapshot);
          newSnapshot.timeline.status = "APPROVED";
          newSnapshot.timestamp = (
            BigInt(new Date().getTime()) * 1_000_000n
          ).toString();
          originalResult.snapshot = newSnapshot;
          originalResult.snapshot_history.push(lastSnapshot);
        }

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
        isTransactionCompleted = transaction_completed;
        await route.fallback();
      }
    );

    await page.goto(
      `/${account}/widget/app?page=proposal&id=${
        isInfrastructureCommittee ? "4" : "17"
      }`
    );

    const widgetSrc = isInfrastructureCommittee
      ? `${account}/widget/components.proposals.Proposal`
      : `${account}/widget/devhub.entity.proposal.Proposal`;

    await setDontAskAgainCacheValues({
      page,
      contractId: account,
      widgetSrc,
      methodName: isInfrastructureCommittee
        ? "edit_proposal_timeline"
        : "edit_proposal_versioned_timeline",
    });

    const firstStatusBadge = await page
      .locator("div.fw-bold.rounded-2.p-1.px-2")
      .first();
    await expect(firstStatusBadge).toHaveText("REVIEW", { timeout: 10000 });
    await page.locator(".d-flex > div > .bi").click();

    await page
      .locator("label")
      .filter({ hasText: "Sponsor verifies KYC/KYB" })
      .locator("xpath=preceding-sibling::*[1]")
      .check();

    await page.getByRole("button", { name: "Review", exact: true }).click();
    await page.getByText("Approved", { exact: true }).first().click();

    await pauseIfVideoRecording(page);

    const saveButton = await page.getByRole("button", { name: "Save" });
    await saveButton.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Save" }).click();

    const callContractToast = await page.getByText("Sending transaction");
    await expect(callContractToast).toBeVisible();
    await expect(callContractToast).not.toBeAttached();
    let timeLineStatusSubmittedToast;
    if (!isInfrastructureCommittee) {
      timeLineStatusSubmittedToast = await page
        .getByText("Timeline status submitted successfully")
        .first();
      await expect(timeLineStatusSubmittedToast).toBeVisible();
    }
    await expect(firstStatusBadge).toHaveText("APPROVED");

    await firstStatusBadge.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    if (!isInfrastructureCommittee) {
      const lastLogItem = await page.locator(
        "div.flex-1.gap-1.w-100.text-wrap.text-muted.align-items-center",
        { hasText: /.*s ago/ }
      );
      await expect(lastLogItem).toContainText(
        "moved proposal from REVIEW to APPROVED",
        { timeout: 10000 }
      );
      await lastLogItem.scrollIntoViewIfNeeded();
      await expect(timeLineStatusSubmittedToast).not.toBeAttached();
      await pauseIfVideoRecording(page);
    }
  });

  test("should not be able to move proposal timeline to decision stage without approving KYC in review stage", async ({
    page,
    account,
  }) => {
    test.setTimeout(60000);

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
    await page.goto(`/${account}/widget/app?page=proposal&id=17`);

    const firstStatusBadge = await page
      .locator("div.fw-bold.rounded-2.p-1.px-2")
      .first();
    await expect(firstStatusBadge).toHaveText("REVIEW", { timeout: 10000 });
    await page.locator(".d-flex > div > .bi").click();

    await page.getByTestId("Sponsor verifies KYC/KYB").uncheck();
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await page.getByText("Approved", { exact: true }).first().click();

    const saveButton = await page.getByRole("button", { name: "Save" });
    await saveButton.scrollIntoViewIfNeeded();
    await expect(saveButton).toBeDisabled();
  });
});

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });
  test("editing proposal should not be laggy, even if mentioning someone", async ({
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
    const categoryItem = await page.locator(
      ".dropdown-menu > div > div:nth-child(2) > div"
    );
    const selectedCategory = (await categoryItem.innerText()).split("\n")[0];
    await categoryItem.click();

    console.log("CATEGORY", selectedCategory);

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

    await page
      .frameLocator("iframe")
      .getByText("petersalomonsen.near")
      .click({ timeout: 10000 });

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
    expect(transactionText).toEqual(
      JSON.stringify(
        {
          labels: account === "events-committee.near" ? [selectedCategory] : [],
          body: {
            proposal_body_version: "V0",
            name: "Test proposal 123456",
            description:
              "The test proposal description. And mentioning @petersalomonsen.near. Also mentioning @megha19.near",
            category:
              account === "events-committee.near" ? "Bounty" : selectedCategory,
            summary: "Test proposal summary 123456789",
            linked_proposals: [],
            requested_sponsorship_usd_amount: "12345",
            requested_sponsorship_paid_in_currency: "USDC",
            receiver_account: "efiz.near",
            supervisor: null,
            requested_sponsor:
              account === "devhub.near" ? "neardevdao.near" : account,
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
});
