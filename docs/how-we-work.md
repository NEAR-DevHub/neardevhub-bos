# How we work

Welcome to our community of DevHub contributors! Our main goal is to deliver impact features that help developers thrive and contribute to the NEAR ecosystem. This document provides an overview of how we collaborate across different time zones using lightweight and mostly asynchronous processes. 

## Agreements

As contributors, we believe we can all succeed when we embrace these principles:

* **Ownership & Code Quality**: Take full ownership of assigned issues, delivering high-quality code. Adhere to our developer workflow and limit work in-progress to two issues at a time.

* **Participation & Support**: Participate daily by promptly responding to requests and supporting fellow contributors.

* **Visibility & Organization**: Maintain visibility on your progress by keeping tickets up to date. Additionally, contribute to triaging tickets to maintain an organized backlog.

* **Code Review**: Code owners should commit to reviewing tickets at least twice a week for approximately one hour. This enables progress and unlocks others.

* **Risk Identification & Management**: Surface and address risks or blockers promptly, working collaboratively to minimize their impact.

* **Problem Solving**: Go beyond the acceptance criteria to understand and effectively address the underlying problem.


## Project Management

### Kanban Project Board

To track our progress and manage issues effectively, we use a [Kanban board](https://github.com/orgs/NEAR-DevHub/projects/4/views/1). The board consists of the following columns:

1. **Triage**: Issues that need processing, such as adding details, priority, and size.
2. **Backlog**: Issues that are accepted and ready for development.
3. **In Development**: Issues that are in active development.
4. **Blockers**: Issues that are blocked.
5. **In Review**: Issues that are waiting for peer review.
6. **Done**: Items that are shipped to production.
7. **Closed**: Items that we won’t fix or can’t reproduce.


```
Note: To update the status of tickets, you will need project permissions. If you don’t have these permissions, please leave a comment instead (e.g., “Move this ticket to `In Progress`”) and a DevHub Moderator will handle the necessary updates for you.
```

### Triaging

Triaging is the process of reviewing all new issues to ensure they are ready for development. Here's how we do it:   

1. **Validation**: Active DevHub contributors may review new issues in the triage column and determine if they are valid, actionable, and useful. We may update the title or description, verify the reproduction steps, remove duplicates, and apply the appropriate [labels](https://github.com/NEAR-DevHub/neardevhub-bos/labels), such as the [good first issues](https://github.com/NEAR-DevHub/neardevhub-bos/contribute) label to issues that are good for new developers.

2. **Prioritization**: DevHub Moderators will work to prioritize issues using these levels:
    * **P0**: Critical issues that need immediate attention.
    * **P1**: High-priority issues to address next.
    * **P2**: Medium-priority issues to address in the coming weeks.
    * **P3**: Low-priority issues to address in the future.

3. **Sizing**: DevHub contributors may estimate the level of effort using t-shirt sizes:
    * **XS**: 1/2 day
    * **S**: 1 day
    * **M**: 3 days
    * **L**: 1 Week
    * **XL**: 2 Weeks
    * **XXL**: 2+ Weeks

Please add questions or comments for any clarifications or design needs to help with estimation.

4. **Milestones**: DevHub Moderators will group several related tickets into themes using [milestones](https://github.com/NEAR-DevHub/neardevhub-bos/milestones), such as a new feature or improvements to a specific platform area.

5. **Start/End Dates**: Active DevHub contributors may assign estimated dates to help us plan roadmap and potential resource needs for specific deliverables.

Once an item is triaged, we move it to the [Backlog column](https://github.com/orgs/NEAR-DevHub/projects/4/views/1).

## Developer Workflow

Our development workflow guides us through managing issues and pull requests from start to finish. It consists of the following steps:

### 1. **Select Issues**

    1. You can pick any issues from the Backlog column and indicate your interest by leaving a comment. A DevHub Moderator will assign the ticket to you.
    2. If an issue has an estimation or the existing estimation seems off, add your estimation with one or two sentences explaining why you think it will take that amount of time.

Note: We expect you to complete your ticket within the number of days you committed. So if a ticket is ~3 days, you should be able to request a review on the third or fourth day.


### 2. **Start Working** 

    1. Move the issue to “In Progress” and add the start date on our project board once you start working on it.
    2. Reference the issue in the PR description with “_Resolves #XX_”, so it is automatically linked, it is easy to find the prior context and expectations, and the issue will get automatically closed once PR is merged
    3. Use a draft PR to indicate that the work is not ready and you are working on it

Notes: We may reassign issues that are not in progress yet. So it is important to indicate once you start working on it. 

### 3. **Implement tests**

    1. As part of every development work, there should be tests that cover the functionality you have made, or the bug you have fixed
    2. Implement tests to ensure that other developers will be warned if they break your code by accident
    3. Also use tests to speed up your own development workflow. Writing tests during implementation should reduce the code-test iteration loop time.
    4. Help the Pull Request reviewer, your tests should clearly describe what you have implemented. The better the test coverage, the better are the chances of getting your PR approved.
    5. For more information about writing tests look into the contribution guidelines.

[contribution guidelines](https://github.com/NEAR-DevHub/neardevhub-bos/blob/main/CONTRIBUTING.md#writing-tests)

### 4. **Update Tickets**

    1. If your ticket blocked:
        1. Identify blocker: Add a comment specifying the blocker, what actions you have already taken to understand and mitigate the problem, and tag the appropriate people and specify what you need. Move the ticket to the blocked column.
        2. Own resolution: Add daily comments to the ticket to communicate the progress. Try to resolve the blocking ticket or find an owner for it. Once the blocker is resolved, add a comment specifying that it is no longer blocker. Move the ticket back to the backlog. 
    2. If your ticket takes longer than your estimation time:
        a. Add a comment specifying why the ticket is larger than your original estimate and what actions have you already taken, and what are your next steps. 
        b. Tag the Tech Lead and propose a new estimate for the amount of time you need to finish the task, along with the rationale for it. Or specify if you need someone else to take over.
        c. Add a daily comment to the ticket to indicate your progress.

[Example 2b](https://github.com/NEAR-DevHub/neardevhub-bos/pull/126#issuecomment-1554330035)

### 5. **Request Review** 

    1. Deploy a preview version, see how to deploy a preview version below. Once you completed your work, and provide the link in the PR description.
    2. Test the preview version to ensure everything works and meets the acceptance criteria
    3. Change the PR from draft to “ready for review”

### 6. **Review** 

    1. Another team member should review your work within one day. If you do not get a response, escalate on our Telegram channel.
    2. For reviewers: If there are no reviews by the end of your work day, please leave your review. 
    3. We require one code owner review, and in the case the reviewer has questions about the UI/UX, a review from the PM, to approve the pull request.

### 7. **Address Review** 
    1. Address any new review comments within 2 business days
    2. Respond to each comment by either following the suggestion or providing a rationale for disagreement.
    3. Request further review from the same reviewer.

### 8. **Completion**

    1. If the PR is approved, a DevHub Tech Lead squash and merge the PR and the issue is considered done.
    2. Move the issue to the “Done” column in our project board
    3. Add the end date to the issue.


## Communication

We use the following channels for communication:

* **GitHub**: For specific issues and pull requests. Enable [notifications](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications) to ensure you get the latest updates.
* **Telegram**: For general questions or concerns.
* **Weekly Standup Calls**: To discuss progress, plans, and blockers.

In case of urgent matters, you may request an ad hoc call.

Thank you for your commitment to the DevHub community! We look forward to collaborating with you.
