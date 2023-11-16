import { test } from "@playwright/test";
import { setInputAndAssert, selectAndAssert } from "../testUtils";

test("should be able to submit a solution with USDC as currency", async ({
  page,
}) => {
  await page.goto("/devgovgigs.near/widget/app?page=create");

  await page.click('button:has-text("Solution")');

  await setInputAndAssert(
    page,
    'p:has-text("Title") + input',
    "The test title"
  );

  await page.click('label:has-text("Yes") button');
  await selectAndAssert(page, 'div:has-text("Currency") select', "USDT");
  await setInputAndAssert(
    page,
    'div:has-text("Requested amount") input',
    "300"
  );
});
