const { getGlobalLabels } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

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
  contract: "treasury-templar.near",
  proposalFeedIndexerQueryName:
    "polyprogrammist_near_devhub_ic_v1_proposals_with_latest_snapshot",
  rfpFeedIndexerQueryName:
    "polyprogrammist_near_devhub_ic_v1_rfps_with_latest_snapshot",
  indexerHasuraRole: "polyprogrammist_near",
  isInfra: true,
  aavailableCategoryOptions: getGlobalLabels(),
};
