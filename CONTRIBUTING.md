# Contribution Guidelines for DevHub Repos

## Introduction

At DevHub, we value the contributions of each individual. This document provides an overview of the developer setup and deployment process to help you contribute to our project. We also recommend familiarizing yourself with [how we work](https://github.com/near/devgigsboard-widgets/blob/main/docs/how-we-work.md) to learn about our development process and enhance your contribution experience.

## Developer Setup

### Prerequisites

Before you start contributing to neardevhub-widgets, ensure you have the following prerequisites installed on your machine:

- Node.js (version 18 or higher)
- [`bos` CLI](https://github.com/FroVolod/bos-cli-rs)

To familiarize yourself with the NEAR Social platform, we recommend reviewing the [NEAR Social Documentation](https://thewiki.near.page/PastPresentAndFutureOfNearSocial), since the JSX files in this repository are NEAR Social components.

You can also explore a list of [good first issues](https://github.com/near/devgigsboard-widgets/contribute) to get familiar with potential work items.

### Installation

We use `pnpm` and scripts in `package.json` to automate common developer tasks, so you will need to run the following command in order to activate `pnpm` and install project dependencies:

```sh
npm run init
```

### Deployment

#### Deploy for Local Development and Testing

Currently, there is no local development environment, so we use [testnet NEAR Social](https://test.near.social) to deploy widgets and test them out during your development.

To deploy the widgets, we use [`bos` CLI](https://github.com/FroVolod/bos-cli-rs). Start with this command and follow the interactive questionnaire:

```
bos components deploy
```

After successful deployment, you will see a full command that could be used to re-deploy the widgets without interactive questionnaire, like this:

```
bos components deploy gigs.frol14.testnet sign-as gigs.frol14.testnet network-config testnet sign-with-macos-keychain send
```

Yours will not be exactly the same as this one. Please copy the printed command for a quick deployment next time.

Once deployed, open `gigs-board.pages.Feed` widget on your account on testnet NEAR Social:

```
https://test.near.social/#/YOUR_ACCOUNT_ID/widget/gigs-board.pages.Feed?nearDevGovGigsContractAccountId=gigs.frol14.testnet
```

NOTE: If you have [DevHub contract](https://github.com/near/neardevhub-contract) deployed to the same account, you can skip the `nearDevGovGigsContractAccountId` argument, otherwise, feel free to use the contract deployed to `gigs.frol14.testnet` (on testnet) or `devgovgigs.near` (on mainnet).

#### Deploy for Production

There is GitHub Actions automation that deploys all the widgets to [`devgovgigs.near` account](https://near.social/#/mob.near/widget/MyPage?accountId=devgovgigs.near) on mainnet on every push to the main branch.
Thus, once a PR is merged, you should see the new version of the widgets on [DevHub](https://neardevhub.org) in less than 15 seconds.

### Before Publishing

Before publishing, make sure that you’ve go through this section.

#### Code Style and Formatting

We use `prettier` to unify formatting. Run the following command to format your code:

```
npm run fmt
```

#### Making Changes to common.jsx

The `common.jsx` file contains a set of shared utilities that are often reused in DevHub widgets. When you need to change it, just edit the file in the root of the project, and update the widgets with this one command:

```
npm run build
```

#### Storage Deposit

Sometimes there is a need to deposit extra tokens to cover the widgets’ storage cost. You can do that with [`bos` CLI](https://github.com/FroVolod/bos-cli-rs):

```
bos social-db prepaid-storage deposit
```

NOTE: `bos` CLI will interactively ask all the rest of the details to prepare the transaction.
