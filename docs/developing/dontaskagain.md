Developing with the "Don't ask again" feature
=============================================

NEAR BOS has the "Don't ask again" feature on transactions for changes to SocialDB, or calling any contract. For an optimal user experience in BOS applications, both the transaction confirmation dialog, and transactions being executed without confirmation ( when the "Don't ask again" feature is enabled ), should be handled.

When executing a transaction that does not confirm with the wallet, it is important to make the user aware of the ongoing transaction. NearSocialVM will show a toast in the bottom right, informing that a transaction is in process, but it might take time for this to appear, and also it does disappear when the transaction is complete, but still the page might not have been fully refreshed.

We would like to avoid that the user double clicks any submit or like button, so then we should ensure that the button is disabled immediately once cliked. Also there should be an loading indicator on the button, like a spinner.

After the transaction is complete, we would not want the user to think that a page reload is needed, so we still have to keep the loading indicator spinning, until VM cache invalidation occurs. Calling a view method on the changed data should ensure that we get fresh data, on cache invalidation, and then we can also remove the loading indicator.

## Limitations of BOS loader

When developing locally, it is popular to use the BOS loader in combination with `flags` on https://near.org/flags pointing to your local development environment hosted by BOS loader. Unfortunately BOS is not able to detect your widget for the transaction confirmation, and so "Don't ask again" will not work. In order to test "Don't ask again" when working locally, you rather need to mock the responses of RPC calls to fetch your locally stored widgets. This can be done using Playwright, and you can see an example of such a mock in [bos-loader.js](../../playwright-tests/util/bos-loader.js). Using this approach `flags` is not used, but instead your playwright test browser, when it calls to RPC for the widget contents, will receive the contents served by your local BOS loader.
