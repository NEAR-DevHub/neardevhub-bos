# How we work

We use a lightweight asynchronous project management approach to enable collaboration between individuals from various time zones. 

## Kanban Project Board

We use a [Kanban board](https://github.com/orgs/near/projects/60/views/1) to track our progress. The board is divided into six columns:  

1. **Triage**: Issues that need processing, such as adding details, priority, and size.
2. **Backlog**: Issues that are accepted and ready for development.
3. **In Development**: Issues that are in active development.
4. **Blockers**: Issues that are blocked.
5. **In Review**: Issues that are waiting for peer review.
6. **Done**: Items that are shipped to production.

## Triaging

Triaging is the process of reviewing all new issues to ensure they are ready for development. Here's how we do it:   

1. **Validation**: We review new issues in the triage column and determine if they are valid, actionable, and useful. We may update the title or description, verify the reproduction steps, remove duplicates, and apply the appropriate [labels](https://github.com/near/devgigsboard-widgets/labels).
2. **Prioritization**: We use a prioritization system with four levels: 
    * **P0**: Critical issues that need immediate attention.
    * **P1**: High-priority issues to address next.
    * **P2**: Medium-priority issues to address in the coming weeks.
    * **P3**: Low-priority issues to address in the future.

3. **Sizing**: We use an estimated level of approach with five levels:
    * **XS**: 1/2 day
    * **S**: 1 day
    * **M**: 3 days
    * **L**: 5 days
    * **XL**: 6+ days

4. **Milestones**: We apply [milestones](https://github.com/near/devgigsboard-widgets/milestones) to group several related tickets into themes, such as a new feature or improvements to a specific area of the platform.

5. **Start/End Dates**: We apply estimated dates to help us plan roadmap & potential resourcing needs for specific deliverables.  

Once an item is triaged, we move it to the [Backlog column](https://github.com/orgs/near/projects/60).

## Expectations

We expect the code owners to commit to reviewing tickets at least twice a week (Monday and Thursday) for around one hour. This will help ensure that we process tickets and resolve blockers quickly. If we cannot meet these expectations, anyone can request an ad hoc call.  

Expectation includes:

* **Open Comments**: Everyone should review and respond to any open comments where they are tagged.
* **Blocked Issues**: Move any blocked issues to the Blockers column and tag the appropriate people with more info on what you need.
* **Triage**: Everyone should apply their appropriate triage steps and ensure tickets are up to date:
  * TPMs & developers help validate issues.
  * TPM & Leadership update the priority using the [priorities](https://github.com/orgs/near/projects/60/views/2) tab.
  * Developers actively review and update sizing using the [sizing](https://github.com/orgs/near/projects/60/views/3) tab and add questions or comments for any clarifications or design needs. Also add estimated start/end dates and apply the [good first issues](https://github.com/near/devgigsboard-widgets/contribute) label to issues that are good for new developers.
* **Work In Progress Limit**: When you are ready to work on an issue, pre-assign yourself to the ticket and update the status to "In Development." Ideally, there should be a maximum work-in-progress limit of 2 issues per person. You can pre-assign yourself to up to two tickets in the backlog if you think you are best suited for it and plan to work on it next.
