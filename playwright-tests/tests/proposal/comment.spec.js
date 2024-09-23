import { test as base, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../../testUtils.js";
import { setCommitWritePermissionDontAskAgainCacheValues } from "../../util/cache.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../../util/transaction.js";

const test = base.extend({
  // Define an option and provide a default value.
  // We can later override it in the config.
  account: ["devhub.near", { option: true }],
  proposalAuthorAccountId: ["megha19.near", { option: true }],
});

test.describe("Don't ask again enabled", () => {
  test.use({
    contextOptions: {
      permissions: ["clipboard-read", "clipboard-write"],
    },
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });
  test("should add comment on a proposal", async ({
    page,
    account: instanceAccount,
  }) => {
    await page.goto(`/${instanceAccount}/widget/app?page=proposal&id=5`);
    const widgetSrc =
      instanceAccount === "infrastructure-committee.near"
        ? "infrastructure-committee.near/widget/components.molecule.ComposeComment"
        : `${instanceAccount}/widget/devhub.entity.proposal.ComposeComment`;

    const delay_milliseconds_between_keypress_when_typing = 0;
    const commentArea = await page
      .frameLocator("iframe")
      .last()
      .locator(".CodeMirror textarea");
    await commentArea.focus({ timeout: 20_000 });
    const text = "Comment testing";
    await commentArea.pressSequentially(text, {
      delay: delay_milliseconds_between_keypress_when_typing,
    });
    await commentArea.blur();
    await pauseIfVideoRecording(page);

    const accountId = "petersalomonsen.near";
    await setCommitWritePermissionDontAskAgainCacheValues({
      page,
      widgetSrc,
      accountId: accountId,
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
            args === `{"keys":["${accountId}/post/**"]}`
          ) {
            const response = await route.fetch();
            const json = await response.json();
            const resultObj = decodeResultJSON(json.result.result);
            resultObj[accountId].post.main = JSON.stringify({
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
    await expect(commentButton).toBeAttached();
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click();
    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).toContainText(text);

    const loadingIndicator = await page.locator(".comment-btn-spinner");
    await expect(loadingIndicator).toBeAttached();
    await loadingIndicator.waitFor({ state: "detached", timeout: 30000 });
    await expect(loadingIndicator).not.toBeVisible();
    const transaction_successful_toast = await page.getByText(
      "Comment Submitted Successfully",
      { exact: true }
    );
    await expect(transaction_successful_toast).toBeVisible();

    await expect(transaction_successful_toast).not.toBeAttached();
    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).not.toContainText(text);
    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).toContainText("Add your comment here...");
    await pauseIfVideoRecording(page);
  });
  test("should paste a long comment to a proposal, see that the comment appears after submission, and that the comment field is cleared, even after reloading the page", async ({
    page,
    account: instanceAccount,
  }) => {
    test.setTimeout(2 * 60000);
    await page.goto(`/${instanceAccount}/widget/app?page=proposal&id=5`);
    const widgetSrc =
      instanceAccount === "infrastructure-committee.near"
        ? "infrastructure-committee.near/widget/components.molecule.ComposeComment"
        : `${instanceAccount}/widget/devhub.entity.proposal.ComposeComment`;

    let commentButton = await page.getByRole("button", { name: "Comment" });
    await expect(commentButton).toBeAttached({ timeout: 20000 });
    await commentButton.scrollIntoViewIfNeeded();

    const commentText =
      "Hi @petersalomonsen.near – congratulations! This message confirms your funding request approval by @neardevdao.near. We're excited to sponsor your work! This approval follows our review process involving various Work Groups and DevDAO Moderators, as outlined in our [guidelines](/devhub.near/widget/app?page=community&handle=developer-dao&tab=Funding). Please note that the funding distribution is contingent on successfully passing our KYC/B and paperwork process.\n\nHere’s what to expect:\n\n**Funding Steps**\n\n1. **KYC/KYB Verification:** A DevDAO Moderator will move your proposal to the Payment Processing Stage and verify that you have completed verification to ensure compliance. If you are not verified, your DevHub Moderator will contact you on Telegram with instructions on how to proceed. To receive funding, you must get verified through Fractal, a trusted third-party identification verification solution. Your verification badge is valid for 365 days and needs renewal upon expiration OR if your personal information changes, such as your name, address, or ID expiration.\n2. **Information Collection:** Once verified, a DevDAO Moderator will contact you via Telegram and request that you complete the Funding Request Form using Airtable.\n3. **Processing:** Our legal team will verify your application details to ensure compliance. They will then send you an email requesting your signature for the underlying agreement via Ironclad.\n4. **Invoicing & Payment:** Once we receive your signed agreement, our finance team will email you instructions to submit the final invoice using Request Finance. Once we receive your invoice, our finance team will send a test transaction confirmation email. Once you confirm the test transaction, we will distribute the funds and post a payment link on your proposal.\n\n**Funding Conversion Notice**\n\nOnce you receive your funding, we urge you to exercise caution if attempting to convert your funds. Some third-party tools may impose significant swapping fees.\n\n**Visibility**\n\nWe track the funding process on each proposal using the timeline and comments. However, you are welcome to reach out to the DevDAO Moderator with any questions. \n\n**Timeline**\n\nTypically, funds are disbursed within 10 business days, but the timeline can vary depending on the project's complexity and paperwork. Your DevDAO Moderator will keep you updated.";
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, commentText);

    const commentArea = await page
      .frameLocator("iframe")
      .last()
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await page.waitForTimeout(100);

    const isMac = process.platform === "darwin";

    if (isMac) {
      await page.keyboard.down("Meta"); // Command key on macOS
      await page.keyboard.press("a");
      await page.keyboard.press("v");
      await page.keyboard.up("Meta");
    } else {
      await page.keyboard.down("Control"); // Control key on Windows/Linux
      await page.keyboard.press("a");
      await page.keyboard.press("v");
      await page.keyboard.up("Control");
    }

    await commentArea.blur();
    await pauseIfVideoRecording(page);

    const userAccount = "petersalomonsen.near";
    await setCommitWritePermissionDontAskAgainCacheValues({
      page,
      widgetSrc,
      accountId: userAccount,
    });

    const transactionMockStatus = await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_transaction }) => {
        const postData = request.postDataJSON();
        const args_base64 = postData.params?.args_base64;

        if (transaction_completed && args_base64) {
          const args = atob(args_base64);
          if (
            postData.params.account_id === "social.near" &&
            postData.params.method_name === "get" &&
            args === `{"keys":["${userAccount}/post/**"]}`
          ) {
            const response = await route.fetch();
            const json = await response.json();
            const resultObj = decodeResultJSON(json.result.result);

            resultObj[userAccount].post.main = JSON.stringify({
              text: commentText,
            });
            json.result.result = encodeResultJSON(resultObj);
            completedPromiseResolve(last_transaction);
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

    let submittedTransactionJsonObjectPromiseResolve;
    let submittedTransactionJsonObjectPromise = new Promise(
      (r) => (submittedTransactionJsonObjectPromiseResolve = r)
    );
    await page.route("https://api.near.social/index", async (route) => {
      if (transactionMockStatus.transaction_completed) {
        const lastTransactionParamBuffer = Buffer.from(
          transactionMockStatus.last_transaction.params[0],
          "base64"
        );

        const transactionDataJsonStartIndex =
          lastTransactionParamBuffer.indexOf('{"data":');
        const transactionDataJsonEndIndex =
          lastTransactionParamBuffer.indexOf('"}}}}') + '"}}}}'.length;
        const transactionDataJsonString = lastTransactionParamBuffer.subarray(
          transactionDataJsonStartIndex,
          transactionDataJsonEndIndex
        );

        submittedTransactionJsonObjectPromiseResolve(
          JSON.parse(transactionDataJsonString.toString())
        );

        const response = await route.fetch();
        const json = await response.json();
        json.push({
          accountId: "theori.near",
          blockHeight: 121684809,
          value: {
            type: "md",
          },
        });

        await route.fulfill({ json });
      } else {
        await route.continue();
      }
    });

    commentButton = await page.getByRole("button", { name: "Comment" });
    await commentButton.click();

    const loadingIndicator = await page.locator(".comment-btn-spinner");
    await expect(loadingIndicator).toBeAttached();
    await loadingIndicator.waitFor({ state: "detached", timeout: 30000 });
    await expect(loadingIndicator).not.toBeVisible();
    const transaction_successful_toast = await page.getByText(
      "Comment Submitted Successfully",
      { exact: true }
    );
    await expect(transaction_successful_toast).toBeVisible();

    await expect(transaction_successful_toast).not.toBeAttached({
      timeout: 10000,
    });
    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).not.toContainText(commentText);
    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).toContainText("Add your comment here...");

    const submittedTransactionJsonObject =
      await submittedTransactionJsonObjectPromise;
    const submittedComment = JSON.parse(
      submittedTransactionJsonObject.data["petersalomonsen.near"].post.comment
    );
    expect(submittedComment.text).toEqual(commentText);
    let commentElement = await page
      .frameLocator("#theorinear121684809 iframe")
      .locator("#content");
    await expect(commentElement).toBeVisible({ timeout: 30_000 });
    await expect(commentElement).toContainText(
      "Typically, funds are disbursed within 10 business days, but the timeline can vary depending on the project's complexity and paperwork. Your DevDAO Moderator will keep you updated.",
      { timeout: 30_000 }
    );

    await page.reload();

    commentElement = await page
      .frameLocator("#theorinear121684809 iframe")
      .locator("#content");
    await expect(commentElement).toBeVisible({ timeout: 30_000 });
    await expect(commentElement).toContainText(
      "Typically, funds are disbursed within 10 business days, but the timeline can vary depending on the project's complexity and paperwork. Your DevDAO Moderator will keep you updated.",
      { timeout: 30_000 }
    );

    commentButton = await page.getByRole("button", { name: "Comment" });
    await expect(commentButton).toBeAttached({ timeout: 20000 });
    await commentButton.scrollIntoViewIfNeeded();

    // Ensure that comment field is not populated with the previous draft, even after 5 seconds
    await page.waitForTimeout(5000);

    await expect(
      await page.frameLocator("iframe").last().locator(".CodeMirror")
    ).toContainText("Add your comment here...");

    await pauseIfVideoRecording(page);
  });
});
