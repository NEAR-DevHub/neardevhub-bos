import { expect, test } from "@playwright/test";

test("should go to the create-proposal page, write a description with mention, and show the preview", async ({
  //
  page,
}) => {
  await page.goto("/devhub.near/widget/app?page=create-proposal");
  const editor = await page
    .frameLocator("iframe")
    .locator(".CodeMirror textarea");

  await editor.focus();
  await editor.fill("Some proposal by @petersalomonsen.near ");

  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Preview" }).click();

  const descriptionPreview = await page.getByText(
    "Some proposal by WebAssembly Music"
  );

  expect(descriptionPreview).toBeVisible();
  expect(descriptionPreview).toContainText("Some proposal");
  expect(
    page.getByRole("link", { name: "WebAssembly Music @petersalomonsen.near" })
  ).toBeVisible();
  await page.waitForTimeout(1000);
});
