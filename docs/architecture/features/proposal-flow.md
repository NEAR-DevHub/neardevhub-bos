Feature: Proposal flow
======================

This document presents the high level overview / outline of backlog items to be added for implementing the "Proposal flow".

The "Proposal flow" consist of functionality for:
    - those making a proposal and applying for funding
    - the moderators/sponsors that reviews and approves the applications, register the recipients, and make the payment requests
    - the trustees that make the actual payment

# User stories 

The actual user stories are presented below, but first, here are someacceptance criterias that apply to all user stories.

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

## Proposals

### Proposal form

As someone who has a proposal
I need a proposal form
So that I can register and edit my proposal, and submit it for review

**Acceptance criterias**

- Verify that there is a form where the proposer can select category, type the title, write a summary and a description, as shown in the Figma illustration
- Verify that the proposal form page has final consent checkboxes as shown in Figma 
- Verify that it is possible to provide funding details as specified in Figma
- Verify that after submission, and marked as ready for review, the form is not editable anymore

#### Link proposal

As a proposer
I need a section in the proposal form for linking to other proposals
So that I have the option to create links to other relevant proposals

**Acceptance criterias**

- Verify that it is possible to search for other proposals
- Verify that it is possible to select another proposal from search, and that it will be added as a link

#### Proposal timeline

As a proposer
I need a timeline of the milestones in the proposal flow
So that I can follow the progress of my proposal

**Acceptance criterias**

- Verify that I can see the radio buttons and checkboxes as in the Figma design, but not modify them
- Verify that the timeline progress is updated according to the stage of the proposal

### Proposal feed

As a user of the proposals functionality
I need a feed page
So that I can see all the proposals and search for specific ones

## Moderators

### Proposal timeline

As a moderator
I need checkboxes and radio buttons to control the progress of the proposal timeline
So that I can provide feedback to the proposer on the status of the proposal

**Acceptance criterias**

- Verify that only a moderator can modify the timeline state
- Verify that the access restrictions are implemented both in the contract and the UI

### Manage recipients

As a moderator
I need a table of recipients with the possiblity of editing and removing recipients
So that I can manage the known recipients of funds granted to proposals

**Acceptance criterias**

- Verify that only moderators can access the UI and the contract methods

#### Create recipient

As a moderator
I need a form for registering a recipient
So that I can add a receiver of proposal grants to the list of known recipients

### Transaction history

As a moderator
I need a list of payment transactions from payment requests
So that I can track the payment status of the payment requests I've made

### Create payment request

As a moderator
I need a for for creating a payment request
So that I can register the details of recipient, amount, currency etc of a grant to be paid out to a recipient

## Trustees

### Need approvals

As a trustee
I need a table of pending payment requests
So that I can review the requests and make the payments

### Payment history

As a trustee
I need a table of historic payment transactions
So that I can keep a log of the payments I've made

### Treasury

As a trustee
I need a view of my treasury balances
So that I can see how much funds I'm managing
