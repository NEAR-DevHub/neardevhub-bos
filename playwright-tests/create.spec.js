import { test } from "@playwright/test";
import {setInputAndAssert, selectAndAssert} from './testUtils';

test("should be able to submit a solution with USDC as currency", async ({ page }) => {
    await page.goto("/devgovgigs.near/widget/gigs-board.pages.Create");

    await page.click('[data-testid="btn-solution"]');
    await setInputAndAssert(page, '[data-testid="input-title"]', 'The test title');

    await page.click('[data-testid="btn-request-funding"]');
    await selectAndAssert(page, '[data-testid="select-currency"]', 'USDC');
    await setInputAndAssert(page, '[data-testid="input-amount"]', '300');
});