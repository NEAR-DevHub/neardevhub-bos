import { expect, test } from "@playwright/test";

async function setDontAskAgainCacheValues(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const dbName = "cacheDb";
      const storeName = "cache-v1";
      const key =
        '{"action":"LocalStorage","domain":{"page":"confirm_transactions"},"key":{"widgetSrc":"devhub.near/widget/devhub.entity.post.PostEditor","contractId":"devgovgigs.near","type":"send_transaction_without_confirmation"}}';
      const newValue = { add_post: true };

      const request = indexedDB.open(dbName);

      request.onerror = function (event) {
        console.error("Database error: ", event.target.error);
      };

      request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        const updateRequest = objectStore.put(newValue, key);

        updateRequest.onerror = function (event) {
          console.error("Error updating data: ", event.target.error);
        };

        updateRequest.onsuccess = function (event) {
          console.log("Data updated for key:", key);
          resolve();
        };
      };
    });
  });
}

async function getDontAskAgainCacheValues(page) {
  const storedData = await page.evaluate(async () => {
    return await new Promise((resolve) => {
      // Replace 'yourDatabaseName', 'yourObjectStoreName', and 'yourKey' with your specific values
      const dbName = "cacheDb";
      const storeName = "cache-v1";
      const key =
        '{"action":"LocalStorage","domain":{"page":"confirm_transactions"},"key":{"widgetSrc":"devhub.near/widget/devhub.entity.post.PostEditor","contractId":"devgovgigs.near","type":"send_transaction_without_confirmation"}}';

      // Opening the database
      const request = indexedDB.open(dbName);

      request.onerror = function (event) {
        console.error("Database error: ", event.target.error);
      };

      request.onsuccess = function (event) {
        const db = event.target.result;

        // Opening a transaction and getting the object store
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);

        // Getting the data by key
        const dataRequest = objectStore.get(key);

        dataRequest.onerror = function (event) {
          console.error("Error fetching data: ", event.target.error);
        };

        dataRequest.onsuccess = function (event) {
          if (dataRequest.result) {
            console.log("Found data: ", dataRequest.result);
            resolve(dataRequest.result);
          } else {
            console.log("No data found for key:", key);
          }
        };
      };
    });
  });
  return storedData;
}

test.describe("Wallet is connected with devhub access key", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-with-devhub-access-key.json",
  });

  test("should comment to a post", async ({ page }) => {
    const devComponents = (await fetch('http://localhost:3030').then(r => r.json())).components;

    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (requestPostData.params && requestPostData.params.account_id ==='social.near'
        && requestPostData.params.method_name ==='get') {
        const social_get_key = JSON.parse(atob(requestPostData.params.args_base64)).keys[0];

        const response = await route.fetch();
        const json = await response.json();

        if (devComponents[social_get_key]) {
          console.log('using local dev widget', social_get_key);
          const social_get_key_parts = social_get_key.split('/');
          const devWidget = {};
          devWidget[social_get_key_parts[0]] = { widget: {}};
          devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] = devComponents[social_get_key].code;
          json.result.result = Array.from(new TextEncoder().encode(JSON.stringify(devWidget)));
        } 
        await route.fulfill({response, json});
      } else {
        await route.continue();
      }
    });

    await page.goto("/devhub.near/widget/app?page=post&id=2731");
    await setDontAskAgainCacheValues(page);

    const postToReplyButton = await page.getByRole('button', { name: '↪ Reply' });
    await postToReplyButton.click();

    const commentButton = await page.getByRole("button", {
      name: " Comment Ask a question, provide information, or share a resource that is relevant to the thread.",
    });

    await commentButton.click();

    const commentArea = await page
      .frameLocator("iframe")
      .locator(".CodeMirror textarea");
    await commentArea.focus();
    await commentArea.fill("Some comment");

    expect(await getDontAskAgainCacheValues(page)).toEqual({ add_post: true });

    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (requestPostData.params && requestPostData.params.request_type ==='view_access_key_list') {
        console.log("Failing on viewing access keys");
        await route.abort();
      } else {
        await route.continue();
      }
    });

    await page.getByTestId('submit-create-post').click();
    expect(await page.getByText('Calling contract devgovgigs.near with method add_post').isVisible()).toBeTruthy();
  });

  test("should like a post", async ({ page }) => {
    await page.goto("/devhub.near/widget/app?page=post&id=2731");

    const likeButton = await page.getByRole('button', { name: ' Peter Salomonsen @petersalomonsen.near' });
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
