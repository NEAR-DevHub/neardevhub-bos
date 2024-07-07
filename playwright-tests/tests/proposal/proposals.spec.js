import { test, expect } from "@playwright/test";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../../util/bos-loader.js";
import { pauseIfVideoRecording } from "../../testUtils.js";
import {
  setCommitWritePermissionDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
} from "../../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../../util/transaction.js";
import { mockRpcRequest } from "../../util/rpcmock.js";
import { mockSocialIndexResponses } from "../../util/socialapi.js";

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
  test("should be edit proposal timeline from review to decision stage with KYC verified", async ({
    page,
  }) => {
    test.setTimeout(60000);
    let isTransactionCompleted = false;

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

    await page.goto("/devhub.near/widget/app?page=proposal&id=17");
    await setDontAskAgainCacheValues({
      page,
      contractId: "devhub.near",
      widgetSrc: "devhub.near/widget/devhub.entity.proposal.Proposal",
      methodName: "edit_proposal_versioned_timeline",
    });

    const firstStatusBadge = await page
      .locator("div.fw-bold.rounded-2.p-1.px-2")
      .first();
    await expect(firstStatusBadge).toHaveText("REVIEW", { timeout: 10000 });
    await page.locator(".d-flex > div > .bi").click();
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await page.getByTestId("Sponsor verifies KYC/KYB").check();
    await page.getByText("Approved", { exact: true }).first().click();

    await pauseIfVideoRecording(page);

    const saveButton = await page.getByRole("button", { name: "Save" });
    await saveButton.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Save" }).click();

    const callContractToast = await page.getByText("Sending transaction");
    await expect(callContractToast).toBeVisible();
    await expect(callContractToast).not.toBeAttached();
    const timeLineStatusSubmittedToast = await page
      .getByText("Timeline status submitted successfully")
      .first();
    await expect(timeLineStatusSubmittedToast).toBeVisible();

    await expect(firstStatusBadge).toHaveText("APPROVED");
    await firstStatusBadge.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);
    const lastLogItem = await page.locator(
      "div.flex-1.gap-1.w-100.text-wrap.text-muted.align-items-center",
      { hasText: /.*s ago/ }
    );
    console.log(lastLogItem);
    await expect(lastLogItem).toContainText(
      "moved proposal from REVIEW to APPROVED"
    );
    await lastLogItem.scrollIntoViewIfNeeded();
    await expect(timeLineStatusSubmittedToast).not.toBeAttached();
    await pauseIfVideoRecording(page);
  });

  test("should not be able to move proposal timeline to decision stage without approving KYC in review stage", async ({
    page,
  }) => {
    test.setTimeout(60000);

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
    await page.goto("/devhub.near/widget/app?page=proposal&id=17");

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

  test("should show relevant users in mention autocomplete", async ({
    page,
  }) => {
    await page.goto("/devhub.near/widget/app?page=proposal&id=112");

    await page.waitForSelector(`iframe`, {
      state: "visible",
    });

    const comment = page.getByRole("link", { name: "geforcy.near" });
    await comment.waitFor();
    await comment.scrollIntoViewIfNeeded();

    const heading = page.getByRole("heading", { name: "Relevant Mentions" });
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
  }) => {
    test.setTimeout(120000);
    const delay_milliseconds_between_keypress_when_typing = 0;
    await page.goto("/devhub.near/widget/app?page=create-proposal");
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

  test("should filter proposals by categories", async ({ page }) => {
    test.setTimeout(60000);
    const category = "DevDAO Operations";
    await page.goto("/devhub.near/widget/app?page=proposals");
    await page.getByRole("button", { name: "Category" }).click();
    await page.getByRole("list").getByText(category).click();
    await expect(
      page.getByRole("button", { name: `Category : ${category}` })
    ).toBeVisible();
    const categoryTag = await page.locator(".purple-bg").first();
    await expect(categoryTag).toContainText(category);
  });

  test("should filter proposals by timeline", async ({ page }) => {
    test.setTimeout(60000);
    const stage = "Funded";
    await page.goto("/devhub.near/widget/app?page=proposals");
    await page.getByRole("button", { name: "Stage" }).click();
    await page.getByRole("list").getByText(stage).click();
    await expect(
      page.getByRole("button", { name: `Stage : ${stage}` })
    ).toBeVisible();
    const timelineTag = await page.locator(".green-tag").first();
    await expect(timelineTag).toContainText(stage.toUpperCase());
  });

  test("should filter proposals by author", async ({ page }) => {
    test.setTimeout(60000);
    const accountId = "megha19.near";
    await page.goto("/devhub.near/widget/app?page=proposals");
    await page.getByRole("button", { name: "Author" }).click();
    await page.getByRole("list").getByText(accountId).click();
    await expect(
      page.getByRole("button", { name: `Author : ${accountId}` })
    ).toBeVisible();
    await expect(page.getByText(`By ${accountId} ･`)).toBeVisible();
  });

  test("should filter proposals by search text", async ({ page }) => {
    test.setTimeout(60000);
    const term = "DevHub Developer Contributor report by Megha";
    await page.goto("/devhub.near/widget/app?page=proposals");
    const input = await page.getByPlaceholder("Search by content");
    await input.click();
    await input.fill(term);
    await input.press("Enter");
    const element = page.locator(`:has-text("${term}")`).nth(1);
    await expect(element).toBeVisible();
  });
});

test.describe("share links", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
  });
  test("copy link button should create a clean URL link", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=proposal&id=127");

    await expect(await page.getByText("#127")).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    await page.getByRole("button", { name: "Copy link to proposal" }).click();

    const linkUrlFromClipboard = await page.evaluate(
      "navigator.clipboard.readText()"
    );
    expect(linkUrlFromClipboard).toEqual(
      "https://devhub.near.page/proposal/127"
    );
    await pauseIfVideoRecording(page);
    await page.goto(linkUrlFromClipboard);

    await expect(await page.getByText("#127")).toBeVisible({
      timeout: 10000,
    });
  });

  test("share on X should create a clean URL link", async ({
    page,
    context,
  }) => {
    await page.goto("/devhub.near/widget/app?page=proposal&id=127");

    await expect(await page.getByText("#127")).toBeVisible();
    const shareLinkButton = await page.getByRole("button", { name: "" });
    await shareLinkButton.click();
    const shareOnXLink = await page.getByRole("link", { name: " Share on X" });
    const shareOnXUrl = await shareOnXLink.getAttribute("href");
    await expect(shareOnXUrl).toEqual(
      "https://x.com/intent/post?text=Check+out+this+proposal+on+%40NEARProtocol%0A%23NEAR+%23BOS%0Ahttps%3A%2F%2Fdevhub.near.page%2Fproposal%2F127"
    );
    await shareOnXLink.click();
    const twitterPage = await context.waitForEvent("page");
    await twitterPage.waitForURL(shareOnXUrl);
  });
});
