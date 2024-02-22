const { test } = require("@playwright/test");

test.describe("Wallet is connected", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected-peter.json",
  });

  test.describe("AddonsConfigurator", () => {
    const baseUrl =
      "/devhub.near/widget/app?page=community.configuration&handle=webassemblymusic";
    // const dropdownSelector =
    //   'input[data-component="near/widget/DIG.InputSelect"]';
    // const addButtonSelector = "button.btn-success:has(i.bi.bi-plus)";
    // const toggleButtonSelector = 'button[role="switch"]';
    // const moveUpButtonSelector = "button.btn-secondary:has(i.bi.bi-arrow-up)";
    // const removeButtonSelector =
    //   "button.btn-outline-danger:has(i.bi.bi-trash-fill)";

    test("Addons configuration section comes up on load", async ({ page }) => {
      await page.goto(baseUrl);

      const addonsConfiguratorSelector = 'span:has-text("Add-Ons")';

      await page.waitForSelector(addonsConfiguratorSelector, {
        state: "visible",
      });
    });
  });
});

// NOTE:
// The below tests need some more work.
// We are using the DIG component, which is essentially a Radix Select field.
// Radix select renders as an input and requires to be focused, then value inputted, before the option can be selected.
// I was having trouble making this work.

//     test('Can add an addon to the list', async ({ page }) => {
//         await page.goto(baseUrl);

//         await page.click(dropdownSelector);
//         await page.fill(dropdownSelector, 'Wiki');
//         await page.click(`li:has-text('Wiki')`);

//         await page.waitForSelector(addButtonSelector, {
//           state: "visible",
//         });

//         await page.click(addButtonSelector);

//         const addedAddon = await page.$('input[type="text"].form-control[disabled][value="Wiki"]'); // You will need to fill this in
//         expect(addedAddon).toBeTruthy();
//     });

//     test('Can reorder addons in the list', async ({ page }) => {
//         await page.goto(baseUrl);

//         await page.click(dropdownSelector);
//         await page.inputValue(dropdownSelector, 'Wiki');
//         await page.click(`li:has-text('Wiki')`);

//         await page.waitForSelector(addButtonSelector, {
//           state: "visible",
//         });

//         await page.click(addButtonSelector);

//         await page.inputValue(dropdownSelector, 'telegram');
//         await page.click(addButtonSelector);

//         await page.waitForSelector(moveUpButtonSelector, {
//           state: "visible",
//         });

//         await page.click(moveUpButtonSelector);

//         const firstAddon = await page.$('input[type="text"].form-control[disabled][value="Telegram"]');
//         const secondAddon = await page.$('input[type="text"].form-control[disabled][value="Wiki"]');
//         expect(firstAddon).toBeTruthy();
//         expect(secondAddon).toBeTruthy();
//     });

//     test('Can remove an addon from the list', async ({ page }) => {
//         await page.goto(baseUrl);

//         await page.inputValue(dropdownSelector, 'Wiki');

//         await page.waitForSelector(addButtonSelector, {
//           state: "visible",
//         });

//         await page.click(addButtonSelector);

//         await page.waitForSelector(removeButtonSelector, {
//           state: "visible",
//         });

//         await page.click(removeButtonSelector);

//         const removedAddon = await page.$('input[type="text"].form-control[disabled][value="Wiki"]'); // You will need to fill this in
//         expect(removedAddon).toBeNull();
//     });

//     test('Can toggle to disable an addon', async ({ page }) => {
//         await page.goto(baseUrl);

//         await page.inputValue(dropdownSelector, 'Wiki');
//         await page.waitForSelector(addButtonSelector, {
//           state: "visible",
//         });

//         await page.click(addButtonSelector);

//         await page.waitForSelector(toggleButtonSelector, {
//           state: "visible",
//         });

//         await page.click(toggleButtonSelector);

//         const toggleState = await page.getAttribute(toggleButtonSelector, 'aria-checked');
//         expect(toggleState).toBe('false');
//     });
// });

// });
