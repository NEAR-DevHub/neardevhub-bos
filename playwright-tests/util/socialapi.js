export async function mockSocialIndexResponses(page, customhandler) {
  await page.route("https://api.near.social/index", async (route) => {
    const request = await route.request();

    const requestPostData = request.postDataJSON();
    const response = await route.fetch();
    const json = await response.json();

    await route.fulfill({
      response,
      json: customhandler({ requestPostData, json }) ?? json,
    });
  });
}
