import { expect } from "@playwright/test";

export const setCookieConsentAccepted = async (page) =>
  await page.context().addCookies([
    {
      name: "_iub_cs-71185313",
      value:
        "%7B%22consent%22%3Atrue%2C%22timestamp%22%3A%222023-10-12T16%3A03%3A31.031Z%22%2C%22version%22%3A%221.51.0%22%2C%22id%22%3A71185313%2C%22cons%22%3A%7B%22rand%22%3A%221438b8%22%7D%7D",
      domain: "near.org",
      path: "/",
    },
  ]);

export const setInputAndAssert = async (page, selector, value) => {
  await page.fill(selector, value);
  const actualValue = await page.inputValue(selector);
  expect(actualValue).toBe(value);
};

export const selectAndAssert = async (page, selector, value) => {
  await page.selectOption(selector, { value: value });
  const selectedValue = await page.$eval(selector, (select) => select.value);
  expect(selectedValue).toBe(value);
};

export const waitForSelectorToBeVisible = async (page, selector) => {
  await page.waitForSelector(selector, {
    state: "visible",
  });
};
