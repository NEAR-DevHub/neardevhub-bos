/* INCLUDE: "shared/lib/gui" */
const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;
/* END_INCLUDE: "shared/lib/gui" */

const ticketStates = {
  closed: { displayName: "Closed", icon: "bi-lock-fill" },
  open: { displayName: "Open", icon: "bi-unlock-fill" },
};

const ticketTypes = {
  Issue: { displayName: "Issue", icon: "bi-lightbulb-fill" },
  PullRequest: { displayName: "Pull request", icon: "bi-git" },
};

const GithubRepoTicket = ({
  data: { _links, labels, number, state: ticketState, title, type, user },
}) => (
  <Card className="card border-secondary">
    <div className="card-header">
      <small className="text-muted">
        <div className="row justify-content-between align-items-center">
          <div className="col-4">
            <a
              className="link-dark text-truncate text-decoration-none"
              href={user.html_url}
              rel="noreferrer"
              target="_blank"
            >
              <img
                alt={`${user.login}'s GitHub avatar`}
                className="img-fluid rounded"
                src={user.avatar_url}
              />

              <span className="ms-1 text-muted">@{user.login}</span>
            </a>
          </div>

          <div className="col-1 d-flex justify-content-end">
            <a
              className="card-link"
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
      </small>
    </div>

    <div className="card-body d-flex flex-column gap-3">
      <div className="card-text d-flex flex-column gap-3">
        <span className="d-flex flex-nowrap gap-2">
          <i
            className={`bi ${ticketStates[ticketState].icon}`}
            title={ticketStates[ticketState].displayName}
          />

          <i className={`bi ${ticketTypes[type].icon}`} />
          <span>{`${ticketTypes[type].displayName} #${number}`}</span>
        </span>

        <span>{title}</span>
      </div>

      <div className="card-title d-flex flex-wrap gap-2 m-0">
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
    </div>
  </Card>
);

return GithubRepoTicket(props);
