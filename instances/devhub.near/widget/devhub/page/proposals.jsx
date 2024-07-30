const announcement = (
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
            DevDAO’s New Proposal Feed!
          </a>
        </span>
        This dedicated space replaces the
        <a
          href="?page=feed"
          className="text-decoration-underline no-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          old activity feed
        </a>
        , making it easier to submit and track funding requests from DevDAO, the
        primary organization behind DevHub. To submit a formal proposal, click
        New Proposal. See our{" "}
        <a
          href="?page=community&handle=developer-dao&tab=funding"
          className="text-decoration-underline no-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          guidelines
        </a>
        for details. For discussions and brainstorming, please utilize the
        relevant{" "}
        <a
          href="?page=communities"
          className="text-decoration-underline no-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          communities
        </a>
        .
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
return (
  <Widget
    src={"${REPL_DEVHUB}/widget/devhub.entity.proposal.Feed"}
    props={{
      instance: "devhub.near",
      announcement,
      availableCategoryOptions: categoryOptions,
    }}
  />
);
