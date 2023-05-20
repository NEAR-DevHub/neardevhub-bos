# Contributing to NEAR DevHub Components

We appreciate community contributions! Before you start writing code, we recommend for developers to:
- Review the list of [good first issues](https://github.com/near/devgigsboard-widgets/contribute). You can pick any issues from the [Backlog column](https://github.com/orgs/near/projects/60) and indicate your interest by leaving comments. 
- Get familiar with the [NEAR Social](https://thewiki.near.page/PastPresentAndFutureOfNearSocial) plaform, since the JSX files in this repository are NEAR Social components.

- Review the list of [good first issues](https://github.com/near/devgigsboard-widgets/contribute). You can pick any issues from the [Backlog column](https://github.com/orgs/near/projects/60) and indicate your interest by leaving comments.
- Get familiar with the [NEAR Social](https://thewiki.near.page/PastPresentAndFutureOfNearSocial) plaform, since the JSX files in this repository are NEAR Social widgets.

## Prerequisites

We use `npm` and scripts in `package.json` to automate common developer tasks, so you will need NodeJS and then install project dependencies as usual:

```shell
npm install
```

## Code Style

Before publishing, we use `prettier` to unify formatting:

```shell
npm run fmt
```

## Deployment

### Deploy for Testing

Currently, there is no local development environment, so we use [testnet NEAR Social](https://test.near.social) to deploy widgets and test them out.

To deploy the widgets, we use [`bos` CLI](https://github.com/FroVolod/bos-cli-rs). Start with this command and follow the interactive questionary:

```
bos components deploy
```

After successful deployment, you will see a full command that could be used to re-deploy the widgets without interactive questionary, like this:

```
bos components deploy gigs.frol14.testnet sign-as gigs.frol14.testnet network-config testnet sign-with-macos-keychain send
```

Once deployed, open `gigs-board.pages.Feed` widget on your account on testnet NEAR Social:

```shell
https://test.near.social/#/YOUR_ACCOUNT_ID/widget/gigs-board.pages.Feed?nearDevGovGigsContractAccountId=gigs.frol14.testnet
```

NOTE: If you have [DevHub contract](https://github.com/near/neardevhub-contract) deployed to the same account, you can skip the `nearDevGovGigsContractAccountId` argument, otherwise, feel free to use the contract deployed to `gigs.frol14.testnet` (on testnet) or `devgovgigs.near` (on mainnet).

### Deploy for Production

There is GitHub Actions automation that deploys all the widgets to [`devgovgigs.near` account](https://near.social/#/mob.near/widget/MyPage?accountId=devgovgigs.near) on mainnet on every push to the main branch.
Thus, once a PR is merged, you should see the new version of the widgets on [DevHub](https://neardevhub.org) in less then 15 seconds.

## Helpful Tips

### Making Changes to common.jsx

`common.jsx` contains a set of shared utilities that is often reused in DevHub widgets. When you need to change it, just edit the file in the root of the project, and update the widgets with this one command:

```shell
npm run build
```

### Storage Deposit

Sometimes there is a need to deposit extra tokens to cover the widgets storage cost. You can do that with [`bos` CLI](https://github.com/FroVolod/bos-cli-rs):

```
bos social-db prepaid-storage deposit
```

NOTE: `bos` CLI will interactively ask all the rest of the details to prepare the transaction.
