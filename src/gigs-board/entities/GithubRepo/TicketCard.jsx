/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

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
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const Card = styled.div`
  &:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }
`;

const LimitedMarkdown = styled.div`
  max-height: 6em;
`;

const ticketIcons = {
  Issue: "bi-lightbulb",
  PullRequest: "bi-git",
};

const GithubRepoTicketCard = ({
  data: { _links, labels, number, title, type, user },
}) => (
  <Card className="card my-2 border-secondary">
    <div className="card-header">
      <small class="text-muted">
        <div class="row justify-content-between">
          <div class="col-4">
            <a
              className="link-dark text-truncate"
              href={user.html_url}
              rel="noreferrer"
              target="_blank"
            >
              <img
                alt={`${user.login}'s GitHub avatar`}
                src={user.avatar_url}
              />
              <span className="text-muted">@{user.login}</span>
            </a>
          </div>

          <div class="col-5">
            <div class="d-flex justify-content-end">
              <a
                class="card-link"
                href={_links.self}
                rel="noreferrer"
                role="button"
                target="_blank"
                title="Open in new tab"
              >
                <i class="bi bi-share" />
              </a>
            </div>
          </div>
        </div>
      </small>
    </div>

    <div className="card-body">
      <div class="card-text">
        <div className="row justify-content-between">
          <div class="col-9">
            <i class={`bi ${ticketIcons[type]}`} />
            {type} #{number}: {title}
          </div>
        </div>
      </div>

      <div class="card-title">
        {labels.map((label) => (
          <a href={label.url} key={label.id} title={label.description}>
            <span
              class="badge text-bg-primary me-1"
              style={{ backgroundColor: label.color }}
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
