const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

const proposalFeedAnnouncement = (
  <div className="bg-blue text-sm mt-2 p-3 rounded-3">
    <p className="d-flex gap-3 align-items-center mb-0">
      <div>
        <i className="bi bi-info-circle"></i>
      </div>
      <div>
        <span className="fw-bold">
          Welcome to the Infrastructure Committee Proposal Feed!
        </span>
        This dedicated space makes it easy to submit and track funding proposals
        from the Infrastructure Committee, the primary organization overseeing
        improvements pertaining to wallets, indexers, RPC services, explorers,
        oracles, bridges, NEAR Protocol features, and related ecosystem
        upgrades. You are welcome to respond to any RFPs that are accepting
        submissions or submit an independent proposal.
      </div>
    </p>
  </div>
);

const categoryOptions = [
  {
    title: "DevDAO Operations",
    value: "DevDAO Operations",
  },
  {
    title: "DevDAO Platform",
    value: "DevDAO Platform",
  },
  {
    title: "Events & Hackathons",
    value: "Events & Hackathons",
  },
  {
    title: "Engagement & Awareness",
    value: "Engagement & Awareness",
  },
  {
    title: "Decentralized DevRel",
    value: "Decentralized DevRel",
  },
  {
    title: "Universities & Bootcamps",
    value: "Universities & Bootcamps",
  },
  {
    title: "Tooling & Infrastructure",
    value: "Tooling & Infrastructure",
  },
  {
    title: "Other",
    value: "Other",
  },
];

return {
  portalName: "Infrastructure Committee",
  contract: "infrastructure-committee.near",
  proposalFeedIndexerQueryName:
    "polyprogrammist_near_devhub_ic_v1_proposals_with_latest_snapshot",
  rfpFeedIndexerQueryName:
    "polyprogrammist_near_devhub_ic_v1_rfps_with_latest_snapshot",
  indexerHasuraRole: "polyprogrammist_near",
  cacheUrl: "${REPL_CACHE_URL}",
  isInfra: true,
  proposalFeedAnnouncement,
  availableCategoryOptions: getGlobalLabels(),
};
