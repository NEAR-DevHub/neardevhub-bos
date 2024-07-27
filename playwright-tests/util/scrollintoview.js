export async function scrollIntoView(page) {
  await page.evaluate(() => {
    (async function () {
      const urlSearchParams = new URLSearchParams(location.search);
      const accountId = urlSearchParams.get("accountId");
      const blockHeight = urlSearchParams.get("blockHeight");
      if (accountId && blockHeight) {
        for (let n = 0; n < 20; n++) {
          const linkElementSelector = `#${accountId.replace(
            /[^a-z0-9]/g,
            ""
          )}${blockHeight}`;

          const linkElement = document.querySelector(linkElementSelector);
          if (linkElement) {
            linkElement.scrollIntoView();
            console.log("scrolled into view");
            break;
          }
          await new Promise((resolve) => setTimeout(() => resolve(), 500));
        }
      }
    })();
  });
}
