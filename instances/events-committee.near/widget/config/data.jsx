const BannerWrapper = styled.div`
  background-image: linear-gradient(rgb(251 32 32), rgb(187 6 6));
  color: white;
  .text-sm {
    font-size: 13px;
  }
`;

const proposalFeedAnnouncement = (
  <BannerWrapper className="d-flex gap-3 align-items-center mb-4 p-3 rounded-3">
    <div>
      <i class="bi bi-exclamation-triangle-fill"></i>
    </div>
    <div>
      <div className="fw-bold">This page is now archived! </div>
      <div className="text-sm">
        Visit
        <a
          href="https://nearn.io/"
          className="text-decoration-underline d-inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          NEARN
        </a>
        to discover the latest opportunities.
      </div>
    </div>
  </BannerWrapper>
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
