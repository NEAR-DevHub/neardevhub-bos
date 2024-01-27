Feature: Trustee dashboard
===========================

This document presents the high level overview / outline of backlog items to be added for implementing the "Trustee dashboard".

The "Trustee dashboard" consist of functionality for:
    - the moderators/sponsors that reviews and approves the proposals, register the recipients, and make the payment requests
    - the trustees that make the actual payment

# Overall acceptance criterias ( applies to each user story ))

- Verify that the UI implementation corresponds to the Figma design
- Verify frontend automatic tests
    - Verify that there's an automatic playwright test visualized in an automatically generated screen recording
    - Verify that the tests covers relevant usage and misuse scenarios
    - Verify that the tests demonstrates how the UI is guiding the user in an intuitive way by providing validation messages and hints
- Verify backend
    - Verify that the contract implements the data structure that represents the frontend
    - Verify that the contract implements the same verification mechanisms and validation messages as the frontend
- Verify backend automatic tests
    - Verify that there are unit test on the detailed level covering multiple variants of input and expectations
    - Verify that there are integration tests using near-workspaces-rs for covering the scenarios of input and expected output from the frontend
    - Verify that the playwright tests interacts with a testnet contract, to show the full end-to-end flow
- Before merge: Verify that the functionality, test coverage (as shown by the screen recording), is according to expectations of the product owner.

# User stories 

### Manage recipients

As a moderator
I need a table of recipients with the possiblity of editing and removing recipients
So that I can manage the known recipients of funds granted to proposals

**Acceptance criterias**

- Verify that only moderators can access the UI and the transactional contract methods
- Verify that the recipients are stored on the contract for the sponsoring DAO

#### Create recipient

As a moderator
I need a form for registering a recipient
So that I can add a receiver of proposal grants to the list of known recipients

**Acceptance criterias**

- Verify that only moderators can access the UI and transactional contract methods
- Verify that the recipients are stored on the contract for the sponsoring DAO

### Transaction history

As a moderator
I need a list of payment transactions from payment requests
So that I can track the payment status of the payment requests I've made

**Acceptance criterias**

- Verify that only moderators can access the UI
- Verify that the transaction history is retrieved from the DAO contract

### Create payment request

As a moderator
I need a for for creating a payment request
So that I can register the details of recipient, amount, currency etc of a grant to be paid out to a recipient

**Acceptance criterias**

- Verify that only moderators can access the UI
- Verify that only moderators can access the contract methods for creating a payment request
- Verify that the payment request is crated on the DAO contract

## Trustees

### Need approvals

As a trustee
I need a table of pending payment requests
So that I can review the requests and make the payments

**Acceptance criterias**

- Verify that only trustees can access the UI
- Verify that only trustees can call the DAO contract method behind the "Pay" button

### Payment history

As a trustee
I need a table of historic payment transactions
So that I can keep a log of the payments I've made

**Acceptance criterias**

- Verify that only trustees can access the UI

### Treasury

As a trustee
I need a view of my treasury balances
So that I can see how much funds I'm managing

**Acceptance criterias**

- Verify that only trustees can access the UI
