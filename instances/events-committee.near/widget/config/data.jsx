const proposalFeedAnnouncement = (
  <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
    <p className="d-flex gap-3 align-items-center mb-0">
      <div>
        <i class="bi bi-info-circle"></i>
      </div>
      <div>
        <span className="fw-bold">
          Welcome to the Events Committee Proposal Feed!
        </span>
        This dedicated space makes it easy to submit and track funding proposals
        from the Events Committee, the cross-team organization responsible for
        hosting and sponsoring developer-focused events. You are welcome to
        respond to any RFPs that are accepting submissions or submit an
        independent proposal.
      </div>
    </p>
  </div>
);

const categoryOptions = [
  { title: "Bounty", value: "Bounty", color: [124, 102, 220] },
  {
    title: "Bounty booster",
    value: "Bounty booster",
    color: [220, 194, 102],
  },
  { title: "Hackathon", value: "Hackathon", color: [4, 164, 110] },
  { title: "Hackbox", value: "Hackbox", color: [220, 102, 102] },
  {
    title: "Event sponsorship",
    value: "Event sponsorship",
    color: [13, 174, 187],
  },
  { title: "Meetup", value: "Meetup", color: [220, 152, 102] },
  {
    title: "Travel expenses",
    value: "Travel expenses",
    color: [211, 102, 220],
  },
  { title: "Other", value: "Other", color: [155, 161, 166] },
];

return {
  portalName: "Events Committee",
  contract: "events-committee.near",
  proposalFeedIndexerQueryName:
    "thomasguntenaar_near_event_committee_prod_v1_proposals_with_latest_snapshot",
  indexerHasuraRole: "thomasguntenaar_near",
  cacheUrl: "${REPL_CACHE_URL}",
  isEvents: true,
  proposalFeedAnnouncement,
  availableCategoryOptions: categoryOptions,
};
