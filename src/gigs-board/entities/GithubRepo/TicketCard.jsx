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

const {
  data: { id, _links, description, labels, number, title, type, user },
} = props;

const header = (
  <div className="card-header">
    <small class="text-muted">
      <div class="row justify-content-between">
        <div class="col-4">
          <a
            className="link-dark text-truncate"
            href={user.html_url}
            target="_blank"
          >
            <img alt={`${user.login}'s GitHub avatar`} src={user.avatar_url} />
            <span className="text-muted">@{user.login}</span>
          </a>
        </div>

        <div class="col-5">
          <div class="d-flex justify-content-end">
            <a
              class="card-link"
              href={_links.self}
              role="button"
              target="_blank"
              title="Open in new tab"
            >
              <div class="bi bi-share"></div>
            </a>
          </div>
        </div>
      </div>
    </small>
  </div>
);

return (
  <Card className="card my-2 border-secondary">
    {header}

    <div className="card-body">
      <div class="card-text">
        <div className="row justify-content-between">
          <div class="col-9">
            <i class={`bi ${ticketIcons[type]}`}></i>
            {type}: {title}
          </div>
        </div>
      </div>

      <LimitedMarkdown className="overflow-auto">
        <Markdown class="card-text" text={description}></Markdown>
      </LimitedMarkdown>

      <div class="card-title">
        {labels.map((label) => (
          <a href={href("Feed", { label })} key={label}>
            <span class="badge text-bg-primary me-1">{label}</span>
          </a>
        ))}
      </div>
    </div>
  </Card>
);
