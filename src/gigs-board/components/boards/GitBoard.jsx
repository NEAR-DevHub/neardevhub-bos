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

const {
  boardId = null,
  contentTypes = { pullRequest: false, issue: false },
  columns,
  excludedLabels = [],
  linkedPage,
  name,
  repoURL = null,
  requiredLabels = [],
} = props;

State.init({
  itemsByLabel: {},
});

if (repoURL) {
  if (contentTypes.pullRequest) {
    const response = fetch(
      `https://api.github.com/repos/${repoURL
        .split("/")
        .slice(-2, -1)
        .join("/")}/pulls`
    );

    console.log(response.body);

    const pullRequestsByLabel = (response.body ?? []).reduce(
      (registry, item) => ({ ...registry, [item.labels[0]]: [item] }),
      {}
    );

    console.log(pullRequestsByLabel);
  }

  if (contentTypes.issue) {
    const response = fetch(
      `https://api.github.com/repos/${repoURL
        .split("/")
        .slice(-2, -1)
        .join("/")}/issues`
    );

    const issuesByLabel = (response.body ?? []).reduce(
      (registry, issue) => ({ ...registry, [issue.labels[0]]: issue }),
      {}
    );

    console.log(issuesByLabel);
  }
}

return (
  <div>
    <div class="row mb-2">
      {boardId ? (
        <div class="col">
          <small class="text-muted">
            <a
              class="card-link"
              href={href(linkedPage, { boardId })}
              role="button"
              target="_blank"
              title="Link to this board"
            >
              <span class="hstack gap-3">
                <i class="bi bi-share"></i>
                <span>Link to this board</span>
              </span>
            </a>
          </small>
        </div>
      ) : null}
    </div>

    <div class="row">
      {Object.entries(state.itemsByLabel).map(([label, items]) => (
        <div class="col-3" key={label}>
          <div class="card">
            <div class="card-body border-secondary">
              <h6 class="card-title">
                {label} ({items.length})
              </h6>

              {items.map((item) => {
                // widget("components.posts.CompactPost", { id: postId }, postId)
                return item;
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
