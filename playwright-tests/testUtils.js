import { expect } from "@playwright/test";

export const pauseIfVideoRecording = async (page) => {
  let isVideoRecorded = (await page.video()) ? true : false;
  if (isVideoRecorded) {
    await page.waitForTimeout(500);
  } else {
    await page.waitForTimeout(100);
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

export function generateRandom6CharUUID() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}
