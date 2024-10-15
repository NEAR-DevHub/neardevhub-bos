// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./playwright-tests/tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 8 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? "50%" : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "line",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    video: "off",
    headless: true,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:8080",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "infrastructure",
      testMatch: /(infrastructure|proposal)\/.*.spec.js/,
      use: {
        ...devices["Desktop Chrome"],
        account: "infrastructure-committee.near",
        linksTestProposalId: 1,
        linksTestCommentAuthorId: "as2.near",
        linksTestCommentBlockHeight: 124005661,
      },
    },
    {
      name: "events",
      testMatch: /(events|proposal)\/.*.spec.js/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:8080",
        account: "events-committee.near",
        linksTestProposalId: 1,
        proposalAuthorAccountId: "yarotska.near",
        linksTestCommentAuthorId: "rimberjack.near",
        linksTestCommentBlockHeight: 118849805,
      },
    },
    {
      name: "devhub",
      testMatch: /(blog|community|other|proposal|sunset)\/.*.spec.js/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:8080",
        account: "devhub.near",
        proposalAuthorAccountId: "megha19.near",
        linksTestProposalId: 127,
        linksTestCommentAuthorId: "theori.near",
        linksTestCommentBlockHeight: 121684702,
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npm run gateway:all`,
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
