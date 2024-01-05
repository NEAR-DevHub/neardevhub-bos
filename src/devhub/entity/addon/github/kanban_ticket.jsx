const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const ticketStates = {
  closed: { displayName: "Closed", icon: "bi-lock-fill" },
  open: { displayName: "Open", icon: "bi-unlock-fill" },
};

const ticketTypes = {
  Issue: { displayName: "Issue", icon: "bi-lightbulb-fill" },
  PullRequest: { displayName: "Pull request", icon: "bi-git" },
};

const GithubKanbanTicket = ({
  metadata: { features },
  payload: {
    _links,
    labels,
    number,
    state: ticketState,
    title,
    type,
    user,
    url,
  },
}) => {
  const header = (
    <div className="card-header">
      <div class="d-flex justify-content-start gap-3">
        <i
          className={`bi ${ticketStates[ticketState].icon}`}
          title={ticketStates[ticketState].displayName}
        />

        {features.author ? (
          <a
            className="d-flex gap-2 link-dark text-truncate"
            href={user.html_url}
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt={`${user.login}'s GitHub avatar`}
              className="img-fluid rounded"
              src={user.avatar_url}
              style={{ width: 24, height: 24 }}
            />

            <span className="text-muted">@{user.login}</span>
          </a>
        ) : null}

        <a
          className="card-link ms-auto"
          href={_links?.html?.href ?? url}
          rel="noreferrer"
          role="button"
          target="_blank"
          title="Open in new tab"
        >
          <i className="bi bi-share" />
        </a>
      </div>
    </div>
  );

  const titleArea = (
    <span className="card-text gap-2">
      {features.type ? <i className={`bi ${ticketTypes[type].icon}`} /> : null}

      <span>
        {[
          `${features.type ? ticketTypes[type].displayName : ""} ${
            features.id ? `#${number.toString()}` : ""
          }`.trim(),

          title,
        ]
          .filter(
            (maybeString) =>
              typeof maybeString === "string" && maybeString.length > 0
          )
          .join(": ")}
      </span>
    </span>
  );

  const labelList = features.labels ? (
    <div className="d-flex flex-wrap gap-2 m-0">
      {labels.map((label) => (
        <a href={label.url} key={label.id} title={label.description}>
          <span
            className="badge text-wrap"
            style={{ backgroundColor: `#${label.color}` }}
          >
            {label.name}
          </span>
        </a>
      ))}
    </div>
  ) : null;

  return (
    <AttractableDiv className="card border-secondary">
      {header}
      <div className="card-body d-flex flex-column gap-3">
        {titleArea}
        {labelList}
      </div>
    </AttractableDiv>
  );
};

return GithubKanbanTicket(props);
