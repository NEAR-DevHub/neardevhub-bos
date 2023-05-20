/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => {
  return {
    probablyUUIDv4: {
      id: "probablyUUIDv4",
      columns: [{ title: "Draft", labelFilters: ["S-draft"] }],
      dataTypes: { Issue: true, PullRequest: true },
      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },
  }[boardId];
};

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const FormCheckLabel = styled.label`
  white-space: nowrap;
`;
/* END_INCLUDE: "common.jsx" */

const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const LimitedMarkdown = styled.div`
  max-height: 6em;
`;

const ticketTypes = {
  Issue: { displayName: "Issue", icon: "bi-lightbulb" },
  PullRequest: { displayName: "Pull request", icon: "bi-git" },
};

const GithubRepoTicketCard = ({
  data: { _links, labels, number, title, type, user },
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
          <i className={`bi ${ticketTypes[type].icon}`} />
          <span>{`${ticketTypes[type].displayName} #${number}`}</span>
        </span>

        <span>{title}</span>
      </div>

      <div className="card-title d-flex flex-wrap gap-2 m-0">
        {labels.map((label) => (
          <a href={label.url} key={label.id} title={label.description}>
            <span
              className="badge"
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

return GithubRepoTicketCard(props);
