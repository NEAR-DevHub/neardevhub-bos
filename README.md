NEAR Gigs Board
===============

Gigs Board is a community platform to share ideas, match solutions, and receive support.
Gigs Board was implemented [by NEAR Developer Governance community](https://neardevgov.org), and all major developments will be carried through the [DevGov Gigs Board](https://devgovgigs.near.social).

This repository holds [NEAR Social](https://near.social) widgets to interact with the [Gigs Board smart-contract](https://github.com/near/devgigsboard).

## How to Contribute?

Join the forces by starting from the [project board](https://github.com/orgs/near/projects/60).
Feel free to pick any issue from the Ready, Backlog, or New columns, clarify the requirements, if necessary, and indicate that you are interested in working on it by leaving comments.
Also, you may suggest improvements by creating a [new issue](https://github.com/near/devgigsboard-widgets/issues/new).

## How to Develop?

JSX files in this repository are NEAR Social widgets, so before you start, [get familiar with the platform](https://thewiki.near.page/PastPresentAndFutureOfNearSocial).

### Prerequisites

We use `npm` and scripts in `package.json` to automate common developer tasks, so you will need NodeJS and then install project dependencies as usual:

```
npm install
```

### Making Changes to common.jsx

`common.jsx` contains a set of shared utilities that is often reused in Gigs Board widgets. When you need to change it, just edit the file in the root of the project, and update the widgets with this one command:

```
npm run build
```

### Code Style

Before publishing, we use `prettier` to unify formatting:

```
npm run fmt
```

### Deploy for Testing

Currently, there is no local development environment, so we use [testnet NEAR Social](https://test.near.social) to deploy widgets and test them out.

To deploy the widgets, we use [`near-social` CLI](https://github.com/FroVolod/near-social). Start with this command and follow the interactive questionary:

```
near-social deploy
```

After successful deployment, you will see a full command that could be used to re-deploy the widgets without interactive questionary, like this:

```
near-social deploy gigs.frol14.testnet sign-as gigs.frol14.testnet network-config testnet sign-with-macos-keychain send
```

Once deployed, open `gigs-board.pages.Feed` widget on your account on testnet NEAR Social:

```
https://test.near.social/#/YOUR_ACCOUNT_ID/widget/gigs-board.pages.Feed?nearDevGovGigsContractAccountId=gigs.frol14.testnet
```

NOTE: If you have [devgigsboard contract](https://github.com/near/devgigsboard) deployed to the same account, you can skip the `nearDevGovGigsContractAccountId` argument, otherwise, feel free to use the contract deployed to `gigs.frol14.testnet`.

### Deploy for Production

There is GitHub Actions automation that deploys all the widgets to [`devgovgigs.near` account](https://near.social/#/mob.near/widget/MyPage?accountId=devgovgigs.near) on mainnet on every push to the main branch.
Thus, once a PR is merged, you should see the new version of the widgets on [DevGov Gigs Board](https://devgovgigs.near.social) in less then 15 seconds.
