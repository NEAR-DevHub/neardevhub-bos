import { expect } from "@playwright/test";

export const pauseIfVideoRecording = async (page) => {
  let isVideoRecorded = (await page.video()) ? true : false;
  if (isVideoRecorded) {
    await page.waitForTimeout(500);
  }
};

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

export const clickWhenSelectorIsVisible = async (page, selector) => {
  waitForSelectorToBeVisible(page, selector);
  await page.click(selector);
};
