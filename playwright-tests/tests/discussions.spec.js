import { test, expect } from "@playwright/test";

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
    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (requestPostData.method === "tx") {
        await route.continue({ url: "https://archival-rpc.mainnet.near.org/" });
      } else {
        await route.continue();
      }
    });

    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions&transactionHashes=mi2a1KwagRFZhpqBNKhKaCTkHVj98J8tZnxSr1NpxSQ"
    );

    await expect(page.locator("div.modal-body code")).toHaveText(
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

    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (requestPostData.method === "tx") {
        await route.continue({ url: "https://archival-rpc.mainnet.near.org/" });
      } else {
        await route.continue();
      }
    });
    await page.goto(
      "/devhub.near/widget/app?page=community&handle=webassemblymusic&tab=discussions&transactionHashes=mi2a1KwagRFZhpqBNKhKaCTkHVj98J8tZnxSr1NpxSQ"
    );

    const transactionConfirmationModal = page.locator("div.modal-body code");
    await page.waitForTimeout(4000);
    expect(await transactionConfirmationModal.isVisible()).toBeFalsy();
  });
});
