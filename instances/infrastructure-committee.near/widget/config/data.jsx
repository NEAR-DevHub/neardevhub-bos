const { getGlobalLabels } = VM.require(
  `${REPL_INFRASTRUCTURE_COMMITTEE}/widget/components.core.lib.contract`
) || { getGlobalLabels: () => {} };

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
        To submit proposals, visit the
        <a
          href="https://nearn.io/infra-committee/"
          className="text-decoration-underline d-inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          NEARN Infrastructure Committee
        </a>
        page to view the latest opportunities.
      </div>
    </div>
  </BannerWrapper>
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
