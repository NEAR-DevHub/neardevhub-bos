/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */

const ticketStates = {
  closed: { displayName: "Closed", icon: "bi-lock-fill" },
  open: { displayName: "Open", icon: "bi-unlock-fill" },
};

const ticketTypes = {
  Issue: { displayName: "Issue", icon: "bi-lightbulb-fill" },
  PullRequest: { displayName: "Pull request", icon: "bi-git" },
};

const GithubTicket = ({
  config,

  data: {
    _links,
    labels,
    number,
    state: ticketState,
    title,
    type,
    user: author,
  },
}) => {
  const header = (
    <div className="card-header">
      <div class="d-flex justify-content-start gap-3">
        <i
          className={`bi ${ticketStates[ticketState].icon}`}
          title={ticketStates[ticketState].displayName}
        />

        {config.features?.author ?? true ? (
          <a
            className="d-flex gap-2 link-dark text-truncate"
            href={author.html_url}
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt={`${author.login}'s GitHub avatar`}
              className="img-fluid rounded"
              src={author.avatar_url}
              style={{ width: 24, height: 24 }}
            />

            <span className="text-muted">@{author.login}</span>
          </a>
        ) : null}

        <a
          className="card-link ms-auto"
          href={_links.html.href}
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
      {config.features?.type ?? true ? (
        <i className={`bi ${ticketTypes[type].icon}`} />
      ) : null}

      <span>
        {[
          `${
            config.features?.type ?? true ? ticketTypes[type].displayName : ""
          } ${
            config.features?.id ?? true ? `#${number.toString()}` : ""
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

  const labelList =
    config.features?.labels ?? true ? (
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

return GithubTicket(props);
