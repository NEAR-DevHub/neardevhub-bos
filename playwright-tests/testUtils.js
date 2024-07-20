import { expect } from "@playwright/test";

export async function showPageURLInTest(page) {
  await page.evaluate(() => {
    const urlDiv = document.createElement("div");
    urlDiv.style.position = "fixed";
    urlDiv.style.top = "0";
    urlDiv.style.left = "0";
    urlDiv.style.backgroundColor = "rgba(255, 200, 200, 0.8)";
    urlDiv.style.padding = "5px";
    urlDiv.style.zIndex = "10000";
    urlDiv.style.fontSize = "12px";
    urlDiv.style.fontFamily = "Arial, sans-serif";
    urlDiv.innerText = window.location.href;
    document.body.appendChild(urlDiv);
  });
}

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

export const waitForTestIdToBeVisible = async (page, testId) => {
  await page.waitForSelector(`[data-testid='${testId}']`, {
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

export function fmtDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleString("en-US", options);
}
