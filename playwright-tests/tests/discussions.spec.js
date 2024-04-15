import { test, expect } from "@playwright/test";
import { pauseIfVideoRecording } from "../testUtils.js";
import {
  setDontAskAgainCacheValues,
  getDontAskAgainCacheValues,
  setCommitWritePermissionDontAskAgainCacheValues,
} from "../util/cache.js";
import { modifySocialNearGetRPCResponsesInsteadOfGettingWidgetsFromBOSLoader } from "../util/bos-loader.js";
import {
  mockTransactionSubmitRPCResponses,
  decodeResultJSON,
  encodeResultJSON,
} from "../util/transaction.js";
import { mockSocialIndexResponses } from "../util/socialapi.js";

async function mockDiscussionTab(page) {
  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    const request = await route.request();
    const requestPostData = request.postDataJSON();

    const devComponents = (
      await fetch("http://localhost:3030").then((r) => r.json())
    ).components;

    if (
      requestPostData.params &&
      requestPostData.params.account_id === "social.near" &&
      requestPostData.params.method_name === "get"
    ) {
      const social_get_key = JSON.parse(
        atob(requestPostData.params.args_base64)
      ).keys[0];

      const response = await route.fetch({
        url: "https://rpc.mainnet.near.org/",
      });
      const json = await response.json();

      if (devComponents[social_get_key]) {
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
    } else if (requestPostData.method === "tx") {
      await route.continue({ url: "https://archival-rpc.mainnet.near.org/" });
      // await route.continue({ url: "https://1rpc.io/near" });
    } else if (
      requestPostData.params &&
      requestPostData.params.account_id === "devhub.near" &&
      requestPostData.params.method_name === "get_community"
    ) {
      const response = await route.fetch();
      const json = await response.json();

      const resultObj = decodeResultJSON(json.result.result);

      resultObj.addons = [
        ...resultObj.addons,
        {
          id: "9yhcct",
          addon_id: "announcements",
          display_name: "Announcements",
          enabled: true,
          parameters: "{}",
        },
        {
          addon_id: "discussions",
          display_name: "Discussions",
          enabled: true,
          id: "gqyrw7",
          parameters: "{}",
        },
      ];

      json.result.result = encodeResultJSON(resultObj);

      await route.fulfill({ response, json });
      return;
    } else {
      await route.continue();
    }
  });
}

test.beforeEach(async ({ page }) => {
  await mockDiscussionTab(page);
});

test.afterEach(
  async ({ page }) => await page.unrouteAll({ behavior: "ignoreErrors" })
);

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test("should create a discussion when content matches", async ({ page }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions"
    );
    const socialdbaccount = "petersalomonsen.near";
    const viewsocialdbpostresult = await fetch("https://rpc.mainnet.near.org", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "call_function",
          finality: "final",
          account_id: "social.near",
          method_name: "get",
          args_base64: btoa(
            JSON.stringify({
              keys: [socialdbaccount + "/post/main"],
              options: { with_block_height: true },
            })
          ),
        },
      }),
    }).then((r) => r.json());

    const socialdbpost = JSON.parse(
      new TextDecoder().decode(
        new Uint8Array(viewsocialdbpostresult.result.result)
      )
    );
    const socialdbpostcontent = JSON.parse(
      socialdbpost[socialdbaccount].post.main[""]
    );
    const socialdbpostblockheight =
      socialdbpost[socialdbaccount].post.main[":block"];

    const discussionPostEditor = await page.getByTestId("compose-announcement");
    await discussionPostEditor.scrollIntoViewIfNeeded();
    await discussionPostEditor.fill(socialdbpostcontent.text);

    await page.getByTestId("post-btn").click();

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions&transactionHashes=mi2a1KwagRFZhpqBNKhKaCTkHVj98J8tZnxSr1NpxSQ"
    );

    const transactionText = JSON.stringify(
      JSON.parse(await page.locator("div.modal-body code").innerText()),
      null,
      1
    );
    await expect(transactionText).toEqual(
      JSON.stringify(
        {
          handle: "webassemblymusic",
          block_height: socialdbpostblockheight,
        },
        null,
        1
      )
    );
  });

  test("should not create a discussion if content does not match", async ({
    page,
  }) => {
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions"
    );

    const socialdbaccount = "petersalomonsen.near";
    const viewsocialdbpostresult = await fetch("https://rpc.mainnet.near.org", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "call_function",
          finality: "final",
          account_id: "social.near",
          method_name: "get",
          args_base64: btoa(
            JSON.stringify({
              keys: [socialdbaccount + "/post/main"],
              options: { with_block_height: true },
            })
          ),
        },
      }),
    }).then((r) => r.json());

    const socialdbpost = JSON.parse(
      new TextDecoder().decode(
        new Uint8Array(viewsocialdbpostresult.result.result)
      )
    );
    const socialdbpostcontent = JSON.parse(
      socialdbpost[socialdbaccount].post.main[""]
    );

    const discussionPostEditor = await page.getByTestId("compose-announcement");
    await discussionPostEditor.scrollIntoViewIfNeeded();
    await discussionPostEditor.fill(
      socialdbpostcontent.text + " something else so that it does not match"
    );

    await page.getByTestId("post-btn").click();

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions&transactionHashes=mi2a1KwagRFZhpqBNKhKaCTkHVj98J8tZnxSr1NpxSQ"
    );

    const transactionConfirmationModal = page.locator("div.modal-body code");
    await page.waitForTimeout(4000);
    expect(await transactionConfirmationModal.isVisible()).toBeFalsy();
  });
});

test.describe("Don't ask again enabled", () => {
  test.use({
    storageState:
      "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  const communitydiscussionaccount =
    "discussions.webassemblymusic.community.devhub.near";

  test("should create a discussion", async ({ page }) => {
    let discussion_created = false;
    await mockSocialIndexResponses(page, ({ requestPostData, json }) => {
      if (
        requestPostData.action === "repost" &&
        requestPostData.options?.accountId?.[0] === communitydiscussionaccount
      ) {
        console.log("Returning discussions from index", discussion_created);
        return discussion_created ? [json[0]] : [];
      }
    });

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions"
    );

    const widgetSrc = "devhub.near/widget/devhub.entity.community.Discussions";
    await setDontAskAgainCacheValues({
      page,
      widgetSrc,
      methodName: "create_discussion",
      contractId: "devhub.near",
    });

    expect(
      await getDontAskAgainCacheValues({
        page,
        widgetSrc,
        methodName: "create_discussion",
        contractId: "devhub.near",
      })
    ).toEqual({ create_discussion: true });

    await setCommitWritePermissionDontAskAgainCacheValues({
      page,
      widgetSrc,
      accountId: "petersalomonsen.near",
    });
    const socialdbaccount = "petersalomonsen.near";
    const viewsocialdbpostresult = await fetch("https://rpc.mainnet.near.org", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "call_function",
          finality: "final",
          account_id: "social.near",
          method_name: "get",
          args_base64: btoa(
            JSON.stringify({
              keys: [socialdbaccount + "/post/main"],
              options: { with_block_height: true },
            })
          ),
        },
      }),
    }).then((r) => r.json());

    const socialdbpost = JSON.parse(
      new TextDecoder().decode(
        new Uint8Array(viewsocialdbpostresult.result.result)
      )
    );
    const socialdbpostcontent = JSON.parse(
      socialdbpost[socialdbaccount].post.main[""]
    );
    const socialdbpostblockheight =
      socialdbpost[socialdbaccount].post.main[":block"];

    const discussionPostEditor = await page.getByTestId("compose-announcement");
    await discussionPostEditor.scrollIntoViewIfNeeded();
    await discussionPostEditor.fill(socialdbpostcontent.text);
    await pauseIfVideoRecording(page);

    await mockTransactionSubmitRPCResponses(
      page,
      async ({ route, request, transaction_completed, last_receiver_id }) => {
        const postData = request.postDataJSON();
        const args_base64 = postData.params?.args_base64;
        if (args_base64) {
          const args = atob(args_base64);
          if (
            args.indexOf(
              "discussions.webassemblymusic.community.devhub.near/index/**"
            ) > -1
          ) {
            const response = await route.fetch();
            const json = await response.json();

            if (!transaction_completed || last_receiver_id !== "devhub.near") {
              const resultObj = decodeResultJSON(json.result.result);
              resultObj[communitydiscussionaccount].index.repost = "[]";
              json.result.result = encodeResultJSON(resultObj);

              discussion_created = true;
            }
            await route.fulfill({ response, json });
            return;
          } else if (postData.method === "tx") {
            await route.continue({
              url: "https://archival-rpc.mainnet.near.org/",
            });
          } else if (
            postData.params &&
            postData.params.account_id === "devhub.near" &&
            postData.params.method_name === "get_community"
          ) {
            const response = await route.fetch();
            const json = await response.json();

            const resultObj = decodeResultJSON(json.result.result);

            resultObj.addons = [
              ...resultObj.addons,
              {
                id: "9yhcct",
                addon_id: "announcements",
                display_name: "Announcements",
                enabled: true,
                parameters: "{}",
              },
              {
                addon_id: "discussions",
                display_name: "Discussions",
                enabled: true,
                id: "gqyrw7",
                parameters: "{}",
              },
            ];

            json.result.result = encodeResultJSON(resultObj);

            await route.fulfill({ response, json });
            return;
          }
        }
        await route.continue();
      }
    );

    const postButton = await page.getByTestId("post-btn");
    await postButton.click();

    const loadingIndicator = await page
      .locator(".submit-post-loading-indicator")
      .first();

    await expect(loadingIndicator).toBeVisible();
    await expect(postButton).toBeDisabled();

    const transaction_toast = await page.getByText(
      "Calling contract devhub.near with method create_discussion"
    );
    await expect(transaction_toast).toBeVisible();

    await expect(loadingIndicator).toBeVisible();
    await expect(postButton).toBeDisabled();

    await transaction_toast.waitFor({ state: "detached" });
    await expect(transaction_toast).not.toBeVisible();
    await loadingIndicator.waitFor({ state: "detached" });
    await expect(postButton).not.toBeDisabled();

    await expect(await discussionPostEditor.textContent()).toEqual("");
    await transaction_toast.waitFor({ state: "detached", timeout: 100 });

    await page
      .locator(".reposted")
      .waitFor({ state: "visible", timeout: 10000 });
    await pauseIfVideoRecording(page);
  });
});
