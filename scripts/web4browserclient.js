/**
 * This file is loaded by the web4 gateway to scroll linked posts into view.
 */

(async function () {
  const urlSearchParams = new URLSearchParams(location.search);
  const accountId = urlSearchParams.get("accountId");
  const blockHeight = urlSearchParams.get("blockHeight");
  if (accountId && blockHeight) {
    for (let n = 0; n < 40; n++) {
      const linkElementSelector = `#${accountId.replace(
        /[^a-z0-9]/g,
        ""
      )}${blockHeight}`;

      const linkElement = document.querySelector(linkElementSelector);
      const loadingElement = document.querySelector(
        'span.spinner-grow-sm[role="status"]'
      );
      if (loadingElement === null && linkElement !== null) {
        linkElement.scrollIntoView();
        break;
      }
      await new Promise((resolve) => setTimeout(() => resolve(), 500));
    }
  }
})();
