import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import {
  getDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
} from "../util/cache.js";
import {
  modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader
} from "../util/bos-loader.js";

test.describe("Wallet is connected with devhub access key", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("should comment to a post", async ({ page }) => {
    await modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader(page);

    await page.goto("/devhub.near/widget/app?page=post&id=2731");
    await setDontAskAgainCacheValues(page);

    await pauseIfVideoRecording(page);
    const postToReplyButton = await page.getByRole("button", {
      name: "↪ Reply",
    });
    await postToReplyButton.click();

    await pauseIfVideoRecording(page);
    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });

    await commentButton.click();
    await pauseIfVideoRecording(page);

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await pauseIfVideoRecording(page);
    expect(await getDontAskAgainCacheValues(page)).toEqual({ add_post: true });

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (
        requestPostData.params &&
        requestPostData.params.request_type === "view_access_key_list"
      ) {

        const response = await route.fetch();
        const json = await response.json();
        json.result.keys = [{
          "access_key": {
            "nonce": 109629226000005, "permission": {
              "FunctionCall": {
                "allowance": "241917078840755500000000", "method_names": [],
                "receiver_id": "devgovgigs.near"
              }
            }
          },
          "public_key": "ed25519:EQr7NpVYFu1XcVZ23Lb4Ga3KbDQgrYeTMTgBsYa26Bne"
        }];

        console.log("Replacing RPC response when listing access keys", JSON.stringify(json));
        await route.fulfill({ response, json });
      } else if (requestPostData.params &&
        requestPostData.params.request_type === "view_access_key") {
        const response = await route.fetch();
        const json = await response.json();

        json.result = {
          "nonce": 85,
          "permission": {
            "FunctionCall": {
              "allowance": "241917078840755500000000",
              "receiver_id": "devgovgigs.near",
              "method_names": []
            }
          },
          "block_height": 19884918,
          "block_hash": "GGJQ8yjmo7aEoj8ZpAhGehnq9BSWFx4xswHYzDwwAP2n"
        };

        console.log("Replacing RPC response when viewing access key", JSON.stringify(json));
        await route.fulfill({ response, json });
      } else if (requestPostData.method == 'broadcast_tx_commit') {
        console.log("Replacing RPC response when broadcasting tx");
        await route.fulfill({
          json: {
            "jsonrpc": "2.0",
            "result": {
              "status": {
                "SuccessValue": ""
              },
              "transaction_outcome": {
                "proof": [],
                "block_hash": "9MzuZrRPW1BGpFnZJUJg6SzCrixPpJDfjsNeUobRXsLe",
                "id": "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
                "outcome": {
                  "logs": [],
                  "receipt_ids": ["BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"],
                  "gas_burnt": 223182562500,
                  "tokens_burnt": "22318256250000000000",
                  "executor_id": "sender.testnet",
                  "status": {
                    "SuccessReceiptId": "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"
                  }
                }
              },
              "receipts_outcome": [

              ]
            }
          }
        });
      } else {
        console.log('unmodified', JSON.stringify(requestPostData));
        await route.continue();
      }
    });

    await submitbutton.click();
    await pauseIfVideoRecording(page);
    await submitbutton.waitFor({ state: "detached", timeout: 500 });
    const callContractToast = await page.getByText("Calling contract devgovgigs.near with method add_post");
    expect(
      callContractToast
        .isVisible()
    ).toBeTruthy();    
    await callContractToast.waitFor({state: "detached"});
    await pauseIfVideoRecording(page);
    await page.waitForTimeout(5000);
  });

  test("should like a post", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    const likeButton = await page.getByRole("button", {
      name: " Peter Salomonsen @petersalomonsen.near",
    });
    await likeButton.click();
    await page.waitForTimeout(2000);
  });

  test("should comment to a long thread with don't ask again feature enabled", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.goto("/devhub.near/widget/app?page=post&id=1033");

    await setDontAskAgainCacheValues(page);

    const postToReplyButton = await page
      .locator("#collapseChildPosts1041")
      .getByRole("button", { name: "↪ Reply" })
      .nth(1);
    await postToReplyButton.scrollIntoViewIfNeeded();
    await postToReplyButton.click();

    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });
    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click();

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.scrollIntoViewIfNeeded();
    await commentArea.focus();
    await commentArea.fill("Some comment");

    await page.getByTestId("submit-create-post").click();
    await page.waitForTimeout(5000);
  });
});
