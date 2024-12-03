import { test } from "../../util/multiinstance.js";
import { expect } from "@playwright/test";

test.describe("feed", () => {
  test("proposal status should be same as in the production feed", async ({
    page,
    account,
  }) => {
    test.setTimeout(60_000);
    const compareLocalAndProd = async ({ author }) => {
      await page.goto(`/${account}/widget/app?page=proposals`);

      await expect(page.locator(".proposal-card").first()).toBeVisible({
        timeout: 20_000,
      });

      await page.getByRole("button", { name: "Author" }).click();
      await page.getByRole("list").getByText(author).click();

      await expect(
        await page.getByRole("img", { name: "loader" })
      ).not.toBeVisible();
      await expect(await page.locator(".spinner-grow")).toHaveCount(0, {
        timeout: 10_000,
      });

      const localStatusTags = await page
        .locator(
          '[data-component="devhub.near/widget/devhub.entity.proposal.StatusTag"]'
        )
        .allInnerTexts();

      const localLinks = await page
        .locator("a")
        .filter({ has: page.locator(".proposal-card") });

      await page.goto(`https://${account}.page/proposals`);
      await expect(page.locator(".proposal-card").first()).toBeVisible({
        timeout: 10_000,
      });

      await page.getByRole("button", { name: "Author" }).click();
      await page.getByRole("list").getByText(author).click();

      await expect(await page.locator(".spinner-grow")).toHaveCount(0, {
        timeout: 10_000,
      });
      await expect(
        await page.getByRole("img", { name: "loader" })
      ).not.toBeVisible();

      const prodLinks = await page
        .locator("a")
        .filter({ has: page.locator(".proposal-card") });

      expect(localLinks).toEqual(prodLinks);
      const prodStatusTags = await page
        .locator(
          '[data-component="devhub.near/widget/devhub.entity.proposal.StatusTag"]'
        )
        .allInnerTexts();

      expect(localStatusTags).toEqual(prodStatusTags);
    };
    if (account === "devhub.near") {
      await compareLocalAndProd({ author: "petersalomonsen.near" });
      await compareLocalAndProd({ author: "megha19.near" });
      await compareLocalAndProd({ author: "thomasguntenaar.near" });
    } else if (account === "events-committee.near") {
      await compareLocalAndProd({ author: "petersalomonsen.near" });
    } else if (account === "infrastructure-committee.near") {
      await compareLocalAndProd({ author: "mob.near" });
    }
  });
});
