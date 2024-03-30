Developing with the "Don't ask again" feature
=============================================

NEAR BOS has the "Don't ask again" feature on transactions for changes to SocialDB, or calling any contract. For an optimal user experience in BOS applications, both the transaction confirmation dialog, and transactions being executed without confirmation ( when the "Don't ask again" feature is enabled ), should be handled.

When executing a transaction that does not confirm with the wallet, it is important to make the user aware of the ongoing transaction. NearSocialVM will show a toast in the bottom right, informing that a transaction is in process, but it might take time for this to appear, and also it does disappear when the transaction is complete, but still the page might not have been fully refreshed.

We would like to avoid that the user double clicks any submit or like button, so then we should ensure that the button is disabled immediately once cliked. Also there should be an loading indicator on the button, like a spinner.

After the transaction is complete, we would not want the user to think that a page reload is needed, so we still have to keep the loading indicator spinning, until VM cache invalidation occurs. Calling a view method on the changed data should ensure that we get fresh data, on cache invalidation, and then we can also remove the loading indicator.

An example of this is when posting community Announcements, that use the `devhub.entity.community.Compose` widget for editing and posting the announcement data. Here's how it references the widget:

```jsx
 <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.community.Compose"}
    props={{
    onSubmit: (v) => {
        setSubmittedAnnouncementData(v);
        setCommunitySocialDB({ handle, data: v });
    },
    profileAccountId: `${handle}.community.${REPL_DEVHUB_CONTRACT}`,
    isFinished: () => submittedAnnouncementData === null,
    }}
/>
```

Notice the `onSubmit` handler where we call the `setSubmittedAnnouncementData` state method, and set it to the submitted value. Then we have the `isFinished` handler which will check if it is set back to `null`. `isFinished` is called by the Compose widget to see if it can remove the loading spinner indicator.

For setting the `submittedAnnouncementData` back to `null`, there is `useEffect` statement that triggers when it is set by the `onSubmit` handler:

```jsx
useEffect(() => {
  if (submittedAnnouncementData) {
    const checkForAnnouncementInSocialDB = () => {
      Near.asyncView("${REPL_SOCIAL_CONTRACT}", "get", {
        keys: [`${communityAccountId}/post/**`],
      }).then((result) => {
        try {
          const submittedAnnouncementText = JSON.parse(
            submittedAnnouncementData.post.main
          ).text;
          const lastAnnouncementTextFromSocialDB = JSON.parse(
            result[communityAccountId].post.main
          ).text;
          if (submittedAnnouncementText === lastAnnouncementTextFromSocialDB) {
            setSubmittedAnnouncementData(null);
            return;
          }
        } catch (e) {}
        setTimeout(() => checkForAnnouncementInSocialDB(), 1000);
      });
    };
    checkForAnnouncementInSocialDB();
  }
}, [submittedAnnouncementData]);
```

As you can see this is calling `social.get` to check if the latest post text matched the text we submitted. As long as it does not, we assume the transaction has not completed, and we have a `setTimeout` to try again one second later. If it matches we set the `submittedAnnouncementData` back to null, which will then also signal the Compose component to remove the loading spinner, and re-enable the submit button.

# Limitations of BOS loader

When developing locally, it is popular to use the BOS loader in combination with `flags` on https://near.org/flags pointing to your local development environment hosted by BOS loader. Unfortunately BOS is not able to detect your widget for the transaction confirmation, and so "Don't ask again" will not work. In order to test "Don't ask again" when working locally, you rather need to mock the responses of RPC calls to fetch your locally stored widgets. This can be done using Playwright, and you can see an example of such a mock in [bos-loader.js](../../playwright-tests/util/bos-loader.js). Using this approach `flags` is not used, but instead your playwright test browser, when it calls to RPC for the widget contents, will receive the contents served by your local BOS loader.
