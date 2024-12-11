const proposalFeedAnnouncement = (
  <div className="text-muted bg-grey text-sm mt-2 p-3 rounded-3">
    <p className="d-flex gap-3 align-items-center mb-0">
      <div>
        <i class="bi bi-info-circle"></i>
      </div>
      <div>
        <span className="fw-bold">
          Welcome to
          <a
            href="?page=community&handle=developer-dao&tab=overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            DevDAO’s Proposal Feed!
          </a>
        </span>
        This space makes it easy to submit and track funding requests from
        DevDAO. To submit a formal proposal, click New Proposal. See our{" "}
        <a
          href="?page=community&handle=developer-dao&tab=funding"
          className="text-decoration-underline no-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          guidelines
        </a>
        for details. You can also explore relevant{" "}
        <a
          href="?page=communities"
          className="text-decoration-underline no-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          communities
        </a>{" "}
        to connect and collaborate with builders.
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
  portalName: "Devhub",
  contract: "devhub.near",
  proposalFeedIndexerQueryName:
    "polyprogrammist_near_devhub_prod_v1_proposals_with_latest_snapshot",
  cacheUrl: "${REPL_CACHE_URL}",
  indexerHasuraRole: "polyprogrammist_near",
  isDevhub: true,
  proposalFeedAnnouncement,
  availableCategoryOptions: categoryOptions,
};
