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

We use `npm` and scripts in `package.json` to automate common developer tasks, so you will need NodeJS and then install project dependencies as usual:

```sh
npm install
```

### Development

#### Run the dev script

To initiate the development environment, you can use the following script. This script will first check if bos-loader is installed and, if not, install it. Then, it will serve the default development environment.

```sh
npm run dev
```

#### Customizing Creator ID, Contract ID, or Network

If you need to customize the account ID, override the contract ID, or specify a different network for your development environment, you can use the following flags:

-a or --account: Specify the desired account ID.
-c or --contract: Override the default contract ID.
-n or --network: Set the network environment.

Here's how you can use these flags:

```sh
npm run dev -a your_account_id -c your_contract_id -n your_network
```

For example:

```sh
npm run dev -a bob.near -c contract.bobs.near -n mainnet
```

By using these flags, you have the flexibility to customize the development environment according to your specific needs.


#### Developing across multiple environments

When referencing a component or any parameter that depends on the network, please use the placeholders defined in replacements.*.json. There are three such files that correspond to different environments:

`replacements.dev.json` - deploys the develop branch, to testnet @ test.beta.near.org 

`replacements.testnet.json` - deploys main branch, to testnet @ test.near.org

`replacements.mainnet.json` - deploys main branch to mainnet @ near.org

Placeholders should be encapsulated in the ${} expression. Here is an example of a placeholder usage:

`<Widget src={homepage ?? "${REPL_ACCOUNT}/widget/ActivityPage"} />`

Placeholders are replaced with the target values specified in replacements.json when github actions deploys the components.

Feel free to specify a new placeholder if needed. The placeholder should have a REPL prefix, for example: `REPL_PROJECT_NAME`

A new placeholder should be defined for all three environments: dev-testnet, prod-testnet and prod-mainnet.

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

There is GitHub Actions automation that deploys all the widgets to [`devgovgigs.near` account](https://near.social/#/${REPL_MOB}/widget/MyPage?accountId=devgovgigs.near) on mainnet on every push to the main branch.
Thus, once a PR is merged, you should see the new version of the widgets on [DevHub](https://neardevhub.org) in less than 15 seconds.

### Before Publishing
Before publishing, make sure that you’ve go through this section.

#### Code Style and Formatting

We use `prettier` to unify formatting. Run the following command to format your code:

```
npm run fmt
```

#### Writing tests

We use [Playwright](https://playwright.dev) for tests, which are located in the [playwright-tests](./playwright-tests/) folder. For each change or addition to the codebase you should also make sure that your changes are covered by tests in order to ensure that other developers will not break it in the future. Also you should write tests to accelerate your own development, so that you don't have to do manual coding/test interations via the browser.

See the [test-pipeline](./.github/workflows/continuous-integration-workflow.yml) for what dependencies that needs to be installed on your workstation for tests to run.


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
