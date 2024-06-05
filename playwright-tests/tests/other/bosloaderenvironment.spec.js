import { test, expect } from "@playwright/test";

test("should find bos loader configuration in localstorage", async ({
  page,
}) => {
  await page.goto("/");

  const localStoreFlags = await page.evaluate(() =>
    localStorage.getItem("flags")
  );
  expect(localStoreFlags).toEqual(
    JSON.stringify({ bosLoaderUrl: "http://127.0.0.1:3030" })
  );
});

test.skip("should not get bos loader fetch error", async ({ page }) => {
  await page.goto("/events-committee.near/widget/app?page=feed");
  const bodyText = await page.textContent("body");
  expect(bodyText).not.toContain("BOS Loader fetch error");
});
