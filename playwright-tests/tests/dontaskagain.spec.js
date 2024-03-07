import { expect, test } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import {
  getDontAskAgainCacheValues,
  setDontAskAgainCacheValues,
} from "../util/cache.js";

test.describe("Wallet is connected with devhub access key", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("should comment to a post", async ({ page }) => {
    const devComponents = (
      await fetch("http://localhost:3030").then((r) => r.json())
    ).components;

    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (
        requestPostData.params &&
        requestPostData.params.account_id === "social.near" &&
        requestPostData.params.method_name === "get"
      ) {
        const social_get_key = JSON.parse(
          atob(requestPostData.params.args_base64)
        ).keys[0];

        const response = await route.fetch();
        const json = await response.json();

        if (devComponents[social_get_key]) {
          console.log("using local dev widget", social_get_key);
          const social_get_key_parts = social_get_key.split("/");
          const devWidget = {};
          devWidget[social_get_key_parts[0]] = { widget: {} };
          devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] =
            devComponents[social_get_key].code;
          json.result.result = Array.from(
            new TextEncoder().encode(JSON.stringify(devWidget))
          );
        }
        await route.fulfill({ response, json });
      } else {
        await route.continue();
      }
    });

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

        console.log("Replacing RPC response when viewing access keys", JSON.stringify(requestPostData));
        await route.fulfill(json);
      } else {
        await route.continue();
      }
    });

    const submitbutton = await page.getByTestId("submit-create-post");
    await submitbutton.scrollIntoViewIfNeeded();
    await pauseIfVideoRecording(page);

    await submitbutton.click();
    await pauseIfVideoRecording(page);
    await submitbutton.waitFor({ state: "detached", timeout: 500 });
    expect(
      await page
        .getByText("Calling contract devgovgigs.near with method add_post")
        .isVisible()
    ).toBeTruthy();
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
